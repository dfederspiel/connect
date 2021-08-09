import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { IUserDataContext } from './data/UserDataContext';

const client = jwksClient({
  jwksUri: `${process.env.B2C_AUTHORITY}/${process.env.B2C_LOGIN_POLICY}/discovery/v2.0/keys`,
});

export class AuthContext {
  private context: IUserDataContext;

  constructor(context: IUserDataContext) {
    this.context = context;
  }

  getUser = async (token: any): Promise<User | null> => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!token) return null;
        const email = token.emails.length > 0 && token.emails[0];
        let user = await this.context.getByEmail(email);
        if (!user) {
          user = await this.context.createUser(email);
        }
        resolve(user);
      } catch (ex) {
        reject(ex);
      }
    });
  };

  decode = (token: string): Promise<string | any> => {
    return new Promise((resolve, reject) => {
      const jwtHeader = JSON.parse(
        Buffer.from(token.split('.')[0], 'base64').toString('utf8'),
      ) as any;
      console.log(jwtHeader);
      client.getSigningKey(jwtHeader.kid, async (err, key) => {
        if (err != null) {
          console.log('err:' + err);
        } else {
          const signingKey = key.getPublicKey();
          try {
            const decoded: any = jwt.verify(token, signingKey, {
              algorithms: ['RS256'],
            });
            resolve(decoded);
          } catch (ex) {
            //console.log("ERROR PROCESSING TOKEN", ex.message, token);
            reject(ex);
          }
        }
      });
    });
  };
}
