import {
    HttpHandler,
    RpcClient,
    PublicKey,
    NativeRedelegateBuilder
} from "casper-js-sdk";
import {BigNumber} from "@ethersproject/bignumber";
import {getPrivateKey, waitForTransaction} from "./utils";

const {program} = require('commander');

program
    .option('--sender [value]', 'path to sender keys')
    .option('--keys_algo [value]', 'Crypto algo ed25519 | secp256k1', 'ed25519')
    .option('--node_url [value]', 'node URL in format {http://localhost:11101/rpc}', 'http://localhost:11101/rpc')
    .option('--network_name [value]', 'network_name', 'casper-net-1')
    .option('--old_validator [value]', 'old validator\'s public key')
    .option('--new_validator [value]', 'new validator\'s public key')
    .option('--amount [value]', 'amount to transfer')
    .option('--payment [value]', 'amount to transfer')
    .option('--id [value]', 'transfer id')
    .option('--test_case [value]', 'test case name', "none")

program.parse();

const options = program.opts();

const redelegate = async () => {
    const sender = await getPrivateKey(options.sender, options.keys_algo);
    const oldValidator = PublicKey.fromHex(options.old_validator);
    const newValidator = PublicKey.fromHex(options.new_validator);
    const paymentAmount = Number.parseInt(options.payment);
    const amount = BigNumber.from(options.amount);

    const transaction = new NativeRedelegateBuilder()
        .from(sender.publicKey)
        .validator(oldValidator)
        .newValidator(newValidator)
        .amount(amount) // Amount in motes
        .chainName(options.network_name)
        .payment(paymentAmount)
        .build();

    transaction.sign(sender);

    try {
        const rpcHandler = new HttpHandler(options.node_url);
        const rpcClient = new RpcClient(rpcHandler);
        const result = await rpcClient.putTransaction(transaction);
        const response = await waitForTransaction(rpcClient, result.transactionHash.toString());
        console.log(options.test_case + ";" +
            transaction.hash.toHex() + ";" +
            paymentAmount + ";" +
            response.executionInfo.executionResult.cost + ";" +
            response.executionInfo.executionResult.consumed + ";" +
            response.executionInfo.executionResult.refund + ";" +
            response.executionInfo.executionResult.limit);
    } catch (err) {
        console.log("Error: ", err);
    }

};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
redelegate();

