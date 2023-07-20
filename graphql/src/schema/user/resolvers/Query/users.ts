import type { QueryResolvers } from './../../../types.generated';
export const users: NonNullable<QueryResolvers['users']> = async (
  _parent,
  _arg,
  { dataSources },
) => {
  /* Implement Query.users resolver logic here */
  return dataSources.userApi.getAll();
};
