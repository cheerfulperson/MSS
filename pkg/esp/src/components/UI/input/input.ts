import { RenderResult, Component } from "../../../types";
import { getNode } from "../../../utils";

import InputHTML from "./input.html";
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

export class Input<T extends HTMLElement = HTMLDivElement> extends Component {
  private props: IInputProps;

  public element: T = getNode<T>(InputHTML);

  constructor(props?: IInputProps) {
    super();
    this.props = props || {};
  }

  public render(): RenderResult<T> & InputResult {
    const { className, customAttrs = {}, initialValue, label, onChange } = this.props;
    const element = this.element;
    const input = element.querySelector<HTMLInputElement>("input")!;
    const labelEl = element.querySelector(".Input__label")!;
    const errors = element.querySelector(".Input__errors")!;

    if (label) {
      labelEl.textContent = label;
    }
    input.value = initialValue || "";
    if (className) {
      element.classList.add(className);
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
      showError,
    };
  }
}
