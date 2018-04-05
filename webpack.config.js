var path = require('path');

module.exports = [{
        entry: {
            "paro": "./src/index.ts"
        },
        output: {
            filename: "[name].js",
            path: path.resolve(__dirname, 'dist'),
            library: 'paro',
            libraryTarget: 'umd'
        },
        devtool: "source-map",
        resolve: {
            extensions: [".ts", ".js", ".json"]
        },
        module: {
            rules: [
                { test: /\.ts?$/, loader: "awesome-typescript-loader" },
                { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
            ]
        }
    },
    {
        entry: {
            "pdf": "./src/pdf/pdf.ts",
            "animations": "./src/animations/card.ts"
        },
        output: {
            filename: "[name]/[name].js",
            path: path.resolve(__dirname, 'dist'),
            library: 'paro',
            libraryTarget: 'umd'
        },
        devtool: "source-map",
        resolve: {
            extensions: [".ts", ".js", ".json"]
        },
        module: {
            rules: [
                { test: /\.ts?$/, loader: "awesome-typescript-loader" },
                { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
            ]
        }
    }
];