import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { User } from '@prisma/client';
import { render, cleanup, act, fireEvent } from '@testing-library/react';
import Affirmations, { GET_USERS, SEND_AFFIRMATION } from '../Affirmations';

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

const affirmationMock = {
  request: {
    query: SEND_AFFIRMATION,
    variables: {
      userId: 1,
    },
  },
  result: {
    data: {},
  },
} as MockedResponse;

afterEach(cleanup);

describe('the affirmations component', () => {
  const wrapper = ({ children }: any) => (
    <MockedProvider mocks={[defaultMock, affirmationMock]}>{children}</MockedProvider>
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

  describe('and when the button is clicked', () => {
    it('it triggers a send affirmation call', async () => {
      const { findByRole } = render(<Affirmations />, { wrapper });
      const affirmButton = await findByRole('button');
      act(() => {
        fireEvent.click(affirmButton);
      });
    });
  });

  it('displays an error when the query fails', async () => {
    defaultMock = {
      request: {
        query: GET_USERS,
      },
      error: new Error('An error occurred'),
    };

    const wrapper = ({ children }: any) => (
      <MockedProvider mocks={[defaultMock, affirmationMock]}>{children}</MockedProvider>
    );
    const { findByText } = render(<Affirmations />, { wrapper });
    await findByText(`Error! An error occurred`);
  });
});
