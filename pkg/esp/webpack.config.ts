import path from "path";
import webpack from "webpack";
import { merge } from "webpack-merge";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";

// in case you run into any typescript error when configuring `devServer`
import "webpack-dev-server";

import DevConfig from "./webpack.config.dev";
import ProdConfig from "./webpack.config.prod";

const baseConfig: webpack.Configuration = {
  entry: path.resolve(__dirname, "./src/index.tsx"),
  mode: "development",
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts", '.tsx', '.scss'],
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "./mc/dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./public/index.html"),
      filename: "index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "bundle.css",
    }),
    new CleanWebpackPlugin(),
  ],
  optimization: {
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
  },
};

const setup = ({ mode }: { mode: "prod" | "dev" }) => {
  const isProductionMode = mode === "prod";
  const envConfig = isProductionMode ? ProdConfig : DevConfig;

  return merge(baseConfig, envConfig);
};

export default setup;
