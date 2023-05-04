require("dotenv").config();
module.exports = {
  devServer: {
    proxy: {
      "/api/v1": {
        target: process.env.VUE_APP_TEST_URL,
        changeOrigin: true,
      },
    },
  },
};
