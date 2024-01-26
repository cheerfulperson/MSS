import { RenderResult, Component } from "../../../types";
import { getNode } from "../../../utils";

import HTML from "./select.html";
import "./select.scss";

export interface ISelectOption {
  value: string;
  text?: string;
}

interface ISelectProps {
  className?: string;
  customAttrs?: Record<string, string>;
  initialValue?: string;
  label?: string;
  onChange?: (e: InputEvent) => void;
  options?: Array<ISelectOption>;
}

export class Select<T extends HTMLElement = HTMLDivElement> extends Component {
  private props: ISelectProps;
  public element: T = getNode<T>(HTML);
  public id: string = "select";

  constructor(props?: ISelectProps) {
    super();
    this.props = props || {};
  }

  public setOptions(options: ISelectOption[]) {
    const select = this.element.querySelector<HTMLSelectElement>("select")!;
    select.innerHTML = "";
    select.insertAdjacentHTML("beforeend", `<option value="">-</option>`);
    options.forEach(({ value, text }) => {
      select.insertAdjacentHTML("beforeend", `<option value="${value}">${text || value}</option>`);
    });
  }

  public render(): RenderResult<T> {
    const { className, customAttrs = {}, initialValue, label, options = [], onChange } = this.props;
    const node = this.element;
    const select = node.querySelector<HTMLSelectElement>("select")!;
    const labelEl = node.querySelector(".Select__label")!;

    if (label) {
      labelEl.append(label);
    } else {
      labelEl.remove();
    }

    if (className) {
      select.classList.add(className);
    }

    if (initialValue) {
      select.value = initialValue;
    }

    Object.entries(customAttrs).forEach(([attr, value]) => {
      select.setAttribute(attr, value);
    });

    this.setOptions(options);

    select.addEventListener("change", (e) => {
      if (onChange) {
        onChange(e as InputEvent);
      }
    });

    return {
      element: node,
    };
  }
}
