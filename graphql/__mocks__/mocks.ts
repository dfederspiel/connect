import { User } from '@prisma/client';
import { IMocks, MockList } from '@graphql-tools/mock';
import { faker } from '@faker-js/faker';
export interface IConnectMocks extends IMocks {
  User(): User;
}

export const DataMocks = {
  Int: () => faker.datatype.number(100),
  Float: () => faker.datatype.float(10),
  String: () => faker.random.words(5),
  User: () => ({
    id: faker.datatype.number(100),
    domain: faker.internet.domainName(),
    email: faker.internet.email(),
    skills: () => new MockList([0, 12]),
  }),
  Query: () => ({
    users: () => new MockList([0, 12]),
  }),
} as IConnectMocks;
