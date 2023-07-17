import { waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import { SnackBarProvider, SnackBarProviderProps, useSnacks } from '../SnackBarProvider';

describe('the toast provider', () => {
  const wrapper = ({ children }: SnackBarProviderProps) => (
    <SnackBarProvider timeout={100}>{children}</SnackBarProvider>
  );
  it('exists', async () => {
    const { result } = renderHook(() => useSnacks(), { wrapper });
    act(() => {
      result.current.updateMessage('test');
    });
    expect(result.current.message).toEqual('test');
    expect(result).toMatchSnapshot();
    await waitFor(() => {
      expect(result.current.open).toBeFalsy();
    });
  });
});
