import path from "path";
import dotenv from "dotenv";
import webpack, { DefinePlugin } from "webpack";
import { merge } from "webpack-merge";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import fs from "fs";
import { globSync } from "glob";

// in case you run into any typescript error when configuring `devServer`
import "webpack-dev-server";

import DevConfig from "./webpack.config.dev";
import ProdConfig from "./webpack.config.prod";

function getFragmentContentList() {
  const fragmentFiles = globSync("src/**/*.html");

  const fileContentList = {};

  fragmentFiles.forEach((fileFullPath) => {
    const key = fileFullPath.split("\\").slice(-1)[0].split(".").shift()!;

    Object.defineProperty(fileContentList, key, {
      get() {
        return fs.readFileSync(fileFullPath, "utf-8");
      },
    });
  });

  return fileContentList;
}

const baseConfig: webpack.Configuration = {
  entry: path.resolve(__dirname, "./src/index.ts"),
  mode: "development",
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              minimize: true,
            },
          },
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
    extensions: [".js", ".ts", ".tsx", ".scss"],
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "./mc/static"),
    publicPath: "auto",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./public/index.html"),
      filename: "index.html",
      fragment: getFragmentContentList(),
    }),
    new MiniCssExtractPlugin({
      filename: "bundle.css",
    }),
    new CleanWebpackPlugin(),
    new DefinePlugin({
      "process.env": JSON.stringify(dotenv.config().parsed),
    }),
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
