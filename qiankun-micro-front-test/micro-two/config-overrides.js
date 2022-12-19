const { name } = require("./package");
const {
  override,
  addLessLoader,
  fixBabelImports,
  addWebpackAlias,
  adjustStyleLoaders,
  watchAll,
  overrideDevServer,
} = require("customize-cra");
const path = require("path");

module.exports = {
  webpack: override(
    (config) => {
      config.output.library = `${name}-[name]`;
      config.output.libraryTarget = "umd";
      config.output.chunkLoadingGlobal = `webpackJsonp_${name}`;
      return config;
    },
    // antd样式按需引入
    fixBabelImports("import", {
      libraryName: "antd",
      libraryDirectory: "es",
      style: true,
    }),
    //引入less
    addLessLoader({
      lessOptions: {
        javascriptEnabled: true,
        // 自定义antd主题
        modifyVars: { "@primary-color": "green" }, 
      },
    }),
    adjustStyleLoaders(({ use: [, , postcss] }) => {
      const postcssOptions = postcss.options;
      postcss.options = { postcssOptions };
    }),
    // 路径别名
    addWebpackAlias({
      "@": path.resolve(__dirname, "src"),
      "@control": path.resolve(__dirname, "src/control"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@util": path.resolve(__dirname, "src/util"),
      "@model": path.resolve(__dirname, "src/model"),
      "@assets": path.resolve(__dirname, "src/assets"),
    })
  ),
  devServer: overrideDevServer((config) => {
    config.headers = config.headers || {};
    config.headers["Access-Control-Allow-Origin"] = "*";
    return config;
  }, watchAll()),
};