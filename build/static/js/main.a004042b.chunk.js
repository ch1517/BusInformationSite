(this.webpackJsonpbus_information_site=this.webpackJsonpbus_information_site||[]).push([[0],{14:function(e,t,n){},29:function(e,t,n){},50:function(e,t,n){"use strict";n.r(t);var o=n(0),r=n(11),a=n.n(r),c=(n(29),n(2)),s=(n(14),n(23)),i=n(52),l=n(53),j=n(56),d=n(54),u=n(55),m=(n(30),n(12)),p=n.n(m),b=n(5),O=n.n(b),v=n(9);var h=function(e){return Object.keys(e).map((function(t){e[t]=e[t]._text})),e},f=n(1),g=v.station_key;function x(e,t,n){return!(e.gpslati<t.lat||e.gpslati>n.lat||e.gpslong<t.lng||e.gpslong>n.lng)}function S(e){var t=Object(s.a)(),n=e.apiState,o=function(o){o.getZoom()>13&&(!function(e,t,n,o,r){var a=n.lat,c=n.lng,s="/api/BusSttnInfoInqireService/getCrdntPrxmtSttnList?serviceKey="+g+"&gpsLati="+a+"&gpsLong="+c;t&&p.a.get(s).then((function(t){var n=t.request.response;if("00"==(n=JSON.parse(n).response).header.resultCode._text){var a=n.body.items.item,c=[];null==a?c=[]:Array.isArray(a)?a.forEach((function(e,t,n){x(e=h(e),o,r)&&c.push(e)})):(a=h(a),c=x(a,o,r)?[]:[a]),e.setStation(c)}else console.log(n.header.resultCode)})).catch((function(e){console.log(e)}))}(e,n,t.getCenter(),t.getBounds()._southWest,t.getBounds()._northEast),n=!0)},r=Object(s.b)({zoomend:function(){e.setZoomLevel(r.getZoom()),o(r)},moveend:function(){o(r)},dragend:function(){n=!0}});return e.zoomLevel<14?Object(f.jsx)("div",{className:"alert-box",children:Object(f.jsx)("h4",{children:"\uc870\uae08 \ub354 \uac00\uae4c\uc774 \uc774\ub3d9\ud574\uc8fc\uc138\uc694"})}):Object(f.jsx)("div",{})}function y(e){return Object(o.useEffect)((function(){return function(){}}),[]),Object(f.jsx)(i.a,{direction:"top",opacity:1,permanent:!0,interactive:!0,children:Object(f.jsxs)("div",{className:e.selectID==e.nodeid?"select":"",children:[Object(f.jsx)("div",{children:Object(f.jsx)("img",{className:"busIcon",src:""+e.selectID==e.nodeid?"/marker.png":"/marker_white.png"})}),Object(f.jsxs)("div",{children:[Object(f.jsx)("span",{children:e.nodenm}),Object(f.jsx)("span",{children:e.nodeid})]})]})})}var I=function(e){var t=this,n=Object(o.useState)(!0),r=Object(c.a)(n,2),a=r[0],s=r[1],i=O.a.icon({iconUrl:"/marker.png",iconRetinaUrl:"/marker.png",iconAnchor:[15,15],popupAnchor:[0,0],iconSize:[30,30]}),m=function(t,n,o,r,a){e.setSelectID(r),e.openModal(t,n,o,r,a)},p="https://api.vworld.kr/req/wmts/1.0.0/"+v.vworld_key+"/Base/{z}/{y}/{x}.png";return Object(f.jsx)("div",{className:"map-container",children:Object(f.jsxs)(l.a,{center:e.position,zoom:e.zoomLevel,scrollWheelZoom:!0,children:[Object(f.jsx)(j.a,{maxZoom:22,maxNativeZoom:18,zoom:e.zoomLevel,attribution:'\xa9 <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',url:p}),Object(f.jsx)(S,{apiState:a,zoomLevel:e.zoomLevel,setZoomLevel:e.setZoomLevel,setStation:e.setStation}),Object(f.jsx)(d.a,{children:function(t){return e.mapState&&(t.setView(e.position,e.zoomLevel),s(!1),e.setMapState(!1)),null}}),e.station.length>0&&e.station.map((function(n,o){var r=n.gpslati,a=n.gpslong,c=n.nodenm,s=n.nodeid,l=n.citycode;return Object(f.jsx)(u.a,{position:[r+"",a+""],icon:i,permanent:!0,eventHandlers:{click:m.bind(t,r,a,c,s,l)},children:Object(f.jsx)(y,{gpslati:r,gpslong:a,nodenm:c,nodeid:s,citycode:l,setSelectID:e.setSelectID,selectID:e.selectID})})}))]})})};var N=function(e){return Object(f.jsx)("div",{className:"infomation-container",children:Object(f.jsx)("div",{className:"infomation-table",children:e.station.length>0&&e.station.map((function(t){var n=t.gpslati,o=t.gpslong,r=t.nodenm,a=t.nodeid,c=t.citycode;return Object(f.jsx)("div",{onClick:function(){return e.openModal(n,o,r,a,c)},children:Object(f.jsxs)("div",{className:"info",children:[Object(f.jsx)("img",{src:"/marker.png"}),Object(f.jsxs)("h5",{children:[r,"(",a,")"]})]})})}))})})};var k=function(){return Object(f.jsx)("header",{className:"App-header",children:Object(f.jsx)("div",{className:"logo",children:"Bus Information"})})};function L(e){return e.array.map((function(e){e.routeno;var t=e.arrprevstationcnt,n=e.arrtime,o=parseInt(parseInt(n)/60);return Object(f.jsxs)("div",{children:[Object(f.jsx)("span",{children:o<3?"\uc7a0\uc2dc \ud6c4 \ub3c4\ucc29":"".concat(o,"\ubd84 \ud6c4")}),Object(f.jsxs)("span",{children:[t," \uc815\uac70\uc7a5 \uc804"]})]})}))}var A=function(e){var t=e.isOpen,n=e.close;return Object(f.jsx)(f.Fragment,{children:t?Object(f.jsx)("div",{className:"modal-container ",children:Object(f.jsxs)("div",{className:"modal",children:[Object(f.jsx)("button",{onClick:n,children:"X"}),Object(f.jsxs)("div",{className:"info-content",children:[Object(f.jsx)("h3",{className:"station-name",children:Object(f.jsx)("font",{children:e.nodenm})}),Object(f.jsx)("div",{className:"arrival-info-container",children:Object.keys(e.arravalInfo).length>0&&Object.keys(e.arravalInfo).map((function(t,n){return Object(f.jsxs)("div",{className:"arrival-bus-info",children:[Object(f.jsxs)("span",{className:"route-number",children:[e.arravalInfo[t][0].routeno,"\ubc88"]}),Object(f.jsx)("span",{className:"arrival-bus-container",children:Object(f.jsx)(L,{array:e.arravalInfo[t]})})]})}))})]})]})}):null})};var C=function(e){var t=Object(o.useState)(16),n=Object(c.a)(t,2),r=n[0],a=n[1],s=Object(o.useState)([36.37412735693837,127.36563659840922]),i=Object(c.a)(s,2),l=i[0],j=i[1],d=Object(o.useState)([]),u=Object(c.a)(d,2),m=u[0],b=u[1],O=Object(o.useState)(!1),g=Object(c.a)(O,2),x=g[0],S=g[1],y=Object(o.useState)(null),L=Object(c.a)(y,2),C=L[0],D=L[1],_=Object(o.useState)({}),w=Object(c.a)(_,2),z=w[0],B=w[1],F=Object(o.useState)(-1),Z=Object(c.a)(F,2),E=Z[0],M=Z[1],J=Object(o.useState)(!1),q=Object(c.a)(J,2),P=q[0],T=q[1],W=function(e,t,n,o,r){j([e,t]),K(r,o),D(n),M(o),a(18),T(!0)},K=function(e,t){var n="/api/ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList"+("?serviceKey="+v.station_key+"&cityCode="+e+"&nodeId="+t);p.a.get(n).then((function(e){var t=e.request.response;if("00"==(t=JSON.parse(t).response).header.resultCode._text){var n=t.body.items,o={};if(null!=n.item)if(0!=(n=n.item).length&&Array.isArray(n))n.forEach((function(e){e=h(e)})),n.map((function(e){var t=e.routeno,n=e.routeid,r=e.arrtime,a=e.arrprevstationcnt,c={};c.routeno=t,c.arrtime=r,c.arrprevstationcnt=a,null==o[n]&&(o[n]=[]),o[n].push(c)}));else if("object"===typeof n){var r={},a=(n=h(n)).routeid;r.routeno=n.routeno,r.arrtime=n.arrtime,r.arrprevstationcnt=n.arrprevstationcnt,null==o[a]&&(o[a]=[]),o[a].push(r)}else console.log(n);B(o),S(!0)}else console.log(t.header.resultCode)})).catch((function(e){console.log(e)}))};return Object(f.jsxs)("div",{className:"App",children:[Object(f.jsx)(k,{}),Object(f.jsxs)("div",{className:"contents",children:[Object(f.jsx)(I,{station:m,setStation:b,openModal:W,position:l,selectID:E,setSelectID:M,zoomLevel:r,setZoomLevel:a,mapState:P,setMapState:T}),Object(f.jsx)(N,{station:m,openModal:W}),Object(f.jsx)(A,{isOpen:x,close:function(){return S(!1)},nodenm:C,arravalInfo:z})]})]})},D=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,57)).then((function(t){var n=t.getCLS,o=t.getFID,r=t.getFCP,a=t.getLCP,c=t.getTTFB;n(e),o(e),r(e),a(e),c(e)}))};a.a.render(Object(f.jsx)(C,{}),document.getElementById("root")),D()},9:function(e){e.exports=JSON.parse('{"station_key":"N%2BQFA%2BwFDx9oMiWdwzjq248QR9Ka1w70Onnmpvdhc1%2FOmwDoLEWlXABOOrTr42J%2F03YjttaCrnwTA4hiJH1OiA%3D%3D","vworld_key":"B68996E4-BC0C-3C4A-B658-93658DD96E73"}')}},[[50,1,2]]]);
//# sourceMappingURL=main.a004042b.chunk.js.map