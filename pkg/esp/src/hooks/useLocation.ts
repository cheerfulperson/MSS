interface IUseLocationResult<T extends {}> {
  pathname: string;
  queryParams: T;
  registerNewListener(cb: IEventCallback<T>): void;
  goTo<TState extends {}>(data: TGoTo<T>, state?: TState): void;
}

interface ICbParams<T extends {}> {
  pathname: string;
  queryParams: T;
}

type TGoTo<T extends {}> = string | { pathname: string; query: T };
type IEventCallback<T extends {}> = (data: ICbParams<T>) => void;

const parseSearchString = <T extends {}>(query: string): T => {
  const queryParams = decodeURI(query.substring(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"');
  if (!queryParams) return {} as T;
  return JSON.parse('{"' + queryParams + '"}') as T;
};

export const useLocation = <T extends {}>(): IUseLocationResult<T> => {
  let objListener: IEventCallback<T> = (): void => {};
  const goTo = <TState extends {}>(params: TGoTo<T>, state?: TState) => {
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

    history.pushState(state || {}, url.href);
  };

  const locationObj = {
    _href: location.href,
    set href(value: string) {
      this._href = value;
      this.pathname = location.pathname;
      this.queryParams = parseSearchString<T>(location.search);
      objListener({ pathname: location.pathname, queryParams: parseSearchString<T>(location.search) });
    },
    get href() {
      return this._href;
    },
    pathname: location.pathname,
    queryParams: parseSearchString<T>(location.search),
    registerNewListener(cb: IEventCallback<T>) {
      objListener = cb;
    },
    goTo,
  };

  const observer = new MutationObserver((mutations) => {
    if (locationObj.href != document.location.href) {
      locationObj.href = document.location.href;
    }
  });

  observer.observe(document, {
    childList: true,
    subtree: true,
  });

  return locationObj;
};
