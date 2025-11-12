module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@config": "./config",
            "@utils": "./utils",
            "@screens": "./screens",
            "@components": "./components",
            "@navigation": "./navigation",
            "@context": "./context"
          },
        },
      ],
    ],
  };
};
