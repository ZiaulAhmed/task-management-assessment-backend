declare namespace Express {
  interface User {
    sub: string;
    email: string;
    isGuest: boolean;
  }
}