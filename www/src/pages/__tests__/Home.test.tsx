import { render } from '@testing-library/react';
import Home from '../Home';

const mockQueryResult = { loading: false, data: { users: [] }, error: null };
const mockMutationResult = [jest.fn(), { loading: false, data: [], error: null }];
jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useQuery: () => mockQueryResult,
  useMutation: () => mockMutationResult,
}));

describe('the home page', () => {
  it('renders as expected', () => {
    const { asFragment } = render(<Home />);
    expect(asFragment()).toMatchSnapshot();
  });
});
