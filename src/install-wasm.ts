import {
    Args,
    CLValue,
    CLValueUInt64,
    HttpHandler,
    KeyAlgorithm,
    PrivateKey,
    PublicKey,
    RpcClient,
    CLValueBool,
    CLValueString, SessionBuilder
} from "casper-js-sdk";
import * as fs from 'fs/promises';
import {waitForTransaction} from "./utils";

const {program} = require('commander');

program
    .option('--wasm [value]', 'path to LS contract wasm file')
    .option('--sender [value]', 'path to contract owners keys')
    .option('--keys_algo [value]', 'Crypto algo ed25519 | secp256K1', 'ed25519')
    .option('--node_url [value]', 'node URL in format {http://localhost:11101/rpc}', 'http://localhost:11101/rpc')
    .option('--network_name [value]', 'network_name', 'casper-net-1')
    .option('--payment [value]', 'amount to transfer')


program.parse();

const options = program.opts();

export const getSenderKey = async (filePath: string) => {
    const pem = await fs.readFile(filePath);
    return PrivateKey.fromPem(pem.toString(),
        KeyAlgorithm.ED25519
    );
}

const install = async () => {

    const owner = await getSenderKey(options.sender);
    const contractWasm = await fs.readFile(options.wasm);
    const paymentAmount = Number.parseInt(options.payment);

    const args = Args.fromMap({
        name: CLValue.newCLString("cep18 test"),
        symbol: CLValue.newCLString("CEP18T"),
        decimals: CLValue.newCLUint8(9),
        total_supply: CLValue.newCLUInt256(1000000000000),
        events_mode: CLValue.newCLUint8(0),
        enable_mint_burn: CLValue.newCLUint8(1),
    });

    const transaction = new SessionBuilder()
        .from(owner.publicKey)
        .installOrUpgrade()
        .runtimeArgs(args)
        .wasm(new Uint8Array(contractWasm))
        .payment(paymentAmount) // Amount in motes
        .chainName(options.network_name)
        .build();
    transaction.sign(owner);

    try {
        const rpcHandler = new HttpHandler(options.node_url);
        const rpcClient = new RpcClient(rpcHandler);
        const result = await rpcClient.putTransaction(transaction);
        console.log("Transaction hash: ", result.transactionHash);

        const response = await waitForTransaction(rpcClient, result.transactionHash.toString());
        console.log("Transaction executionInfo: ", response.executionInfo);
        console.log("Transaction cost: ", response.executionInfo.executionResult.cost);
        console.log("Transaction payment: ", response.executionInfo.executionResult.payment);
        console.log("Transaction consumed: ", response.executionInfo.executionResult.consumed);
        console.log("Transaction refund: ", response.executionInfo.executionResult.refund);
        return
    }
    catch (err) {
        console.log("Error: ", err);
    }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
install();
