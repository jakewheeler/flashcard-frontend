import axios from 'axios';
import { UserData } from '../types/user';

type Token = {
  accessToken: string;
};

export async function fetchToken(user: UserData): Promise<string> {
  const data = (await axios.post<Token>('/auth/signin', user)).data.accessToken;
  return data;
}
