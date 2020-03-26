const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
    console.log(argv);
    return {
        entry: "./src/main.js",
        output: {
            path: path.join(__dirname, "dist"),
            filename: "[name].bundle.js"
        },
        devServer: {
            contentBase: "dist",
            port: 9000,
            // overlay build error messages in the browser
            overlay: true
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: "vue-loader"
                },
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
