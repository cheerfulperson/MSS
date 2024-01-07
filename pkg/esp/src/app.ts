import { Component, ConnectWiFiForm, Header, UIComponent } from "./components";
import { Button, Input, Select, Toggle } from "./components/UI";
import "./global.scss";

class App {
  private components: Component[] = [new ConnectWiFiForm(), new Header()];
  private uiComponents: UIComponent[] = [new Button(), new Input(), new Select(), new Toggle()];

  public init() {
    this.components.forEach((el) => {
      el.init();
    });
  }
}

export default App;
