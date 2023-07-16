import { useMutation, useQuery } from '@apollo/client';
import { GetUsersDocument, SendAffirmationDocument } from '../../gql/graphql';

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
