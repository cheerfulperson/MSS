import { Button } from "./components/UI";
import { Router } from "./routes";
import "./global.scss";

class App {
  private router = new Router();
  public init() {
    this.router.init();
  }
}

export default App;
