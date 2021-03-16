
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/busStationInfo',
        createProxyMiddleware({
            target: "http://openapi.tago.go.kr/openapi/service/BusSttnInfoInqireService/getCrdntPrxmtSttnList",
            changeOrigin: true,
            pathRewrite: {
                '^/busStationInfo': '' // URL ^/api -> 공백 변경
            }
        })
    );
    app.use(
        '/busArravalInfo',
        createProxyMiddleware({
            target: "http://openapi.tago.go.kr/openapi/service/ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList",
            changeOrigin: true,
            pathRewrite: {
                '^/busArravalInfo': '' // URL ^/api -> 공백 변경
            }
        })

    );
};