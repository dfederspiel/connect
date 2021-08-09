import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useProvideMockAuth } from '../useProvideMockAuth';
import { MockAuthProvider } from '../MockAuthProvider';
import { act } from 'react-dom/test-utils';

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
    const { result } = renderHook(() => useProvideMockAuth('test'), {
      wrapper,
    });
    expect(result.current.user).toEqual('test');
    act(() => {
      result.current.signin('my policy');
    });
    expect(sessionStorage.getItem('currentPolicy')).toEqual('my policy');
  });

  it('does not set the policy if not provided', () => {
    const { result } = renderHook(() => useProvideMockAuth('test'), {
      wrapper,
    });
    expect(result.current.user).toBeDefined();
    act(() => {
      result.current.signin(undefined);
    });
    expect(sessionStorage.getItem('currentPolicy')).toBeNull();
  });

  it('can fetch a test token', async () => {
    const { result } = renderHook(() => useProvideMockAuth('test'), {
      wrapper,
    });
    expect(result.current.token).toBeDefined();
    expect(await result.current.token()).toEqual('123');
  });

  it('can signin', async () => {
    const { result } = renderHook(() => useProvideMockAuth('test'), {
      wrapper,
    });
    expect(result.current.signin).toBeDefined();
    expect(await result.current.signin(undefined)).toBeUndefined();
  });

  it('can signout', () => {
    const { result } = renderHook(() => useProvideMockAuth('test'), {
      wrapper,
    });
    expect(result.current.signout).toBeDefined();
    expect(result.current.signout()).toBeUndefined();
  });
});
