import { RESTDataSource } from 'apollo-datasource-rest';
import {
  transformNavigation,
  transformArticleItems
} from '../transforms/transforms';

export default class ZuzaAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.ZUZA_API_ENDPOINT;
  }

  async getTopHat() {
    try {
      const results = await this.get('/assets/AR_TopHat/navigationlinksbyuiid');
      return results[0].navigationItems;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async getNavigation(siteAlias) {
    try {
      const results = await this.get(
        `/assets/ar_NeckTie_${siteAlias}/quicklinksbyuiidmultitry`
      );
      return transformNavigation(results);
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async getFooter({ alias, location, portalid, websiteid }) {
    try {
      const results = await this.get(
        `/assets/AR_Maven_Footer_${alias}/quicklinksbyuiidmultitry?location=${location}&portalid=${portalid}&websiteid=${websiteid}`
      );
      return transformNavigation(results);
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async getStaticContent(id) {
    try {
      const results = await this.get(`/staticcontents/${id}`);
      return results.detail;
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  async getArticles(
    { alias, location, portalid, websiteid },
    { count, start, end }
  ) {
    try {
      const results = await this.get(
        `/assets/AR_${alias}/itemsbyuiidmultitrymultitiers?location=${location}&portalid=${portalid}&websiteid=${websiteid}&itemsCount=${count}&start=${start}&end=${end}`
      );
      return transformArticleItems(results.items);
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async getWeather(location) {
    try {
      const results = await this.get(`/weather?id=${location}`);
      const json = JSON.parse(results);
      return json;
    } catch (err) {
      console.error(err);
      return err;
    }
  }
}
