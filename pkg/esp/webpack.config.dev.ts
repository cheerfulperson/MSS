import { Configuration } from "webpack";
import path from "path";

const config: Configuration = {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    port: 5000,
  },
};

export default config;
