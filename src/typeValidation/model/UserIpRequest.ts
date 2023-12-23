import { ParsedQs } from "qs";

export class GetUserIpRequest {
      private readonly _userIp: string;

      constructor(userIp: string) {
            this._userIp = userIp;
      }

      get userIp(): string {
            return this._userIp;
      }
}

export function toDtoUserIp(query: ParsedQs): GetUserIpRequest {
      const userIp = query.userIp as string;
      return new GetUserIpRequest(userIp);
}
