export interface RenderResult<T extends HTMLElement = HTMLElement> {
  element: T;
}

export abstract class Component<T extends HTMLElement = HTMLElement> {
  public element: T;

  public render(): RenderResult<T> {
    return {
      element: document.body as T,
    };
  }
}
