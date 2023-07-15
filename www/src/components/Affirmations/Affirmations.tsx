import { gql, useMutation, useQuery } from '@apollo/client';
import { User } from '@prisma/client';
import { GetUsersDocument, SendAffirmationDocument } from '../../gql/graphql';

// export const GET_USERS = gql`
//   {
//     users {
//       id
//       email
//     }
//   }
// `;

// export const SEND_AFFIRMATION = gql`
//   mutation sendAffirmation($userId: ID!) {
//     sendAffirmation(userId: $userId) {
//       from
//       to
//     }
//   }
// `;

const Affirmations = () => {
  const { loading, error, data } = useQuery(GetUsersDocument);
  const [sendAffirmation] = useMutation(SendAffirmationDocument);

  return (
    (loading && <div>Loading...</div>) ||
    (error && <div>Error! {error.message}</div>) ||
    (data?.users && (
      <div className="users-list">
        {data.users.map(
          (user) =>
            user && (
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
                <span>{user.id}</span>
              </div>
            ),
        )}
      </div>
    )) || <>Unplanned Code Path</>
  );
};

export default Affirmations;
