import { Button, ISelectOption, Input, Select } from "../../components";
import { useAuth, useFetch, useLocation } from "../../hooks";
import { Page, TTreeRenderElement } from "../template";

import LoginHTML from "./login.html";
import "./login.scss";

interface INetworks {
  ssid: string;
  rssi: string;
  encryptionType: string;
}

interface IBody {
  ssid: string | null;
  password: string | null;
}

export const LoginPage = new Page<HTMLDivElement>({
  html: LoginHTML,
  onTreeRender(props) {
    const form = props.element.querySelector<HTMLFormElement>("form")!;
    const errors = props.element.querySelector<HTMLSpanElement>(".Login__error")!;
    const { checkAuth, isAuthorized } = useAuth();
    const { request } = useFetch();
    const { goTo } = useLocation();

    let body: IBody = {
      ssid: null,
      password: null,
    };

    const options: ISelectOption[] = [
      { value: "", text: "-" },
      { value: "Thsa", text: "Thsa" },
    ];
    const select = new Select({
      options,
      label: "Название сети:",
      onChange(e) {
        errors.textContent = "";
        body.ssid = (e.target as HTMLSelectElement).value;
      },
    });
    const password = new Input({
      label: "Пароль:",
      className: "Login__input",
      onChange(e) {
        errors.textContent = "";
        body.password = (e.target as HTMLInputElement).value;
      },
    });
    const button = new Button({ children: "Подключиться", className: "Login__button", customAttr: { type: "submit" } });
    const buttonClose = new Button({
      children: "На главную",
      className: "Login__close",
      onClick() {
        goTo("/");
      },
      customAttr: { type: "button" },
    });

    request<Array<string>>({ type: "get", path: "/networks" }).then((data) => {
      select.setOptions(
        data.map((net) => JSON.parse(net) as INetworks).map((net) => ({ value: net.ssid, text: net.ssid }))
      );
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      request({ type: "post", body, path: "/config" })
        .then(() => {
          checkAuth((isAuth) => {
            if (!isAuth) {
              errors.textContent = "Не удалось подключиться к сети";
            } else {
              buttonClose.element.style.display = "block";
            }
          });
        })
        .catch(() => {
          errors.textContent = "Не удалось подключиться к сети";
        });
    });

    if (!isAuthorized) {
      buttonClose.element.style.display = "none";
    }
    const tree: TTreeRenderElement[] = [
      {
        selector: "form",
        tree: [select, password, button, buttonClose],
      },
    ];
    return {
      tree,
    };
  },
});
