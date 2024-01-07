import { RenderResult, UIComponent } from "../../component";
import "./toggle.scss";

export class Toggle extends UIComponent {
  public id: string = "toggle";

  public render<T extends HTMLElement = HTMLLabelElement>(): RenderResult<T> {
    const node = (document.getElementById(this.id) as HTMLTemplateElement).content.cloneNode(true) as HTMLElement;

    return {
      node,
      element: node.querySelector(".Toggle"),
    };
  }
}
