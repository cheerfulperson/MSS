import { RenderResult, UIComponent } from "../../component";
import "./input.scss";

interface IInputProps {
  className?: string;
  customAttrs?: Record<string, string>;
  initialValue?: string;
  label?: string;
  onChange?: (e: InputEvent) => void;
}

interface InputResult {
  input: HTMLInputElement;
  showError: (err: string) => void;
  clearError: () => void;
}

export class Input extends UIComponent {
  private props: IInputProps;

  public id: string = "input";

  constructor(props?: IInputProps) {
    super();
    this.props = props || {};
  }

  public render<T extends HTMLElement = HTMLDivElement>(): RenderResult<T> & InputResult {
    const { className, customAttrs, initialValue, label, onChange } = this.props;
    const node = (document.getElementById(this.id) as HTMLTemplateElement).content.cloneNode(true) as HTMLElement;
    const element = node.querySelector<T>(".Input");
    const input = element.querySelector<HTMLInputElement>("input");
    const labelEl = element.querySelector(".Input__label");
    const errors = element.querySelector(".Input__errors");

    if (label) {
      labelEl.textContent = label;
    }
    input.value = initialValue || "";
    if (className) {
      input.classList.add(className);
    }
    if (onChange) {
      input.addEventListener("change", onChange);
    }
    Object.entries(customAttrs).forEach(([attr, value]) => {
      input.setAttribute(attr, value);
    });

    const showError = (err: string) => {
      errors.textContent = err;
    };
    const clearError = () => {
      errors.textContent = "";
    };

    return {
      clearError,
      element,
      input,
      node,
      showError,
    };
  }
}
