const https = require("https");
/*
The code relating to socket.io events was based on code sourced from 2 different sites:

https://socket.io/get-started/chat

https://stackoverflow.com/questions/9914816/what-is-an-example-of-the-simplest-possible-socket-io-example
*/
var http = require('http'),
    fs = require('fs'),
    index = fs.readFileSync(__dirname + '/index.html');

var app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
});
var latestConnectionTime = "9999999999999999";

var io = require('socket.io').listen(app);

function getDevice(){

var options = {
  host: 'car-seat-monitor-api-daithi303.c9users.io',
  port: 8080,
  path: '/api/sensorState/0001',
    headers: {
        Accept: 'application/json'
    }
};
  
https.get(options, res => {
  res.setEncoding("utf8");
  let body = "";
  res.on("data", data => {
    body += data;
  });
  res.on("end", () => {
   
    body = JSON.parse(body);
    var obj = {carSeatStatusValue: body[0].carSeatStatusValue,
    vehicleSpeedValue: body[0].vehicleSpeedValue,
    rssiStatusValue: body[0].rssiStatusValue,
    geoLat: body[0].geoLat,
    geoLong: body[0].geoLong,
    connectionState: body[0].connectionState
    };
    
    io.emit('sensorState', obj);

}
  );
});
}


function getAlert(){
 console.log("getAlert(server initiated)latestConnectionTime:"+latestConnectionTime);
var options = {
  host: 'car-seat-monitor-api-daithi303.c9users.io',
  port: 8080,
  path: '/api/alert/0001',
    headers: {
        Accept: 'application/json'
    }
};
  
https.get(options, res => {
  res.setEncoding("utf8");
  let body = "";
  res.on("data", data => {
    body += data;
  });
  res.on("end", () => {
    body = JSON.parse(body);
    console.log("Alert count:"+body.length);
    io.emit('alert', body);
}
  );
});
}



io.on('connection', function(socket) {
   socket.emit('welcome', { message: 'Welcome!', id: socket.id });
    socket.on('i am client', console.log);

});

function getData() {
   getDevice();
   getAlert();
}

setInterval(getData, 3000);

app.listen(8080);