// const BabelRcPlugin = require("@jackwilsdon/craco-use-babelrc");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  babel: {
    plugins: ["@babel/plugin-proposal-nullish-coalescing-operator"],
    babelrc: true,
    loaderOptions: (babelLoaderOptions) => {
      const origBabelPresetCRAIndex = babelLoaderOptions.presets.findIndex(
        (preset) => {
          return preset[0].includes("babel-preset-react-app");
        }
      );

      const origBabelPresetCRA =
        babelLoaderOptions.presets[origBabelPresetCRAIndex];

      babelLoaderOptions.presets[origBabelPresetCRAIndex] =
        function overridenPresetCRA(api, opts, env) {
          const babelPresetCRAResult = require(origBabelPresetCRA[0])(
            api,
            origBabelPresetCRA[1],
            env
          );

          babelPresetCRAResult.presets.forEach((preset) => {
            // detect @babel/preset-react with {development: true, runtime: 'automatic'}
            const isReactPreset =
              preset &&
              preset[1] &&
              preset[1].runtime === "automatic" &&
              preset[1].development === true;
            if (isReactPreset) {
              preset[1].importSource = "@welldone-software/why-did-you-render";
            }
          });

          return babelPresetCRAResult;
        };

      return babelLoaderOptions;
    },
  },
  webpack: {
    plugins: [
      new CompressionPlugin({
        filename: "[path][base].br",
        algorithm: "brotliCompress",
        test: /\.(js|css|html|svg)$/,
        compressionOptions: {
          level: 11,
        },
        threshold: 10240,
        minRatio: 0.8,
      }),
      new CompressionPlugin({
        filename: "[path][base].gz",
        algorithm: "gzip",
        test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
        threshold: 10240,
        minRatio: 0.8,
      }),
    ],
    alias: {
      // if you want to track react-redux selectors
      "react-redux":
        process.env.NODE_ENV === "development"
          ? "react-redux/lib"
          : "react-redux",
    },
  },
  // plugins: [{ plugin: BabelRcPlugin }],
};
