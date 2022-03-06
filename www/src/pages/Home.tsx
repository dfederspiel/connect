import { gql, useQuery } from '@apollo/client';
import { Typography } from '@material-ui/core';
import Affirmations from '../components/Affirmations/Affirmations';
import { Article } from '../generated/graphql';

const HomePage = () => {
  const { data } = useQuery<{ article: Article[] }>(gql`
    query {
      article {
        id
        title
        body
        user {
          id
          email
        }
      }
    }
  `);

  return (
    <>
      <Typography variant={'h2'}>Home</Typography>
      <Affirmations />
      {data &&
        data.article.map((a) => (
          <div key={`article_${a.id}`}>
            <h2>
              {a.title} by {a.user?.email}
            </h2>
            <p>{a.body}</p>
          </div>
        ))}
    </>
  );
};

export default HomePage;
