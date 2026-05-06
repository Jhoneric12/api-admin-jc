import { Algorithm, SignOptions } from "jsonwebtoken";

export interface JWTSignOptionInterface extends SignOptions {
  issuer: string;
  audience: string;
  algorithm: Algorithm;
  expiresIn: SignOptions["expiresIn"];
}
