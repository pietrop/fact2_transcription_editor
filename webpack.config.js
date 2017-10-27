/**
 * Webpack config 
 * https://webpack.js.org/concepts/configuration/
 */
"use strict";

const path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var webpack = require("webpack");

const config = {
  entry: './src/app/app.js',
  devtool: 'inline-source-map',
   devServer: {    
      contentBase: path.join(__dirname, "dist"),
      compress: true,
      // host: "127.0.0.1",
      host :"0.0.0.0",
      port: 9000,
      bonjour: true
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
 module: {
      loaders: [
          { 
            test: /\.html.ejs$/, 
            loader: "underscore-template-loader",
            query: {
                    prependFilenameComment: __dirname,
                } 
            }
      ]
  },
  plugins: [
    //https://github.com/kevlened/copy-webpack-plugin
        new CopyWebpackPlugin([
            { from: 'src/index.html', to: 'index.html' },
        ]),
        //TODO: maybe compile the CSS to speed up load time?
         new CopyWebpackPlugin([
            { from: 'src/style.css', to: 'style.css' },
            { from: 'src/toggle_switch.css', to: 'toggle_switch.css' }
        ]),
        new webpack.ProvidePlugin({
           $: "jquery",
           jQuery: "jquery",
           jquery: 'jquery',
           'window.jQuery': 'jquery',
           _: "underscore",
          Backbone: 'backbone',
          Mousetrap: "mousetrap"
       })
    ]
};


module.exports = config;



