"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const eosjs_1 = require("eosjs");
const ecc = __importStar(require("eosjs-ecc"));
const universal_authenticator_library_1 = require("universal-authenticator-library");
const UALScatterError_1 = require("./UALScatterError");
class ScatterUser extends universal_authenticator_library_1.User {
    constructor(chain, scatter) {
        super();
        this.chain = chain;
        this.scatter = scatter;
        this.keys = [];
        this.accountName = '';
        const rpcEndpoint = this.chain.rpcEndpoints[0];
        const rpcEndpointString = this.buildRpcEndpoint(rpcEndpoint);
        this.rpc = new eosjs_1.JsonRpc(rpcEndpointString);
        const network = {
            blockchain: 'eos',
            chainId: this.chain.chainId,
            protocol: rpcEndpoint.protocol,
            host: rpcEndpoint.host,
            port: rpcEndpoint.port,
        };
        const rpc = this.rpc;
        this.api = this.scatter.eos(network, eosjs_1.Api, { rpc, beta3: true });
    }
    signTransaction(transaction, { broadcast = true, blocksBehind = 3, expireSeconds = 30 }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const completedTransaction = yield this.api.transact(transaction, { broadcast, blocksBehind, expireSeconds });
                return this.returnEosjsTransaction(broadcast, completedTransaction);
            }
            catch (e) {
                throw new UALScatterError_1.UALScatterError('Unable to sign the given transaction', universal_authenticator_library_1.UALErrorType.Signing, e);
            }
        });
    }
    verifyKeyOwnership(challenge) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(new Error('verifyKeyOwnership failed'));
                }, 1000);
                this.scatter.authenticate(challenge).then((signature) => __awaiter(this, void 0, void 0, function* () {
                    const pubKey = ecc.recover(signature, challenge);
                    const myKeys = yield this.getKeys();
                    for (const key of myKeys) {
                        if (key === pubKey) {
                            resolve(true);
                        }
                    }
                    resolve(false);
                }));
            });
        });
    }
    signArbitrary(publicKey, data, _) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.scatter.getArbitrarySignature(publicKey, data);
        });
    }
    getAccountName() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.accountName) {
                yield this.refreshIdentity();
            }
            return this.accountName;
        });
    }
    getChainId() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.chain.chainId;
        });
    }
    getKeys() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.keys || this.keys.length === 0) {
                yield this.refreshIdentity();
            }
            return this.keys;
        });
    }
    refreshIdentity() {
        return __awaiter(this, void 0, void 0, function* () {
            const rpcEndpoint = this.chain.rpcEndpoints[0];
            try {
                const identity = yield this.scatter.getIdentity({
                    accounts: [{
                            blockchain: 'eos',
                            host: rpcEndpoint.host,
                            port: rpcEndpoint.port,
                            chainId: this.chain.chainId
                        }]
                });
                this.keys = [identity.accounts[0].publicKey];
                this.accountName = identity.accounts[0].name;
            }
            catch (e) {
                throw new UALScatterError_1.UALScatterError('Unable load user\'s identity', universal_authenticator_library_1.UALErrorType.DataRequest, e);
            }
        });
    }
}
exports.ScatterUser = ScatterUser;
