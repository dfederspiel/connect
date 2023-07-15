import { gql, useMutation, useQuery } from '@apollo/client';
import { User } from '@prisma/client';

export const GET_USERS = gql`
  {
    users {
      id
      email
    }
  }
`;

export const SEND_AFFIRMATION = gql`
  mutation sendAffirmation($userId: ID!) {
    sendAffirmation(userId: $userId) {
      from
      to
    }
  }
`;

const Affirmations = () => {
  const { loading, error, data } = useQuery(GET_USERS);
  const [sendAffirmation] = useMutation(SEND_AFFIRMATION);

  return (
    (loading && <div>Loading...</div>) ||
    (error && <div>Error! {error.message}</div>) ||
    (data &&
      data.users.map((user: User) => {
        return (
          <div data-testid="user" key={user.id}>
            <button
              type="button"
              onClick={() => {
                sendAffirmation({
                  variables: {
                    userId: user.id,
                  },
                });
              }}
            >
              Send
            </button>
            <button
              type="button"
              onClick={() => {
                sendAffirmation({
                  variables: {
                    userId: '1',
                  },
                });
              }}
            >
              Send
            </button>
            <span>{user.id}</span>
          </div>
        );
      }))
  );
};

export default Affirmations;
