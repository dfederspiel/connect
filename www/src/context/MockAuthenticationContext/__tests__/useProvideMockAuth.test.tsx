import { renderHook } from '@testing-library/react-hooks';
import { useProvideMockAuth } from '../useProvideMockAuth';
import { MockAuthProvider } from '../MockAuthProvider';
import { act } from 'react-dom/test-utils';

describe('the mocked provider hook', () => {
  const wrapper = ({ children }: { children: JSX.Element }) => (
    <MockAuthProvider user="Joe Black">{children}</MockAuthProvider>
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
      result.current.login();
    });
  });

  it('does not set the policy if not provided', () => {
    const { result } = renderHook(() => useProvideMockAuth('test'), {
      wrapper,
    });
    expect(result.current.user).toBeDefined();
    act(() => {
      result.current.login();
    });
  });

  it('can fetch a test token', async () => {
    const { result } = renderHook(() => useProvideMockAuth('test'), {
      wrapper,
    });
    expect(result.current.token).toBeDefined();
    expect(await result.current.token(false)).toEqual('123');
  });

  it('can sign in', async () => {
    const { result } = renderHook(() => useProvideMockAuth('test'), {
      wrapper,
    });
    expect(result.current.login).toBeDefined();
  });

  it('can sign out', () => {
    const { result } = renderHook(() => useProvideMockAuth('test'), {
      wrapper,
    });
    expect(result.current.logout).toBeDefined();
  });
});
