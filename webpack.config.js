const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
    return {
        /* 
            entry point for the app. 
            Webpack will use the as the base for everything (css imported here etc)
        */
        entry: "./src/main.js",
        output: {
            path: path.join(__dirname, "dist"),
            filename: "[name].bundle.js"
        },
        devServer: {
            // where to serve from
            contentBase: "dist",
            port: 9000,
            // overlay build error messages in the browser
            overlay: true
        },
        module: {
            rules: [
                // processing for .vue files
                {
                    test: /\.vue$/,
                    loader: "vue-loader"
                },
                // transpile vue + normal js files using babel
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env"]
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        /* 
                            in production, extract css to seperate files, in development use 
                            vue-style-loader to enable hot reloading 
                        */
                        argv.mode === "production"
                            ? MiniCssExtractPlugin.loader
                            : "vue-style-loader",
                        "css-loader"
                    ]
                }
            ]
        },
        plugins: [
            new VueLoaderPlugin(),
            new HtmlWebpackPlugin({
                template: "./public/index.html"
            }),
            new MiniCssExtractPlugin()
        ]
    };
};
