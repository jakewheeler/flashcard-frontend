import axios from 'axios';
import { UserData } from '../types/user';

type Token = {
  accessToken: string;
};

export async function fetchToken(user: UserData): Promise<string> {
  const data = (await axios.post<Token>('/auth/signin', user)).data.accessToken;
  return data;
}

export async function tryFetchLoggedInUser(token: string): Promise<string> {
  const response = await axios.get<string>('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 200) {
    return response.data;
  }

  throw new Error('User token is not valid.');
}
