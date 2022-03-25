import { Article, PrismaClient } from '@prisma/client';
import { DataSource } from 'apollo-datasource';
import { ArticleInputArgs } from '../generated/graphql';

export default class ArticlesDataSource extends DataSource {
  client: PrismaClient;

  constructor(context: PrismaClient) {
    super();
    this.client = context;
  }

  get(id?: number[]): Promise<Article[]> {
    if (!id) return this.client.article.findMany();
    return this.client.article.findMany({
      where: {
        id: {
          in: id,
        },
      },
    });
  }

  post(article: ArticleInputArgs): Promise<Article> {
    return this.client.article.create({
      data: {
        title: article.title,
        body: article.body,
        userId: article.userId,
      },
    });
  }
}
