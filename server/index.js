const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const convert = require('xml-js');
const port = process.env.PORT || 5000;
const cors = require('cors')({ origin: true });
const app = express();
const path = require('path');

app.use(cors);
app.use(bodyParser.json());

function nativeType(value) {
    var nValue = Number(value);
    if (!isNaN(nValue)) {
        return nValue;
    }
    var bValue = value.toLowerCase();
    if (bValue === 'true') {
        return true;
    } else if (bValue === 'false') {
        return false;
    }
    return value;
}

var removeJsonTextAttribute = function (value, parentElement) {
    try {
        var keyNo = Object.keys(parentElement._parent).length;
        var keyName = Object.keys(parentElement._parent)[keyNo - 1];
        parentElement._parent[keyName] = nativeType(value);
    } catch (e) { }
}

var options = {
    compact: true,
    trim: true,
    ignoreDeclaration: true,
    ignoreInstruction: true,
    ignoreAttributes: true,
    ignoreComment: true,
    ignoreCdata: true,
    ignoreDoctype: true,
    textFn: removeJsonTextAttribute
};

// 위치 좌표 넘길 시 근처 버스 정류장 정보 조회
app.use('/api/BusSttnInfoInqireService/getCrdntPrxmtSttnList', (req, res) => {
    var baseUrl = req.baseUrl.replace('/api', '');
    var parameter = req.url.replace('/', '');
    request({
        method: 'GET',
        uri: 'http://openapi.tago.go.kr/openapi/service' + baseUrl + parameter
    }, (err, response, body) => {
        body = convert.xml2js(body, options);
        res.send(body);
    });
});


app.use('/api/ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList', (req, res) => {
    var baseUrl = req.baseUrl.replace('/api', '');
    var parameter = req.url.replace('/', '');
    request({
        method: 'GET',
        uri: 'http://openapi.tago.go.kr/openapi/service' + baseUrl + parameter
    }, function (err, response, body) {
        body = convert.xml2js(body, options);
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