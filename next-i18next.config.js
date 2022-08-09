const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "ru",
    locales: ["ru", "en"],
    localePath: path.resolve("./public/static/locales"),
  },
};
