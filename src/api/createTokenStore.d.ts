export interface TokenStore {
  setTokens(accessToken: string, refreshToken: string): Promise<void>;
  getAccessToken(): Promise<string | null>;
  getRefreshToken(): Promise<string | null>;
  clearTokens(): Promise<void>;
  setResetToken(token: string): Promise<void>;
  getResetToken(): Promise<string | null>;
  clearResetToken(): Promise<void>;
}

declare const createTokenStore: (prefix?: string) => TokenStore;

export default createTokenStore;
