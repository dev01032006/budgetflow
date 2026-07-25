export interface RegisterInput { name: string; email: string; password: string; }
export interface LoginInput { email: string; password: string; }
export interface AuthUserResponse { id: string; name: string; email: string; currency: string; }
export interface AuthTokens { accessToken: string; refreshToken: string; }
export interface LoginResponse { user: AuthUserResponse; tokens: AuthTokens; }
