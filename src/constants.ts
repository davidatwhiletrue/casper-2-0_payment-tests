import 'dotenv/config'; // Load environment variables

export const NETWORK_NAME = process.env.CASPER_NETWORK_NAME || 'casper-net-1';
export const NODE_URL = process.env.CASPER_NODE_URL || 'http://127.0.0.1:11101/rpc';
export const ACCOUNT_1_SECRET_KEY = process.env.ACCOUNT_1_SECRET_KEY || '';
export const ACCOUNT_1_PUBLIC_KEY = process.env.ACCOUNT_1_PUBLIC_KEY || '';
export const ACCOUNT_2_SECRET_KEY = process.env.ACCOUNT_2_SECRET_KEY || '';
export const ACCOUNT_2_PUBLIC_KEY = process.env.ACCOUNT_2_PUBLIC_KEY || '';
export const VALIDATOR_1_SECRET_KEY = process.env.VALIDATOR_1_SECRET_KEY || '';
export const VALIDATOR_1_PUBLIC_KEY = process.env.VALIDATOR_1_PUBLIC_KEY || '';
export const VALIDATOR_2_SECRET_KEY = process.env.VALIDATOR_2_SECRET_KEY || '';
export const VALIDATOR_2_PUBLIC_KEY = process.env.VALIDATOR_2_PUBLIC_KEY || '';
export const NEWACCOUNT_1_SECRET_KEY = process.env.NEWACCOUNT_1_SECRET_KEY || '';
export const NEWACCOUNT_1_PUBLIC_KEY = process.env.NEWACCOUNT_1_PUBLIC_KEY || '';
export const NEWACCOUNT_2_SECRET_KEY = process.env.NEWACCOUNT_2_SECRET_KEY || '';
export const NEWACCOUNT_2_PUBLIC_KEY = process.env.NEWACCOUNT_2_PUBLIC_KEY || '';
