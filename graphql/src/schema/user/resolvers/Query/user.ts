import type { QueryResolvers } from './../../../types.generated';
export const user: NonNullable<QueryResolvers['user']> = async (
  _parent,
  _arg,
  { dataSources, user },
) => {
  /* Implement Query.user resolver logic here */
  return dataSources.userApi.getById(user.id.toString());
};
