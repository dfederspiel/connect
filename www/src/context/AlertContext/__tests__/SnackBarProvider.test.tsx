import { renderHook, act } from '@testing-library/react-hooks';
import { SnackBarProvider, useSnacks } from '../SnackBarProvider';

describe('the toast provider', () => {
  const wrapper = ({ children }: any) => <SnackBarProvider>{children}</SnackBarProvider>;
  it('exists', () => {
    const { result } = renderHook(() => useSnacks(), { wrapper });
    act(() => {
      result.current.updateMessage('test');
    });
    expect(result.current.message).toEqual('test');
    expect(result).toMatchSnapshot();
  });
});
