import { TokenPayload } from 'src/auth/guards/auth.guard';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
