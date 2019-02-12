"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_datasource_rest_1 = require("apollo-datasource-rest");
const transforms_1 = require("../transforms/transforms");
class TheStarApi extends apollo_datasource_rest_1.RESTDataSource {
    constructor() {
        super();
        this.baseURL = process.env.THESTAR_API_ENDPOINT;
    }
    willSendRequest(request) {
        request.headers.set('x-api-key', process.env.THESTAR_API_KEY);
    }
    async getPublication(userId) {
        try {
            const result = await this.get('/subscriptions/packages/publications?uuid=' + userId);
            return transforms_1.transformPublication(result);
        }
        catch (err) {
            console.error(err);
            return [];
        }
    }
}
exports.default = TheStarApi;
//# sourceMappingURL=TheStarApi.js.map