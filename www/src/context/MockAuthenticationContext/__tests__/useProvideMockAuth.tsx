import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useProvideMockAuth } from '../useProvideMockAuth';
import { MockAuthProvider } from '../MockAuthProvider';
import { act } from 'react-dom/test-utils';
import { PublicClientApplication } from '@azure/msal-browser';

describe('the mocked provider hook', () => {
  const wrapper = ({ children }: any) => (
    <MockAuthProvider user="Joe Black">
      <>{children}</>
    </MockAuthProvider>
  );

  beforeEach(() => {
    sessionStorage.clear();
  });

  it('can manually set a user', () => {
    const { result } = renderHook(() => useProvideMockAuth('test'), {
      wrapper,
    });
    expect(result.current.user).toBeDefined();
    expect(result.current.user).toEqual('test');
  });

  it('tracks a policy id when signing in', () => {
    const spy = jest
      .spyOn(PublicClientApplication.prototype, 'logoutRedirect')
      .mockImplementation(() => Promise.resolve());
    const { result } = renderHook(() => useProvideMockAuth('test'), {
      wrapper,
    });
    expect(result.current.user).toEqual('test');
    act(() => {
      result.current.signin();
    });
  });

  it('does not set the policy if not provided', () => {
    const { result } = renderHook(() => useProvideMockAuth('test'), {
      wrapper,
    });
    expect(result.current.user).toBeDefined();
    act(() => {
      result.current.signin();
    });
  });

  it('can fetch a test token', async () => {
    const { result } = renderHook(() => useProvideMockAuth('test'), {
      wrapper,
    });
    expect(result.current.token).toBeDefined();
    expect(await result.current.token()).toEqual('123');
  });

  it('can sign in', async () => {
    const { result } = renderHook(() => useProvideMockAuth('test'), {
      wrapper,
    });
    expect(result.current.signin).toBeDefined();
    expect(await result.current.signin()).toBeUndefined();
  });

  it('can sign out', () => {
    const { result } = renderHook(() => useProvideMockAuth('test'), {
      wrapper,
    });
    expect(result.current.signout).toBeDefined();
    expect(result.current.signout()).toBeUndefined();
  });
});
