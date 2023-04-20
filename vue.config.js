require('dotenv').config();

module.exports = {
    devServer: {
        proxy: {
            "/work": {
                target: process.env.VUE_APP_API_URL,
                changeOrigin: true,
            },
            "/post": {
                target: process.env.VUE_APP_API_URL,
                changeOrigin: true,
            }
        }
    }
}