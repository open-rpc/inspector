const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const { prependWebpackPlugin } = require("@rescripts/utilities");

module.exports = function override(config, env) {
  config.plugins.unshift(new MonacoWebpackPlugin({
    // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
    languages: ["json", "html"]
  }))
  return config;
}
