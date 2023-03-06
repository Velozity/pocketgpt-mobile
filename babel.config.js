module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // NOTE: `expo-router/babel` is a temporary extension to `babel-preset-expo`.
      require.resolve("expo-router/babel"),
      "react-native-reanimated/plugin",
      "@babel/proposal-export-namespace-from",
      [
        "module-resolver",
        {
          alias: {
            // This needs to be mirrored in tsconfig.json
            "@app": "./app",
            "@lib": "./lib",
            "@providers": "./providers",
            "@services": "./services",
            "@components": "./components",
            "@utils": "./utils",
          },
        },
      ],
    ],
  };
};
