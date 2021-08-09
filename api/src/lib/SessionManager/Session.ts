import Authorization from './Authorization';
export interface Session {
  id: string;
  userId: string;
  slackTeamId: string;
  slackUserId: string;
  name: string;
  email: string;
  authorization?: Authorization;
}
