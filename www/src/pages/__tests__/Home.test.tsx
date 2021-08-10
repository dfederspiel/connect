import { render } from '@testing-library/react';
import Home from '../Home';

describe('the home page', () => {
  it('renders as expected', () => {
    const { asFragment } = render(<Home />);
    expect(asFragment()).toMatchSnapshot();
  });
});
