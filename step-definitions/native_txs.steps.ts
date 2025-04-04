import {Given, When, Then, setWorldConstructor, World, setDefaultTimeout, BeforeAll, Before} from '@cucumber/cucumber';
import {getPublicKey, getPrivateKey, waitForTransaction, sendTransfer} from "../src/utils";
import {
    delegate,
    getAuctionContractHash,
    redelegate,
    TRANSACTiON_MODEL,
    transfer,
    undelegate
} from "../src/transactions";
import {HttpHandler, RpcClient, Transaction} from "casper-js-sdk";
import {
    NETWORK_NAME,
    NODE_URL,
    ACCOUNT_1_SECRET_KEY,
    ACCOUNT_2_PUBLIC_KEY,
    VALIDATOR_1_PUBLIC_KEY,
    VALIDATOR_2_PUBLIC_KEY,
    NEWACCOUNT_1_PUBLIC_KEY,
    NEWACCOUNT_2_PUBLIC_KEY,
    NEWACCOUNT_2_SECRET_KEY,
    ACCOUNT_1_PUBLIC_KEY,
    NEWACCOUNT_1_SECRET_KEY
} from "../src/constants";

/**
 * Interface defining the structure of the world object.
 */
interface TransferTransactionWorld extends World {
    transactionModel?: TRANSACTiON_MODEL;
    nativeCall?: string;
    sender?: any;
    recipient?: any;
    newValidator?: any;
    inputAmount?: number;
    transactionPayment?: number;
    consumedAmount?: number;
    refundAmount?: number;
    costAmount?: number;
    transactionHash?: string;

    transaction: Transaction;
}

setWorldConstructor(function (this: TransferTransactionWorld) {
});
setDefaultTimeout(60000); // 60 seconds for all steps

BeforeAll(async function () {
    global.auctionContractHash = await getAuctionContractHash();

    const rpcHandler = new HttpHandler(NODE_URL);
    const rpcClient = new RpcClient(rpcHandler);

    // set up a new account with 2.5 CSPR
    await sendTransfer(
        rpcClient,
        NETWORK_NAME,
        await getPrivateKey(ACCOUNT_1_SECRET_KEY, 'ed25519'),
        await getPublicKey(NEWACCOUNT_1_PUBLIC_KEY, 'ed25519'),
        100_000_000,
        3000_000_000_000
    );
    await sendTransfer(
        rpcClient,
        NETWORK_NAME,
        await getPrivateKey(ACCOUNT_1_SECRET_KEY, 'ed25519'),
        await getPublicKey(NEWACCOUNT_2_PUBLIC_KEY, 'ed25519'),
        100_000_000,
        3_500_000_000
    );
    await sendTransfer(
        rpcClient,
        NETWORK_NAME,
        await getPrivateKey(NEWACCOUNT_2_SECRET_KEY, 'ed25519'),
        await getPublicKey(ACCOUNT_1_PUBLIC_KEY, 'ed25519'),
        100_000_000,
        2_500_000_000
    );
});

Given('an origin account with {string} CSPR', async function (this: TransferTransactionWorld, balance: string) {
    let senderKeyFile: string;
    switch (balance) {
        case 'almost_infinite':
            senderKeyFile = ACCOUNT_1_SECRET_KEY;
            break;
        case '3000':
            senderKeyFile = NEWACCOUNT_1_SECRET_KEY;
            break;
        case '1':
            senderKeyFile = NEWACCOUNT_2_SECRET_KEY;
            break;
        default:
            throw new Error(`Unknown sender account. (Use almost_infinite, 3000, 1`);
    }

    try {
        this.sender = await getPrivateKey(senderKeyFile, 'ed25519');
        console.log("Sender account loaded successfully");
    } catch (error: any) {
        throw new Error(`Failed to load sender key: ${error.message}`);
    }
});

When('the origin account sends a {string} {string} of {int} CSPR', async function (this: TransferTransactionWorld, native_call: string, transaction_model: string, inputAmount: number) {
    if (native_call !== 'Transfer' &&
        native_call !== 'Delegate' &&
        native_call !== 'Redelegate' &&
        native_call !== 'Undelegate') {
        throw new Error('Invalid native call');
    }
    if (transaction_model !== TRANSACTiON_MODEL.TRANSACTIONV1 &&
        transaction_model !== TRANSACTiON_MODEL.DEPLOY) {
        throw new Error('Invalid transaction model');
    }

    this.nativeCall = native_call;
    this.transactionModel = transaction_model;
    this.inputAmount = inputAmount * 1_000_000_000;

    switch (native_call) {
        case 'Transfer':
            const recipientKey = await getPublicKey(ACCOUNT_2_PUBLIC_KEY, 'ed25519');
            this.recipient = recipientKey;
            break;
        case 'Redelegate':
            const newValidatorKey = await getPublicKey(VALIDATOR_2_PUBLIC_KEY, 'ed25519');
            this.newValidator = newValidatorKey;
        case 'Delegate':
        case 'Undelegate':
            const validatorkey = await getPublicKey(VALIDATOR_1_PUBLIC_KEY, 'ed25519');
            this.recipient = validatorkey;
            break;
    }
});

