import { Loader } from "../../components";
import { Page, TTreeRenderElement } from "../template";

import LoadingHTML from "./loading.html";
import "./loading.scss";

export const LoadingPage = new Page<HTMLDivElement>({
  html: LoadingHTML,
  onTreeRender(props) {
    const tree: TTreeRenderElement[] = [new Loader({ size: 16 })];
    return {
      tree,
    };
  },
});
