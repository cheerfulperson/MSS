import { RenderResult, UIComponent } from "../../component";
import "./select.scss";

interface ISelectProps {
  className?: string;
  customAttrs?: Record<string, string>;
  initialValue?: string;
  label?: string;
  options?: Record<string, string>;
  onChange?: (e: InputEvent) => void;
}

export class Select extends UIComponent {
  private props: ISelectProps;

  public id: string = 'select';

  constructor(props?: ISelectProps) {
    super();
    this.props = props || {};
  }

  public render<T extends HTMLElement = HTMLDivElement>(): RenderResult<T> {
    const { className, customAttrs, initialValue, label, onChange } = this.props;
    const node = (document.getElementById(this.id) as HTMLTemplateElement).content.cloneNode(true) as HTMLElement;
    const element = node.querySelector<T>(".Select");
    const select = element.querySelector<HTMLSelectElement>("select");
    const labelEl = element.querySelector(".Select__label");
    const errors = element.querySelector(".Select__errors");

    Object.entries(customAttrs).forEach(([attr, value]) => {
      select.setAttribute(attr, value);
    });

    const showError = (err: string) => {
      errors.textContent = err;
    };
    const clearError = () => {
      errors.textContent = "";
    };

    return {
      node,
      element,
    };
  }
}
