import { Chain, SignTransactionResponse, User } from 'universal-authenticator-library';
export declare class ScatterUser extends User {
    private chain;
    private scatter;
    private api;
    private rpc;
    private keys;
    private accountName;
    constructor(chain: Chain, scatter: any);
    signTransaction(transaction: any, { broadcast, blocksBehind, expireSeconds }: {
        broadcast?: boolean | undefined;
        blocksBehind?: number | undefined;
        expireSeconds?: number | undefined;
    }): Promise<SignTransactionResponse>;
    verifyKeyOwnership(challenge: string): Promise<boolean>;
    signArbitrary(publicKey: string, data: string, _: string): Promise<string>;
    getAccountName(): Promise<string>;
    getChainId(): Promise<string>;
    getKeys(): Promise<string[]>;
    private refreshIdentity;
}
