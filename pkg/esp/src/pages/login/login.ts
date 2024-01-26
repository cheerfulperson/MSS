import { Button, ISelectOption, Input, Select } from "../../components";
import { useAuth, useFetch } from "../../hooks";
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
    const { checkAuth } = useAuth();
    const { request } = useFetch();

    let body: IBody = {
      ssid: null,
      password: null,
    };

    const options: ISelectOption[] = [
      { value: "", text: "-" },
      { value: "Thsa", text: "Thsa" },
    ];
    const form = props.element.querySelector<HTMLFormElement>("form")!;
    const errors = props.element.querySelector<HTMLSpanElement>(".Login__error")!;
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
            }
          });
        })
        .catch(() => {
          errors.textContent = "Не удалось подключиться к сети";
        });
    });

    const tree: TTreeRenderElement[] = [
      {
        selector: "form",
        tree: [select, password, button],
      },
    ];
    return {
      tree,
    };
  },
});
