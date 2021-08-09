import { render } from '@testing-library/react';
import React from 'react';
import { AuthProvider } from '../AuthProvider';

describe('the auth provider', () => {
  it('exists', () => {
    const { asFragment } = render(<AuthProvider></AuthProvider>);
    expect(asFragment()).toMatchSnapshot();
  });
});
