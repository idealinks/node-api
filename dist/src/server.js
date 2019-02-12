"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const apollo_server_1 = require("apollo-server");
const apollo_server_cache_memcached_1 = require("apollo-server-cache-memcached");
const ZuzaApi_1 = __importDefault(require("./data-sources/ZuzaApi"));
const TheStarApi_1 = __importDefault(require("./data-sources/TheStarApi"));
const logger_1 = __importDefault(require("./logger"));
logger_1.default.info(`Trying to initialize Memcached on ${process.env.GRAPHQL_MEMCACHED_ENDPOINT}`);
const memeCache = new apollo_server_cache_memcached_1.MemcachedCache([process.env.GRAPHQL_MEMCACHED_ENDPOINT]);
logger_1.default.info(`Memcached initialized successfully on ${process.env.GRAPHQL_MEMCACHED_ENDPOINT}`);
process
    .on('unhandledRejection', (reason, p) => {
    logger_1.default.error(reason, 'Unhandled Rejection at Promise', p);
})
    .on('uncaughtException', err => {
    logger_1.default.error(err.message);
    process.exit(1);
});
// The GraphQL schema
const typeDefs = apollo_server_1.gql `
  type Query {
    tophat: [TopHatItem]
    navigation(siteAlias: String!): [PrimaryNavItem]
    footer(options: SiteOptions!): [PrimaryNavItem]
    static(id: String!): StaticContent
    articles(options: SiteOptions!, pagination: PaginationOptions!): [Article]
    weather(location: String!): WeatherInfo
    publication(userId: String): Publication
  }

  type TopHatItem {
    label: String
    navigationUrl: String
    enabled: Boolean
  }

  type WeatherInfo {
    obs: WeatherNow
  }

  type WeatherNow {
    temperature: String
    icon_ltr: String
    date: String
  }

  type PrimaryNavItem {
    label: String
    children: [SecondaryNavItem]
  }

  type SecondaryNavItem {
    label: String
    navigationUrl: String
    enabled: Boolean
    openNewWindow: Boolean
    noFollow: Boolean
  }

  type StaticContent {
    id: String
    title: String
    body: String
  }

  type Article {
    assetId: String
    title: String
    description: String
    imageAlt: String
    category: String
    displayPublishDate: String
    navigationUrl: String
    openNewWindow: Boolean
    thumbnails: ImagesBySize
  }

  type ImagesBySize {
    small: String
    large: String
  }

  type Publication {
    property: String
    publication: String
    tag: String
    isPilotZone: Boolean
  }

  input SiteOptions {
    alias: String!
    location: String!
    portalid: String!
    websiteid: String!
  }

  input PaginationOptions {
    count: Int!
    start: Int!
    end: Int!
  }
`;
// A map of functions which return data for the schema.
const resolvers = {
    Query: {
        tophat: async (parent, args, { dataSources }) => {
            return dataSources.zuzaAPI.getTopHat();
        },
        navigation: async (parent, { siteAlias }, { dataSources }) => {
            return dataSources.zuzaAPI.getNavigation(siteAlias);
        },
        footer: async (parent, { options }, { dataSources }) => {
            return dataSources.zuzaAPI.getFooter(options);
        },
        static: async (parent, { id }, { dataSources }) => {
            return dataSources.zuzaAPI.getStaticContent(id);
        },
        articles: async (parent, { options, pagination }, { dataSources }) => {
            return dataSources.zuzaAPI.getArticles(options, pagination);
        },
        weather: async (parent, { location }, { dataSources }) => {
            return dataSources.zuzaAPI.getWeather(location);
        },
        publication: async (parent, { userId }, { dataSources }) => {
            return dataSources.theStarApi.getPublication(userId);
        }
    }
};
const server = new apollo_server_1.ApolloServer({
    typeDefs,
    resolvers,
    tracing: true,
    cacheControl: true,
    formatError: error => {
        logger_1.default.error(error, 'Error apollo-server');
        return error;
    },
    dataSources: () => {
        return {
            zuzaAPI: new ZuzaApi_1.default(),
            theStarApi: new TheStarApi_1.default()
        };
    },
    persistedQueries: {
        cache: memeCache
    }
});
server.listen().then(({ url }) => {
    logger_1.default.info(`🚀 Server ready at ${url}`);
    logger_1.default.info(process.env.GRAPHQL_MEMCACHED_ENDPOINT);
    logger_1.default.info(process.env.ZUZA_API_ENDPOINT);
    logger_1.default.info(process.env.MEDIA_ZUZA_DOMAIN);
    logger_1.default.info(process.env.DYNAMIC_MEDIA_DOMAIN);
    logger_1.default.info(process.env.THESTAR_API_ENDPOINT);
});
//# sourceMappingURL=server.js.map