When('the transaction payment is {float} CSPR', function (this: TransferTransactionWorld, payment: number) {
    this.transactionPayment = payment * 1_000_000_000;
    console.log(`Transaction payment set: ${this.transactionPayment} motes`);
});

Then('the transaction is rejected with error {string}', async function (this: TransferTransactionWorld, errorMessage: string) {
    if (!this.sender || !this.recipient || !this.inputAmount) {
        throw new Error('Transaction details are missing');
    }
    try {
        await sendTransaction(this);
    } catch (error: any) {
        if (!error.message.includes(errorMessage)) {
            throw new Error(`Expected error ${errorMessage} but got ${error.message}`);
        }
        console.log(`putTransaction failed as expected: ${error.message}`);
        return;
    }
    throw new Error('putTransaction succeeded unexpectedly');
});

Then('the transaction execution fails with error {string}', async function (this: TransferTransactionWorld, errorMessage: string) {
    if (!this.sender || !this.recipient || !this.inputAmount) {
        throw new Error('Transaction details are missing');
    }
    try {
        await sendTransaction(this);
        await waitForTransactionExecution(this);
    } catch (error: any) {

        if (!error.message.includes(errorMessage)) {
            throw new Error(`Expected error ${errorMessage} but got ${error.message}`);
        }
        console.log(`Transaction execution failed as expected: ${error.message}`);
        return;
    }
    throw new Error('Transaction execution succeeded unexpectedly');
});

Then('the transaction is executed successfully', async function (this: TransferTransactionWorld) {
    if (!this.sender || !this.recipient || !this.inputAmount) {
        throw new Error('Transaction details are missing');
    }

    try {
        await sendTransaction(this);
        await waitForTransactionExecution(this);
    } catch (error: any) {
        throw new Error(`Transaction execution failed: ${error.message}`);
    }
});

Then('the consumed amount is {int} motes', function (this: TransferTransactionWorld, payment: number) {
    if (this.consumedAmount !== payment) {
        throw new Error(`Expected ${payment} motes but got ${this.consumedAmount}`);
    }
    console.log(`Payment amount verified: ${payment} motes`);
});

Then('the transaction cost is {int} motes', function (this: TransferTransactionWorld, cost: number) {
    if (this.costAmount !== cost) {
        throw new Error(`Expected transaction cost ${cost} motes but got ${this.costAmount}`);
    }
    console.log(`Transaction cost verified: ${cost} motes`);
});

Then('the refund amount is {int} motes', function (this: TransferTransactionWorld, refund: number) {
    if (this.refundAmount !== refund) {
        throw new Error(`Expected refund ${refund} motes but got ${this.refundAmount}`);
    }
    console.log(`Refund amount verified: ${refund} motes`);
});

async function sendTransaction(world: TransferTransactionWorld): Promise<void> {
    const auctionContractHash = await getAuctionContractHash();
    switch (world.nativeCall) {
        case 'Transfer':
            world.transaction = transfer(
                NETWORK_NAME,
                world.sender,
                world.recipient,
                world.transactionPayment,
                world.inputAmount,
                1,
                world.transactionModel);
            break;
        case 'Delegate':
            world.transaction = delegate(
                NETWORK_NAME,
                world.sender,
                world.recipient,
                world.transactionPayment,
                world.inputAmount,
                world.transactionModel,
                global.auctionContractHash);
            break;
        case 'Redelegate':
            world.transaction = redelegate(
                NETWORK_NAME,
                world.sender,
                world.recipient,
                world.recipient,
                world.transactionPayment,
                world.inputAmount,
                world.transactionModel,
                global.auctionContractHash);
            break;
        case 'Undelegate':
            world.transaction = undelegate(
                NETWORK_NAME,
                world.sender,
                world.recipient,
                world.transactionPayment,
                world.inputAmount,
                world.transactionModel,
                global.auctionContractHash);
            break;
        default:
            throw new Error('Invalid native call');
    }

    try {
        const rpcHandler = new HttpHandler(NODE_URL);
        const rpcClient = new RpcClient(rpcHandler);
        await rpcClient.putTransaction(world.transaction);
        world.transactionHash = world.transaction.hash.toHex();
    } catch (error: any) {
        throw new Error(`Transaction execution failed: ${error.sourceErr.data}`);
    }
}

async function waitForTransactionExecution(world: TransferTransactionWorld): Promise<void> {
    try {
        const rpcHandler = new HttpHandler(NODE_URL);
        const rpcClient = new RpcClient(rpcHandler);
        const response = await waitForTransaction(rpcClient, world.transaction);

        if (response.executionInfo.executionResult.errorMessage) {
            throw new Error(response.executionInfo.executionResult.errorMessage);
        }
        world.consumedAmount = response.executionInfo.executionResult.consumed;
        world.refundAmount = response.executionInfo.executionResult.refund;
        world.costAmount = response.executionInfo.executionResult.cost;
    } catch (error: any) {
        throw new Error(`Transaction execution failed: ${error.sourceErr.data}`);
    }
}
