import { RenderResult, UIComponent } from "../../component";
import "./button.scss";

interface IButtonProps {
  children?: string;
  className?: string;
  onClick?: (e: MouseEvent) => void;
  customAttr?: Record<string, string>;
}

export class Button extends UIComponent {
  private props: IButtonProps;

  public id: string = "button";

  public constructor(props?: IButtonProps) {
    super();
    this.props = props || {};
  }

  public render<T extends HTMLElement = HTMLButtonElement>(): RenderResult<T> {
    const node = (
      document.getElementById(this.id) as HTMLTemplateElement
    ).content.cloneNode(true) as HTMLElement;
    const element = node.querySelector<T>(".Button");
    element.insertAdjacentHTML("afterbegin", this.props.children);
    const customAttrs = this.props.customAttr || {};
    if (this.props.className) {
      element.classList.add(this.props.className);
    }
    if (this.props.onClick) {
      element.addEventListener("click", this.props.onClick);
    }
    Object.entries(customAttrs).forEach(([attr, value]) => {
      element.setAttribute(attr, value);
    });
    return {
      node,
      element,
    };
  }
}
