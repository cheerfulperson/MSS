import { getNode } from "../../../utils";
import { RenderResult, Component } from "../../../types";

import LoaderHTML from "./loader.html";
import "./loader.scss";

interface IButtonProps {
  size?: number;
  customAttr?: Record<string, string>;
}

export class Loader<T extends HTMLElement = HTMLButtonElement> extends Component {
  private props: IButtonProps;

  public element: T = getNode<T>(LoaderHTML);
  public constructor(props?: IButtonProps) {
    super();
    this.props = props || {};
  }

  public render(): RenderResult<T> {
    const element = this.element;
    const customAttrs = this.props.customAttr || {};
    const size = this.props.size || 12;

    Object.entries(customAttrs).forEach(([attr, value]) => {
      element.setAttribute(attr, value);
    });
    element.style.width = `${size}px`;
    element.style.height = `${size}px`;

    return {
      element,
    };
  }
}
