import { useMutation, useQuery } from '@apollo/client';
import { GetUsersDocument, SendAffirmationDocument } from '../../gql/graphql';
import { Button, Grid, Skeleton, Typography } from '@mui/material';

const Affirmations = () => {
  const { loading, error, data } = useQuery(GetUsersDocument);
  const [sendAffirmation] = useMutation(SendAffirmationDocument);

  return (
    (loading && <Skeleton variant="rectangular" width={210} height={118} />) ||
    (error && <div>Error! {error.message}</div>) ||
    (data?.users && (
      <div className="users-list">
        {data.users.map(
          (user) =>
            user && (
              <Grid container data-testid="user" key={user.id}>
                <Button
                  variant="contained"
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
                </Button>
                <Typography>{user.email}</Typography>
              </Grid>
            ),
        )}
      </div>
    )) || <>Unplanned Code Path</>
  );
};

export default Affirmations;
