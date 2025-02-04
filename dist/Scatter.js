"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const scatterjs_core_1 = __importDefault(require("scatterjs-core"));
const scatterjs_plugin_eosjs2_1 = __importDefault(require("scatterjs-plugin-eosjs2"));
const universal_authenticator_library_1 = require("universal-authenticator-library");
const interfaces_1 = require("./interfaces");
const scatterLogo_1 = require("./scatterLogo");
const ScatterUser_1 = require("./ScatterUser");
const UALScatterError_1 = require("./UALScatterError");
class Scatter extends universal_authenticator_library_1.Authenticator {
    /**
     * Scatter Constructor.
     *
     * @param chains
     * @param options { appName } appName is a required option to use Scatter
     */
    constructor(chains, options) {
        super(chains);
        this.users = [];
        this.scatterIsLoading = false;
        this.initError = null;
        if (options && options.appName) {
            this.appName = options.appName;
        }
        else {
            throw new UALScatterError_1.UALScatterError('Scatter requires the appName property to be set on the `options` argument.', universal_authenticator_library_1.UALErrorType.Initialization, null);
        }
    }
    /**
     * Checks Scatter for a live connection.  Will set an Initialization Error
     * if we cannot connect to scatter.
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.scatterIsLoading = true;
            scatterjs_core_1.default.plugins(new scatterjs_plugin_eosjs2_1.default());
            // set an errored state if scatter doesn't connect
            if (!(yield scatterjs_core_1.default.scatter.connect(this.appName))) {
                this.initError = new UALScatterError_1.UALScatterError('Error occurred while connecting', universal_authenticator_library_1.UALErrorType.Initialization, null);
                this.scatterIsLoading = false;
                return;
            }
            this.scatter = scatterjs_core_1.default.scatter;
            window.ScatterJS = null;
            this.scatterIsLoading = false;
        });
    }
    reset() {
        this.initError = null;
        // tslint:disable-next-line:no-floating-promises
        this.init();
    }
    isLoading() {
        return this.scatterIsLoading;
    }
    isErrored() {
        return !!this.initError;
    }
    getError() {
        return this.initError;
    }
    getStyle() {
        return {
            icon: scatterLogo_1.scatterLogo,
            text: interfaces_1.Name,
            textColor: 'white',
            background: '#62D0FD'
        };
    }
    /**
     * Scatter will only render on Desktop Browser Environments
     */
    shouldRender() {
        if (!this.isMobile()) {
            return true;
        }
        return false;
    }
    shouldAutoLogin() {
        return false;
    }
    login(_) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const chain of this.chains) {
                    const user = new ScatterUser_1.ScatterUser(chain, this.scatter);
                    yield user.getKeys();
                    this.users.push(user);
                }
                return this.users;
            }
            catch (e) {
                throw new UALScatterError_1.UALScatterError('Unable to login', universal_authenticator_library_1.UALErrorType.Login, e);
            }
        });
    }
    /**
     * Call logout on scatter.  Throws a Logout Error if unsuccessful
     */
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.scatter.logout();
            }
            catch (error) {
                throw new UALScatterError_1.UALScatterError('Error occurred during logout', universal_authenticator_library_1.UALErrorType.Logout, error);
            }
        });
    }
    /**
     * Scatter provides account names so it does not need to request it
     */
    shouldRequestAccountName() {
        return __awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
    isMobile() {
        const userAgent = window.navigator.userAgent;
        const isIOS = userAgent.includes('iPhone') || userAgent.includes('iPad');
        const isMobile = userAgent.includes('Mobile');
        const isAndroid = userAgent.includes('Android');
        const isCustom = userAgent.toLowerCase().includes('eoslynx');
        return isIOS || isMobile || isAndroid || isCustom;
    }
    getOnboardingLink() {
        return 'https://get-scatter.com/';
    }
    requiresGetKeyConfirmation() {
        return false;
    }
}
exports.Scatter = Scatter;
