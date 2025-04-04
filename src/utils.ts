import fs from "fs/promises";
import {
    HttpHandler,
    InfoGetTransactionResult,
    KeyAlgorithm,
    PrivateKey,
    PublicKey,
    RpcClient,
    Transaction
} from "casper-js-sdk";
import {TRANSACTiON_MODEL, transfer} from "./transactions";
import {ACCOUNT_1_SECRET_KEY, NETWORK_NAME, NEWACCOUNT_1_PUBLIC_KEY, NODE_URL} from "./constants";

export const getPrivateKey = async (filePath: string, algo: string) => {
    const pem = await fs.readFile(filePath);
    const keyAlgo = algo == 'ed25519' ? KeyAlgorithm.ED25519 : KeyAlgorithm.SECP256K1;
    return PrivateKey.fromPem(pem.toString(), keyAlgo);
}

export const getPublicKey= async (filePath: string, algo: string) => {
    const pem = await fs.readFile(filePath);
    const keyAlgo = algo == 'ed25519' ? KeyAlgorithm.ED25519 : KeyAlgorithm.SECP256K1;
    return PublicKey.fromPem(pem.toString(), keyAlgo);
}

export const sendTransfer = async (
    rpcClient: RpcClient,
    networkName: string,
    senderKeypair: PrivateKey,
    recipientPublicKey: PublicKey,
    paymentAmount: number,
    transferAmount: number,
    transferId: any = 1,
): Promise<void> => {
    const transferTx = transfer(
        networkName,
        senderKeypair,
        recipientPublicKey,
        paymentAmount,
        transferAmount,
        transferId,
        TRANSACTiON_MODEL.TRANSACTIONV1);

    await rpcClient.putTransaction(transferTx);
    await waitForTransaction(rpcClient, transferTx);
}

export const waitForTransaction = async (
    rpcClient: RpcClient,
    transactionHash: Transaction,
    timeout = 60000
) => {
    let i = 0;
    const sleep = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    const timer = setTimeout(() => {
        throw new Error('Timeout');
    }, timeout);

    while (true) {
        let transactionInfo: InfoGetTransactionResult;
        if (transactionHash.getTransactionV1())
            transactionInfo = await rpcClient.getTransactionByTransactionHash(transactionHash.hash.toHex()); // YOu will need to create RPC client
        else
            transactionInfo = await rpcClient.getTransactionByDeployHash(transactionHash.hash.toHex()); // YOu will need to create RPC client

        const execution_result = transactionInfo.executionInfo?.executionResult
        if (execution_result) {
            clearTimeout(timer);
            return transactionInfo;
        } else {
            await sleep(400);
        }
    }
}
