import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { User } from '@prisma/client';
import { render, cleanup } from '@testing-library/react';
import Affirmations, { GET_USERS } from '../Affirmations';

let defaultMock = {
  request: {
    query: GET_USERS,
  },
  result: {
    data: {
      users: [
        {
          id: 1,
          domain: 'domain',
          email: '',
        },
      ] as User[],
    },
  },
} as MockedResponse;

afterEach(cleanup);

describe('the affirmations component', () => {
  const wrapper = ({ children }: any) => (
    <MockedProvider mocks={[defaultMock]}>{children}</MockedProvider>
  );
  it('initializes with a loading state', () => {
    const { asFragment } = render(<Affirmations />, { wrapper });
    expect(asFragment()).toMatchSnapshot();
  });

  it('displays a list of users', async () => {
    const { asFragment, findAllByTestId } = render(<Affirmations />, { wrapper });
    const users = await findAllByTestId('user');
    expect(users.length).toBeGreaterThan(0);
    expect(asFragment()).toMatchSnapshot();
  });

  it('displays an error when the query fails', async () => {
    defaultMock = {
      request: {
        query: GET_USERS,
      },
      error: new Error('An error occurred'),
    };
    const wrapper = ({ children }: any) => (
      <MockedProvider mocks={[defaultMock]}>{children}</MockedProvider>
    );
    const { asFragment, findByText } = render(<Affirmations />, { wrapper });
    await findByText(`Error! An error occurred`);
    expect(asFragment()).toMatchSnapshot();
  });
});
