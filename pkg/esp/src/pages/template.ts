import { Component, PageComponent, RenderResult } from "../types";
import { getNode } from "../utils";

interface IOnTreeRenderProps<T extends HTMLElement = HTMLElement> {
  element: T;
}

interface IOnTreeRenderResult {
  tree: Array<TTreeRenderElement>;
}

interface IPageProps<T extends HTMLElement = HTMLElement> {
  html: string;
  onTreeRender?: TOnTreeRenderFunc<T>;
}

type TOnTreeRenderFunc<T extends HTMLElement = HTMLElement> = (props: IOnTreeRenderProps<T>) => IOnTreeRenderResult;
export type TTreeRenderElement = { selector: string; tree: Component[] } | Component;

export class Page<T extends HTMLElement = HTMLElement> extends PageComponent {
  private elem: T;
  private onTreeRender?: TOnTreeRenderFunc<T>;

  public constructor({ html, onTreeRender }: IPageProps<T>) {
    super();
    this.elem = getNode<T>(html);
    this.onTreeRender = onTreeRender;
  }

  public render<T extends HTMLElement = HTMLFormElement>(): RenderResult<T> {
    if (this.onTreeRender) {
      const renderer = this.onTreeRender({ element: this.elem });

      const elements = renderer.tree.reduce<HTMLElement[]>((elements, el) => {
        if ("render" in el) {
          elements.push(el.render().element);
        }
        return elements;
      }, []);
      this.elem.append(...elements);
      renderer.tree.forEach((el) => {
        if ("selector" in el) {
          const node = this.elem.querySelector(el.selector);
          if (!node) {
            throw new Error(`No element with such selector: ${el.selector}`);
          }
          node.append(...el.tree.map((el) => el.render().element));
        }
      });
    }

    return { element: this.elem as unknown as T };
  }
  public remove(): void {
    this.elem.remove();
  }
}
