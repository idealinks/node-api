import 'dotenv/config';
import { ApolloServer, gql } from 'apollo-server';
import { MemcachedCache } from 'apollo-server-cache-memcached';
import ZuzaAPI from './data-sources/ZuzaApi';
import TheStarApi from './data-sources/TheStarApi';
import logger from './logger';

const memeCache = new MemcachedCache([process.env.GRAPHQL_MEMCACHED_ENDPOINT]);

process
  .on('unhandledRejection', (reason, p) => {
    logger.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    logger.error(err.message);
    process.exit(1);
  });

// The GraphQL schema
const typeDefs = gql`
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

const server = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: true,
  cacheControl: true,
  formatError: error => {
    logger.error(error, 'Error apollo-server');
    return error;
  },
  dataSources: () => {
    return {
      zuzaAPI: new ZuzaAPI(),
      theStarApi: new TheStarApi()
    };
  },
  persistedQueries: {
    cache: memeCache
  }
});

server.listen().then(({ url }) => {
  logger.info(`🚀 Server ready at ${url}`);

  logger.info(`GRAPHQL_MEMCACHED_ENDPOINT       ${process.env.GRAPHQL_MEMCACHED_ENDPOINT}` );
  logger.info(`ZUZA_API_ENDPOINT                ${process.env.ZUZA_API_ENDPOINT}` );
  logger.info(`MEDIA_ZUZA_DOMAIN                ${process.env.MEDIA_ZUZA_DOMAIN}` );
  logger.info(`DYNAMIC_MEDIA_DOMAIN             ${process.env.DYNAMIC_MEDIA_DOMAIN}` );
  logger.info(`THESTAR_API_ENDPOINT             ${process.env.THESTAR_API_ENDPOINT}` );

});
