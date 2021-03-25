const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const parser = require('xml-js');
const port = process.env.PORT || 5000;
const cors = require('cors')({ origin: true });
const app = express();
const path = require('path');

app.use(cors);
app.use(bodyParser.json());
app.use('/api/BusSttnInfoInqireService/getCrdntPrxmtSttnList', (req, res) => {
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

// 리액트 정적 파일 제공
app.use(express.static(path.join(__dirname, '../build')));

// 라우트 설정
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '../build/index.html'));
});