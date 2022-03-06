import { IResolvers } from '@graphql-tools/utils';
import { Article, User } from '@prisma/client';
import { gql } from 'apollo-server-express';
import ArticlesDataSource from '../datasources/ArticlesDataSource';

export const ArticlesTypeDefs = gql`
  input ArticleInputArgs {
    title: String!
    body: String!
    userId: Int!
  }

  type Article {
    id: ID
    body: String
    title: String
    user: User
  }

  extend type Query {
    article(id: [Int]): [Article]
    articles: [Article]
  }

  extend type Mutation {
    article(article: ArticleInputArgs!): Article
  }
`;

interface ArticlesContext {
  user: User;
  dataSources: { articles: ArticlesDataSource };
}

interface IArticlesResolversQuery {
  article(
    parent: void,
    args: { id?: number[] },
    context: ArticlesContext,
  ): Promise<Article[]>;
  articles(): Promise<Article[]>;
}

interface IArticlesResolversMutation {
  article(
    parent: void,
    args: { article: { title: string; body: string; userId: number } },
    context: ArticlesContext,
  );
}

interface IArticlesResolvers extends IResolvers {
  Query: IArticlesResolversQuery;
  Mutation: IArticlesResolversMutation;
}

export default class ArticlesResolvers {
  resolvers: IArticlesResolvers;

  constructor() {
    this.resolvers = this.initializeResolvers();
  }

  private initializeResolvers = (): IArticlesResolvers => {
    return {
      Query: {
        article: (_, args, context) => {
          console.log(process.env.NODE_ENV);
          return context.dataSources.articles.get(args.id);
        },
        articles: () => {
          console.log(`get all users`);
        },
      } as IArticlesResolversQuery,
      Mutation: {
        article: (_, args, context) => {
          return context.dataSources.articles.post(args.article);
        },
      },
    };
  };
}
