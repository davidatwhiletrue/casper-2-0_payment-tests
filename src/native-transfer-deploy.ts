import {
    HttpHandler,
    RpcClient,
    PublicKey,
    NativeTransferBuilder
} from "casper-js-sdk";
import {BigNumber} from "@ethersproject/bignumber";
import {getPrivateKey, waitForTransaction} from "./utils";
const {program} = require('commander');

program
    .option('--sender [value]', 'path to sender keys')
    .option('--keys_algo [value]', 'Crypto algo ed25519 | secp256k1', 'ed25519')
    .option('--node_url [value]', 'node URL in format {http://localhost:11101/rpc}', 'http://localhost:11101/rpc')
    .option('--network_name [value]', 'network_name', 'casper-net-1')
    .option('--recipient [value]', 'recipient\'s public key')
    .option('--amount [value]', 'amount to transfer')
    .option('--payment [value]', 'amount to transfer')
    .option('--id [value]', 'transfer id')
    .option('--test_case [value]', 'test case name', "none")

program.parse();

const options = program.opts();

const transfer_deploy = async () => {
    const sender = await getPrivateKey(options.sender, options.keys_algo);
    const recipientKey = PublicKey.fromHex(options.recipient);
    const paymentAmount = Number.parseInt(options.payment);
    const amount = BigNumber.from(options.amount);
    const transferId = Date.now();

    const transaction = new NativeTransferBuilder()
        .from(sender.publicKey)
        .target(recipientKey)
        .amount(amount) // Amount in motes
        .id(transferId)
        .chainName(options.network_name)
        .payment(paymentAmount)
        .buildFor1_5();

    transaction.sign(sender);

    try {
        const rpcHandler = new HttpHandler(options.node_url);
        const rpcClient = new RpcClient(rpcHandler);
        await rpcClient.putTransaction(transaction);
        const response = await waitForTransaction(rpcClient, transaction);
        console.log(options.test_case + ";" +
            transaction.hash.toHex() + ";" +
            paymentAmount + ";" +
            response.executionInfo.executionResult.cost + ";" +
            response.executionInfo.executionResult.consumed + ";" +
            response.executionInfo.executionResult.refund + ";" +
            response.executionInfo.executionResult.limit);
        return
    }
    catch (err) {
        console.log("Error: ", err);
    }

};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
transfer_deploy();

