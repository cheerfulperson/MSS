import { Button, Input } from "../../components";
import { useAuth, useFetch, useLocation } from "../../hooks";
import { setRepeater } from "../../utils";
import { Page } from "../template";

import MainHTML from "./main.html";
import "./main.scss";

interface SensorsData {
  temperature: number;
  dhtTemperature: number;
  humidity: number;
  co: number;
  aht: {
    temperature: number;
    humidity: number;
  };
  bmp: {
    temperature: number;
    pressure: number;
    seaLevelMeters: number;
  };
}

const repeat = setRepeater();

export const MainPage = new Page<HTMLDivElement>({
  html: MainHTML,
  onTreeRemove() {
    repeat.clear();
  },
  onTreeRender(props) {
    const network = props.element.querySelector<HTMLSpanElement>(".Main__network span")!;
    const home = props.element.querySelector<HTMLSpanElement>(".Main__home span")!;
    // const temperature = props.element.querySelector<HTMLSpanElement>(".Main__temperature span")!;
    // const dhtTemperature = props.element.querySelector<HTMLSpanElement>(".Main__dhtTemperature span")!;
    // const ahtTemperature = props.element.querySelector<HTMLSpanElement>(".Main__ahtTemperature span")!;
    // const bmpTemperature = props.element.querySelector<HTMLSpanElement>(".Main__bmpTemperature span")!;
    // const humidity = props.element.querySelector<HTMLSpanElement>(".Main__humidity span")!;
    // const ahtHumidity = props.element.querySelector<HTMLSpanElement>(".Main__ahtHumidity span")!;
    // const pressure = props.element.querySelector<HTMLSpanElement>(".Main__pressure span")!;
    // const seaLevelMeters = props.element.querySelector<HTMLSpanElement>(".Main__seaLevelMeters span")!;
    // const co = props.element.querySelector<HTMLSpanElement>(".Main__co span")!;

    const { config, registerAuthListener } = useAuth();
    const { request } = useFetch();
    const { goTo } = useLocation();

    let homeSlugData: string = "";

    const homeSlug = new Input({
      label: "Id вашего дома:",
      placeholder: "home-name.io",
      className: "Login__input",
      onChange(e) {
        homeSlugData = (e.target as HTMLInputElement).value;
      },
    });
    const addHome = new Button({
      children: "Добавить", className: "Main__button", type: 'button', customAttr: { type: "submit" }, onClick(e) {
        request({ type: "post", body: { slug: homeSlugData }, path: "/config/home" })
      },
    });

    // const updateSensorData = () => {
    //   request<SensorsData>({ path: "sensors", type: "get" }).then((data) => {
    //     const aht = typeof data.aht === "string" ? JSON.parse(data.aht) : data.aht;
    //     const bmp = typeof data.bmp === "string" ? JSON.parse(data.bmp) : data.bmp;
    //     temperature.textContent = `${data.temperature.toFixed(3) || "-"} °C`;
    //     dhtTemperature.textContent = `${data.dhtTemperature || "-"} °C`;
    //     ahtTemperature.textContent = `${aht.temperature.toFixed(3) || "-"} °C`;
    //     bmpTemperature.textContent = `${bmp.temperature.toFixed(3) || "-"} °C`;
    //     humidity.textContent = `${data.humidity || "-"} %`;
    //     ahtHumidity.textContent = `${aht.humidity || "-"} %`;
    //     co.textContent = `${data.co.toFixed(3) || "-"} ppm`;
    //     pressure.textContent = `${bmp.pressure ? (bmp.pressure * 0.00750063755419211).toFixed(3) : "-"} мм рт.ст.`;
    //     seaLevelMeters.textContent = `${bmp.seaLevelMeters ? Math.floor(bmp.seaLevelMeters) : "-"} м`;
    //   });
    // };
    // const button = new Button({
    //   children: "Обновить данные",
    //   className: "Main__button",
    //   onClick(e) {
    //     updateSensorData();
    //   },
    //   customAttr: { type: "button" },
    // });
    const goToLoginButton = new Button({
      children: "Сменить сеть",
      className: "Main__buttonLogin",
      onClick() {
        goTo("/login");
      },
      customAttr: { type: "button" },
    });

    registerAuthListener(() => {
      network.textContent = config.ssid || "-";
      home.textContent = config.homeSlug || "-";
      homeSlugData = config.homeSlug || "-";
    });

    // repeat(updateSensorData, { callImmediately: true });

    return {
      tree: [{ selector: ".Main__body", tree: [goToLoginButton, homeSlug, addHome] }],
    };
  },
});
