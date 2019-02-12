"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_datasource_rest_1 = require("apollo-datasource-rest");
const transforms_1 = require("../transforms/transforms");
class ZuzaAPI extends apollo_datasource_rest_1.RESTDataSource {
    constructor() {
        super();
        this.baseURL = process.env.ZUZA_API_ENDPOINT;
    }
    async getTopHat() {
        try {
            const results = await this.get('/assets/AR_TopHat/navigationlinksbyuiid');
            return results[0].navigationItems;
        }
        catch (err) {
            console.error(err);
            return [];
        }
    }
    async getNavigation(siteAlias) {
        try {
            const results = await this.get(`/assets/ar_NeckTie_${siteAlias}/quicklinksbyuiidmultitry`);
            return transforms_1.transformNavigation(results);
        }
        catch (err) {
            console.error(err);
            return [];
        }
    }
    async getFooter({ alias, location, portalid, websiteid }) {
        try {
            const results = await this.get(`/assets/AR_Maven_Footer_${alias}/quicklinksbyuiidmultitry?location=${location}&portalid=${portalid}&websiteid=${websiteid}`);
            return transforms_1.transformNavigation(results);
        }
        catch (err) {
            console.error(err);
            return [];
        }
    }
    async getStaticContent(id) {
        try {
            const results = await this.get(`/staticcontents/${id}`);
            return results.detail;
        }
        catch (err) {
            console.error(err);
            return err;
        }
    }
    async getArticles({ alias, location, portalid, websiteid }, { count, start, end }) {
        try {
            const results = await this.get(`/assets/AR_${alias}/itemsbyuiidmultitrymultitiers?location=${location}&portalid=${portalid}&websiteid=${websiteid}&itemsCount=${count}&start=${start}&end=${end}`);
            return transforms_1.transformArticleItems(results.items);
        }
        catch (err) {
            console.error(err);
            return [];
        }
    }
    async getWeather(location) {
        try {
            const results = await this.get(`/weather?id=${location}`);
            const json = JSON.parse(results);
            return json;
        }
        catch (err) {
            console.error(err);
            return err;
        }
    }
}
exports.default = ZuzaAPI;
//# sourceMappingURL=ZuzaApi.js.map