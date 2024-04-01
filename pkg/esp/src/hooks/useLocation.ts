interface IUseLocationResult {
  pathname: string;
  queryParams: Record<string, string>;
  registerNewListener(cb: IEventCallback): void;
  goTo<TState extends {}>(data: TGoTo, state?: TState): void;
}

interface ICbParams {
  pathname: string;
  queryParams: Record<string, string>;
}

type TGoTo = string | { pathname: string; query: Record<string, string> };
type IEventCallback = (data: ICbParams) => void;

const parseSearchString = <T extends {}>(query: string): T => {
  const queryParams = decodeURI(query.substring(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"');
  if (!queryParams) return {} as T;
  return JSON.parse('{"' + queryParams + '"}') as T;
};

export const useLocation = (() => {
  let objListener: IEventCallback = (): void => {};

  const locationObj = {
    _href: location.href,
    set href(value: string) {
      this._href = value;
      this.pathname = location.pathname;
      this.queryParams = parseSearchString<Record<string, string>>(location.search);
      objListener({
        pathname: location.pathname,
        queryParams: parseSearchString<Record<string, string>>(location.search),
      });
    },
    get href() {
      return this._href;
    },
    pathname: location.pathname,
    queryParams: parseSearchString<Record<string, string>>(location.search),
    registerNewListener(cb: IEventCallback) {
      objListener = cb;
    },
  };

  return (): IUseLocationResult => {
    return {
      ...locationObj,
      goTo: <TState extends {}>(params: TGoTo, state?: TState) => {
        let url = new URL(location.href);
        if (typeof params === "string") {
          url = new URL(params, location.href);
        } else {
          const queryParams = Object.entries(params.query).reduce<string>((prev, [key, value], i) => {
            if (!value || !key) return prev;
            return `${prev}${i === 0 ? "" : ","}${key}=${value}`;
          }, "");
          url = new URL(`${params.pathname}?${queryParams}`, location.href);
        }

        // TODO history.pushState(state || {}, "page", url.href);
        // locationObj.href = url.href;
        // temp fix router

        location.replace(url.href);
      },
    };
  };
})();
