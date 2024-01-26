import { Configuration } from "webpack";
import path from "path";

const config: Configuration = {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, "public"),
      watch: true,
      publicPath: "auto",
    },
    hot: true,
    liveReload: true,
    port: 5000,
  },
};

export default config;
