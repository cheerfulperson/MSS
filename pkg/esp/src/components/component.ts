export interface RenderResult<T extends HTMLElement = HTMLElement> {
  node: Node;
  element: T;
}

export abstract class Component {
  public init(): void {}
}

export abstract class UIComponent {
  public id: string;

  public render<T extends HTMLElement = HTMLElement>(): RenderResult<T> {
    return {
      node: document,
      element: document.body as T,
    };
  }
}
