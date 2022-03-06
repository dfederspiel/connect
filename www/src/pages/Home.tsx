import { gql, useQuery } from '@apollo/client';
import { Typography } from '@material-ui/core';
import { useEffect } from 'react';
import Affirmations from '../components/Affirmations/Affirmations';

const HomePage = () => {
  const { data, loading, error } = useQuery(gql`
    query {
      article {
        id
        title
        user {
          id
          email
        }
      }
    }
  `);

  useEffect(() => {
    data && console.log('DATA!!!', data);
  }, [data]);

  return (
    <>
      <Typography variant={'h2'}>Home</Typography>
      <Affirmations />
      {data && data.article.map((a) => <div key={`article_${a.id}`}>{a.title}</div>)}
    </>
  );
};

export default HomePage;
