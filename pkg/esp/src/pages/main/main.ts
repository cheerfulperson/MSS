import { useAuth } from "../../hooks";
import { Page } from "../template";

import MainHTML from "./main.html";
import "./main.scss";

export const MainPage = new Page<HTMLDivElement>({
  html: MainHTML,
  onTreeRender(props) {
    const { config } = useAuth();
    const network = props.element.querySelector<HTMLSpanElement>(".Main__network span")!;
    network.textContent = config.ssid || "-";

    return {
      tree: [],
    };
  },
});
