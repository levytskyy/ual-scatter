import { Authenticator, ButtonStyle, Chain, UALError, User } from 'universal-authenticator-library';
export declare class Scatter extends Authenticator {
    private users;
    private scatter;
    private appName;
    private scatterIsLoading;
    private initError;
    /**
     * Scatter Constructor.
     *
     * @param chains
     * @param options { appName } appName is a required option to use Scatter
     */
    constructor(chains: Chain[], options?: any);
    /**
     * Checks Scatter for a live connection.  Will set an Initialization Error
     * if we cannot connect to scatter.
     */
    init(): Promise<void>;
    reset(): void;
    isLoading(): boolean;
    isErrored(): boolean;
    getError(): UALError | null;
    getStyle(): ButtonStyle;
    /**
     * Scatter will only render on Desktop Browser Environments
     */
    shouldRender(): boolean;
    shouldAutoLogin(): boolean;
    login(_?: string): Promise<User[]>;
    /**
     * Call logout on scatter.  Throws a Logout Error if unsuccessful
     */
    logout(): Promise<void>;
    /**
     * Scatter provides account names so it does not need to request it
     */
    shouldRequestAccountName(): Promise<boolean>;
    isMobile(): boolean;
    getOnboardingLink(): string;
    requiresGetKeyConfirmation(): boolean;
}
