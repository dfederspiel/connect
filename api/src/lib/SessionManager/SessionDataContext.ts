import { Session } from './Session';

import axios from 'axios';

export interface IDataContext<T> {
  getAll(): Promise<T[]>;
  get(id: string): Promise<T | null>;
  post(item: T): Promise<T>;
  delete(id: string): Promise<T>;
  put(item: T): Promise<T>;
}

export default class SessionDataContext implements IDataContext<Session> {
  async getAll(): Promise<Session[]> {
    return axios
      .get<Session[]>('/api/sessions')
      .then((d) => d.data)
      .catch((e) => {
        console.log(e);
        return [];
      });
  }
  async get(id: string): Promise<Session> {
    return axios
      .get<Session>(`/api/sessions/${id}`)
      .then((d) => d.data)
      .catch((e) => {
        console.log(e);
        return {} as Session;
      });
  }

  async getByTeamAndUserId(teamId: string, userId: string): Promise<Session> {
    return axios
      .get<Session>(`/api/sessions?teamId=${teamId}&userId=${userId}`)
      .then((d) => d.data)
      .catch((e) => {
        console.log(e);
        return {} as Session;
      });
  }

  async post(item: Session): Promise<Session> {
    return await axios
      .request<Session>({
        url: '/api/sessions',
        method: 'post',
        data: item,
      })
      .then((response) => {
        return response.data;
      });
  }
  async delete(id: string): Promise<Session> {
    return await axios.delete(`/api/sessions/${id}`);
  }
  async put(session: Session): Promise<Session> {
    return await axios.request({
      url: `/api/sessions/${session.id}`,
      data: session,
      method: 'put',
    });
  }
}
