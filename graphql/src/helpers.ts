import { AuthContext } from '@lib/auth/AuthContext';
import { ConnectionRef } from './lib/types';
import crypto from 'crypto';

export async function validateAndRetrieveUser(
  token: string | undefined,
  authContext: AuthContext,
  connections: ConnectionRef,
) {
  if (token) {
    const connectionId = crypto.createHash('sha1').update(token).digest('hex');
    console.log('CONTEXT', connectionId);

    if (!connections[connectionId]) {
      connections[connectionId] = {
        token,
        hits: 0,
        swaps: 0,
        updated: Date.now(),
      };
    }

    try {
      const decoded = await authContext.decode(connections[connectionId].token);
      const user = await authContext.getUser(decoded);
      return user;
    } catch (ex) {
      console.error('[X0001]', ex);
    }
  }
}

export function checkAndUpdateConnectionRefCache(
  token: string,
  message: { payload: { token: string } },
  connectionRefs: ConnectionRef,
) {
  const connectionId = crypto.createHash('sha1').update(token).digest('hex');

  if (connectionRefs[connectionId]) {
    const newTokenHash = crypto
      .createHash('sha1')
      .update(message?.payload?.token)
      .digest('hex');
    const oldTokenHash = crypto
      .createHash('sha1')
      .update(connectionRefs[connectionId].token)
      .digest('hex');
    const connection = connectionRefs[connectionId];
    connectionRefs[connectionId] = {
      token: newTokenHash !== oldTokenHash ? message?.payload?.token : connection.token,
      swaps: newTokenHash !== oldTokenHash ? connection.swaps + 1 : connection.swaps,
      hits: connection.hits + 1,
      updated: newTokenHash === oldTokenHash ? connection.updated : Date.now(),
    };
  }
  return { connectionId, connectionRefs };
}
