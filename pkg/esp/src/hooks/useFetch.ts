interface ICommonRequestParams {
  path: string;
  cache?: RequestCache;
  credentials?: RequestCredentials;
  redirect?: RequestRedirect;
}

interface IGetRequestParams extends ICommonRequestParams {
  type: "get";
}

interface IPostRequestParams<Body extends {} = {}> extends ICommonRequestParams {
  type: "post";
  body: Body;
}

type TRequestParams<Body extends {} = {}> = IGetRequestParams | IPostRequestParams<Body>;

export const useFetch = () => {
  let isLoading = false;

  const request = <Resp extends {} = {}, Body extends {} = {}>(params: TRequestParams<Body>): Promise<Resp> => {
    isLoading = true;
    return new Promise<Resp>((resolve, reject) => {
      fetch(`${process.env.SERVER_URL || location.origin}/api${params.path.startsWith("/") ? params.path : `/${params.path}`}`, {
        ...params,
        body: "body" in params ? JSON.stringify(params.body) : undefined,
        method: params.type,
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(async (res) => {
          const json = await res.json();
          isLoading = false;
          resolve(json as unknown as Resp);
        })
        .catch((err) => {
          isLoading = false;
          reject(err);
        });
    });
  };

  return {
    isLoading,
    request,
  };
};
