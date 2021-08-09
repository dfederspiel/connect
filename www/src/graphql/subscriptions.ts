import { gql } from '@apollo/client';

export const AFFIRMATION_GIVEN_SUBSCRIPTION = gql`
  subscription {
    affirmationGiven {
      from
      to
    }
  }
`;
