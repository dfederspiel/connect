'use strict';

import { Session } from './Session';
import Authorization from './Authorization';
// import { IDataContext } from "../../../lib/types";
import SessionDataContext from './SessionDataContext';

export interface IDataContext<T> {
  getAll(): Promise<T[]>;
  get(id: string): Promise<T | null>;
  post(item: T): Promise<T>;
  delete(id: string): Promise<T>;
  put(item: T): Promise<T>;
}

/**
 * @description Session manager
 */
export default class SessionManager {
  private _sessions: Session[];
  _context: SessionDataContext;

  constructor(context: IDataContext<Session>) {
    this._sessions = [];
    this._context = context as SessionDataContext;
  }

  get sessions(): Session[] {
    return this._sessions;
  }

  set sessions(sessions) {
    this._sessions = sessions;
  }

  async get(): Promise<Session[]> {
    return await this._context.getAll();
  }

  /**
   * @param {String} userId
   * @returns {Boolean} Login Status
   */
  authorized(teamId: string, userId: string): boolean {
    const session = this.sessions.find((x) => {
      return x.slackTeamId == teamId && x.slackUserId == userId;
    });
    return session != undefined && session.authorization != undefined;
  }

  /**
   * @description Retrieves a user session, or creates on if no session exists
   * @param {String} userId User Id Key
   * @returns {Session} User Session object
   */
  session(teamId: string, userId: string): Session {
    if (this._session(teamId, userId) === undefined) {
      this._sessions.push({
        slackTeamId: teamId,
        slackUserId: userId,
      } as Session);
    }
    let session = this._session(teamId, userId);
    if (!session) session = {} as Session;

    return session;
  }

  private _session(teamId: string, userId: string): Session | undefined {
    const session = this._sessions.find(
      (session) => session.slackTeamId == teamId && session.slackUserId == userId,
    );
    return session;
  }

  authorizationHeader(teamId: string, userId: string) {
    return 'Bearer ' + this.session(teamId, userId)?.authorization?.token;
  }

  /**
   * @param {String} teamId
   * @param {String} userId
   * @param {String} token
   * @param {String} username
   */
  addAuthorization(teamId: string, userId: string, token: string, username: string) {
    const session = this.session(teamId, userId);
    session.authorization = new Authorization(token, username);
  }
}
