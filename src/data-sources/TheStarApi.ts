import { RESTDataSource } from 'apollo-datasource-rest';
import { transformPublication } from '../transforms/transforms';

export default class TheStarApi extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.THESTAR_API_ENDPOINT;
  }

  willSendRequest(request) {
    request.headers.set('x-api-key', process.env.THESTAR_API_KEY);
  }

  async getPublication(userId) {
    try {
      const result = await this.get(
        '/subscriptions/packages/publications?uuid=' + userId
      );
      return transformPublication(result);
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}
