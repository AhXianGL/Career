const { name } = require("./package");
const {
  override,
  fixBabelImports,
  addWebpackAlias,
  adjustStyleLoaders,
  addLessLoader,
  watchAll,
  overrideDevServer,
} = require("customize-cra");

const path = require("path");

module.exports = {
  // 暴露模块，定义名称
  webpack: override(
    (config) => {
      config.output.library = `${name}-[name]`;
      config.output.libraryTarget = "umd";
      config.cache=false;
      config.output.chunkLoadingGlobal = `webpackJsonp_${name}`;
      return config;
    },
    //按需引入
    fixBabelImports("import", {
      libraryName: "antd",
      libraryDirectory: "es",
      style: true,
    }),
    //配置antd主题
    addLessLoader({
      lessOptions: {
        javascriptEnabled: true,
        modifyVars: { "@primary-color": "green" }, //自定义主题
      },
    }),
    adjustStyleLoaders(({ use: [, , postcss] }) => {
      const postcssOptions = postcss.options;
      postcss.options = { postcssOptions };
    }),
    // 路径别名
    addWebpackAlias({
      "@": path.resolve(__dirname, "src"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@components": path.resolve(__dirname, "src/assets"),
      "@core": path.resolve(__dirname, "src/model"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@utils": path.resolve(__dirname, "src/util"),
    })
  ),
  // 配置跨域
  devServer: overrideDevServer((config) => {
    config.headers = config.headers || {};
    config.headers["Access-Control-Allow-Origin"] = "*";
    return config;
  }, watchAll()),
};
