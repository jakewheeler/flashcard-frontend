import client from '../api/client';
import { UserData } from '../types/user';

type Token = {
  accessToken: string;
};

export async function fetchToken(user: UserData): Promise<string> {
  const data = (await client().post<Token>('/auth/signin', user)).data
    .accessToken;
  return data;
}

export async function tryFetchLoggedInUser(): Promise<string> {
  const response = await client().get<string>('/auth/me');

  if (response.status === 200) {
    return response.data;
  }

  throw new Error('User token is not valid.');
}

export async function signUp(user: UserData): Promise<void> {
  const response = await client().post<void>('/auth/signup', user);

  if (response.status === 201) {
    return response.data;
  }

  throw new Error('Could not create account.');
}
