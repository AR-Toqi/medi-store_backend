import jwt, { Secret } from "jsonwebtoken";

export const generateAccessToken = (
  payload: { id: string; email: string; role: string },
  secret: Secret,
  expiresIn: any
) => {
  return jwt.sign(payload, secret, {
    expiresIn,
  });
};

export const generateRefreshToken = (
  payload: { id: string; email: string; role: string },
  secret: Secret,
  expiresIn: any
) => {
  return jwt.sign(payload, secret, {
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret);
};
