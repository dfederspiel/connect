import { IResolvers } from '@graphql-tools/utils';
import { Article } from '@prisma/client';
import { gql } from 'apollo-server-express';

export const ArticlesTypeDefs = gql`
  type Article {
    id: ID!
    title: String
    user: User
  }

  extend type Query {
    article(id: Int): Article
    articles: [Article]
  }
`;

interface IArticlesResolversQuery {
  article(parent: any, args: any, context: any, other: any): Promise<Article | null>;
  articles(parent: any, args: any, context: any, other: any): Promise<Article[]>;
}
interface IArticlesResolvers extends IResolvers {
  Query: IArticlesResolversQuery;
}

export default class ArticlesResolvers {
  resolvers: IArticlesResolvers;

  constructor() {
    this.resolvers = this.initializeResolvers();
  }

  private initializeResolvers = (): IArticlesResolvers => {
    return {
      Query: {
        article: (_: any, args: any, context: any, __: any) => {
          console.log(process.env.NODE_ENV);
          console.log(`get user by id ${args.id}`);
        },
        articles: (_: any, _args: any, context: any, __: any) => {
          console.log(`get all users`);
        },
      } as IArticlesResolversQuery,
    };
  };
}
