/* eslint-disable consistent-return */
import type { JwtPayload } from 'jwt-decode';

/* eslint-disable import/no-extraneous-dependencies */
import crypto from 'crypto-js';
import { jwtDecode } from 'jwt-decode';

const TOKEN = import.meta.env.VITE_LOGIN_TOKEN;

interface CustomJwtPayload extends JwtPayload {
    code?: string;
  }

// decode access token
export function decryptWithSecret(text: string) {
  const bytes = crypto.AES.decrypt(text, TOKEN);
  return bytes.toString(crypto.enc.Utf8);
}

export function decrypJwt(token: string) {
  try {
    const decodedToken = jwtDecode<CustomJwtPayload>(token);
    return decodedToken;
  } catch (err) {
    console.log(err);
  }
}
