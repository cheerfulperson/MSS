import { getNode } from "../../../utils";
import { RenderResult, Component } from "../../../types";
import ButtonHTML from "./button.html";
import "./button.scss";

interface IButtonProps {
  children?: string;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (e: MouseEvent) => void;
  customAttr?: Record<string, string>;
}

export class Button<T extends HTMLElement = HTMLButtonElement> extends Component {
  private props: IButtonProps;
  public element: T = getNode<T>(ButtonHTML);
  public constructor(props?: IButtonProps) {
    super();
    this.props = props || {};
  }

  public render(): RenderResult<T> {
    const element = this.element;
    element.insertAdjacentHTML("afterbegin", this.props.children || "");
    const customAttrs = this.props.customAttr || {};
    if (this.props.className) {
      element.classList.add(this.props.className);
    }
    if (this.props.onClick) {
      element.addEventListener("click", this.props.onClick);
    }
    if (this.props.type) {
      element.setAttribute("type", this.props.type);
    }
    Object.entries(customAttrs).forEach(([attr, value]) => {
      element.setAttribute(attr, value);
    });
    return {
      element,
    };
  }
}
