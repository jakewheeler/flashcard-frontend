import jwtDecode from 'jwt-decode';

interface JwtTokenPayload {
  username: string;
  iat: number;
  exp: number;
}

export function getDecodedJwt(token: string) {
  return jwtDecode<JwtTokenPayload>(token);
}
