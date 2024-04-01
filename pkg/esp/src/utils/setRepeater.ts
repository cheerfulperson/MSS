export const setRepeater = () => {
  let timer: ReturnType<typeof setInterval>;
  const result = (cb: () => void, params?: { callImmediately?: boolean; time?: number }) => {
    const { callImmediately, time = 5000 } = params || {};
    if (callImmediately) {
      cb();
    }
    clearInterval(timer);
    timer = setInterval(cb, time);
  };
  result.clear = () => clearInterval(timer);
  return result;
};
