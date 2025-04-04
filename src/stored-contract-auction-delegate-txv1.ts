import {
    Args,
    HttpHandler,
    KeyAlgorithm,
    PrivateKey,
    RpcClient,
    SessionBuilder,
    CLValueString,
    CLValueUInt512,
    CLValueByteArray,
    Hash,
    CLValueList,
    CLTypeUInt8,
    CLValueUInt8,
    ExecutableDeployItem,
    ModuleBytes,
    DeployHeader,
    Deploy,
    ExecutionResult,
    PublicKey,
    NativeTransferBuilder, NativeDelegateBuilder, CLValueUInt256, ContractCallBuilder, CLValue
} from "casper-js-sdk";
import * as fs from 'fs/promises';
import {Parser} from '@make-software/ces-js-parser';
import {BigNumber} from "@ethersproject/bignumber";
import {getPrivateKey, waitForTransaction} from "./utils";

const {program} = require('commander');

program
    .option('--sender [value]', 'path to sender keys')
    .option('--keys_algo [value]', 'Crypto algo ed25519 | secp256k1', 'ed25519')
    .option('--node_url [value]', 'node URL in format {http://localhost:11101/rpc}', 'http://localhost:11101/rpc')
    .option('--network_name [value]', 'network_name', 'casper-net-1')
    .option('--validator [value]', 'validator\'s public key')
    .option('--amount [value]', 'amount to transfer')
    .option('--payment [value]', 'amount to transfer')
    .option('--id [value]', 'transfer id')

program.parse();

const options = program.opts();

const transfer = async () => {
    const sender = await getPrivateKey(options.sender, options.keys_algo);
    const validatorKey = PublicKey.fromHex(options.validator);
    const paymentAmount = Number.parseInt(options.payment);
    const amount = BigNumber.from(options.amount);

    try {
        const rpcHandler = new HttpHandler(options.node_url);
        const rpcClient = new RpcClient(rpcHandler);
        const result = await rpcClient.queryLatestGlobalState("system-entity-registry-0000000000000000000000000000000000000000000000000000000000000000", []);
        const auctionContract = result.storedValue.clValue.map.get("auction");
        console.log("auction contract:", auctionContract.toString());

        const args = Args.fromMap({
            delegator: CLValue.newCLPublicKey(sender.publicKey),
            validator: CLValue.newCLPublicKey(validatorKey),
            amount: CLValue.newCLUInt512(amount),
        });

        const transaction = new ContractCallBuilder()
            .from(sender.publicKey)
            .byHash(auctionContract.toString())
            .entryPoint('delegate')
            .runtimeArgs(args)
            .payment(paymentAmount) // Amount in motes
            .chainName(options.network_name)
            .build();

        transaction.sign(sender);

        const putTransactionResult = await rpcClient.putTransaction(transaction);
        console.log("Transaction hash: ", putTransactionResult.transactionHash);

        const response = await waitForTransaction(rpcClient, putTransactionResult.transactionHash.toString());
        console.log("Transaction cost: ", response.executionInfo.executionResult.cost);
        return
    } catch (err) {
        console.log("Error: ", err);
    }

};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
transfer();
transfer();
transfer();
transfer();
transfer();

