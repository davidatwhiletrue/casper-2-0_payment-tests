import {
    HttpHandler,
    NativeDelegateBuilder, NativeRedelegateBuilder,
    NativeTransferBuilder, NativeUndelegateBuilder,
    PublicKey, RpcClient,
    Transaction,
} from "casper-js-sdk";
import {BigNumber} from "@ethersproject/bignumber";
import {PrivateKey} from "casper-js-sdk";
import 'dotenv/config'; // Load environment variables

export enum TRANSACTiON_MODEL {
    TRANSACTIONV1 = 'TransactionV1',
    DEPLOY = 'Deploy',
}

const NODE_URL = process.env.CASPER_NODE_URL || 'http://127.0.0.1:11101/rpc';

export const getAuctionContractHash = async () => {
    const rpcHandler = new HttpHandler(NODE_URL);
    const rpcClient = new RpcClient(rpcHandler);
    const response = await rpcClient.queryLatestGlobalState('system-entity-registry-0000000000000000000000000000000000000000000000000000000000000000', []);
    const value = response.storedValue.clValue.map.getMap()['auction'];
    return value.toString();
};

export const transfer = (
    networkName: string,
    senderKeypair: PrivateKey,
    recipientPublicKey: PublicKey,
    paymentAmount: number,
    transferAmount: number,
    transferId: any,
    transactionModel: TRANSACTiON_MODEL): Transaction => {

    const builder = new NativeTransferBuilder()
        .from(senderKeypair.publicKey)
        .target(recipientPublicKey)
        .amount(BigNumber.from(transferAmount)) // Amount in motes
        .id(transferId)
        .chainName(networkName)
        .payment(paymentAmount)

    const transaction = transactionModel === TRANSACTiON_MODEL.DEPLOY
        ? builder.buildFor1_5()
        : builder.build();

    transaction.sign(senderKeypair);

    return transaction;
};

export const delegate = (
    networkName: string,
    senderKeypair: PrivateKey,
    validatorPublicKey: PublicKey,
    paymentAmount: number,
    delegatedAmount: number,
    transactionModel: TRANSACTiON_MODEL,
    auctionContractHash?: string): Transaction => {

    const builder = new NativeDelegateBuilder()
        .from(senderKeypair.publicKey)
        .validator(validatorPublicKey)
        .amount(BigNumber.from(delegatedAmount)) // Amount in motes
        .chainName(networkName)
        .payment(paymentAmount)

    const transaction = transactionModel === TRANSACTiON_MODEL.DEPLOY
        ? builder.contractHash(auctionContractHash).buildFor1_5()
        : builder.build();

    transaction.sign(senderKeypair);

    return transaction;
};

export const undelegate = (
    networkName: string,
    senderKeypair: PrivateKey,
    validatorPublicKey: PublicKey,
    paymentAmount: number,
    undelegatedAmount: number,
    transactionModel: TRANSACTiON_MODEL,
    auctionContractHash?: string): Transaction => {

    const builder = new NativeUndelegateBuilder()
        .from(senderKeypair.publicKey)
        .validator(validatorPublicKey)
        .amount(BigNumber.from(undelegatedAmount)) // Amount in motes
        .chainName(networkName)
        .payment(paymentAmount)


    const transaction = transactionModel === TRANSACTiON_MODEL.DEPLOY
        ? builder.contractHash(auctionContractHash).buildFor1_5()
        : builder.build();

    transaction.sign(senderKeypair);

    return transaction;
};

export const redelegate = (
    networkName: string,
    senderKeypair: PrivateKey,
    oldValidatorPublicKey: PublicKey,
    newValidatorPublicKey: PublicKey,
    paymentAmount: number,
    redelegatedAmount: number,
    transactionModel: TRANSACTiON_MODEL,
    auctionContractHash?: string): Transaction => {

    const builder = new NativeRedelegateBuilder()
        .from(senderKeypair.publicKey)
        .validator(oldValidatorPublicKey)
        .newValidator(newValidatorPublicKey)
        .amount(BigNumber.from(redelegatedAmount)) // Amount in motes
        .chainName(networkName)
        .payment(paymentAmount)

    const transaction = transactionModel === TRANSACTiON_MODEL.DEPLOY
        ? builder.contractHash(auctionContractHash).buildFor1_5()
        : builder.build();

    transaction.sign(senderKeypair);

    return transaction;
};
