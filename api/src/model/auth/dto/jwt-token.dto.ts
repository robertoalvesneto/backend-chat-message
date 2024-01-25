import { UserValidated } from './user.validated.auth.dto';

/**
 * Response type of login request
 */
export type JwtAccessToken = {
  access_token: {
    token: string;
    expires_in: string;
  };
  user: UserValidated;
};

/**
 * Type used to manipulate payload data used in jwt token
 */
export type Payload = {
  sub: string;
  name: string;
};
