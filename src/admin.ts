import axios from 'axios';
import { AdminAuthTokenResponse } from './types/api-responses';
import { User, UserSchema } from './types/user';

export class Admin {
  private readonly token: string;
  private readonly server: string;

  constructor(args: { url: string; token: string }) {
    const { token } = args;
    let { url } = args;

    if (url.endsWith('/')) url = url.slice(0, -1);
    this.server = url;
    this.token = token;
  }

  private headers() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Token ${this.token}`,
    };
  }

  public static async withCredentials(args: { url: string; username: string; password: string }): Promise<Admin> {
    const { url, username, password } = args;

    return new Promise(async (resolve, reject) => {
      try {
        const result = await axios({
          method: 'post',
          url: `${url}/api2/auth-token/`,
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            username: username,
            password: password,
          },
        });

        const parsed = AdminAuthTokenResponse.safeParse(result.data);

        if (parsed.success) {
          resolve(
            new Admin({
              url: url,
              token: parsed.data.token,
            }),
          );
        } else {
          reject(parsed.error);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  public async getUser(args: { userId: string }): Promise<User> {
    const { userId } = args;

    return new Promise(async (resolve, reject) => {
      try {
        const result = await axios({
          method: 'get',
          url: `${this.server}/api/v2.1/user-common-info/${userId}`,
          headers: this.headers(),
        });

        const parsed = UserSchema.safeParse(result.data);

        if (parsed.success) {
          resolve(parsed.data);
        } else {
          reject(parsed.error);
        }
      } catch (e) {
        reject(e);
      }
    });
  }
}
