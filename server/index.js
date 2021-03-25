const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const parser = require('xml-js');
const port = process.env.PORT || 5000;
const cors = require('cors')({ origin: true });
const app = express();

app.use(cors);
app.use(bodyParser.json());
var url = '/api/BusSttnInfoInqireService/getCrdntPrxmtSttnList';
app.use(url, (req, res) => {
    var baseUrl = req.baseUrl.replace('/api', '');
    var parameter = req.url.replace('/', '');
    request({
        method: 'GET',
        uri: 'http://openapi.tago.go.kr/openapi/service' + baseUrl + parameter
    }, function (err, response, body) {
        body = parser.xml2js(body, { compact: true, spaces: 4 })
        res.json(body);
    });
});
app.listen(port, () => {
    console.log(`express is running on ${port}`);
})