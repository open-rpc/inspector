const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const { prependWebpackPlugin } = require("@rescripts/utilities");

console.log("loaded rescripts file");

module.exports = function override(config, env) {
  console.log("mangling webpack config");
  //do stuff with the webpack config...
  config.plugins.unshift(new MonacoWebpackPlugin({
    // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
    languages: ["json", "html"]
  }))
  return config;
}
