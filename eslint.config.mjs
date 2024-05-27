// .eslintrc.js

module.exports = {
  // ...other config
  overrides: [
      {
          files: ["src/**/*"],
          rules: {
              semi: ["warn", "always"]
          }
      },
      {
          files:["test/**/*"],
          rules: {
              "no-console": "off"
          }
      }
  ]
};
