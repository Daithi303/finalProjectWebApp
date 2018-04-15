const https = require("https");
var http = require('http'),
    fs = require('fs'),
    // NEVER use a Sync function except at start-up!
    index = fs.readFileSync(__dirname + '/index.html');

// Send index.html to all requests
var app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
});
var latestConnectionTime = "9999999999999999";


// Socket.io server listens to our app
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
    //console.log(body);
   
    body = JSON.parse(body);
    ///////////////////////////////////////////////////

    ///////////////////////////////////////////////////

    var obj = {carSeatStatusValue: body[0].carSeatStatusValue,
    vehicleSpeedValue: body[0].vehicleSpeedValue,
    rssiStatusValue: body[0].rssiStatusValue,
    geoLat: body[0].geoLat,
    geoLong: body[0].geoLong,
    connectionState: body[0].connectionState
    };
    
    io.emit('sensorState', obj);
   /* console.log(
      `carSeatStatusValue: ${body[0].carSeatStatusValue} -`,
      `vehicleSpeedValue: ${body[0].vehicleSpeedValue} -`,
      `rssiStatusValue: ${body[0].rssiStatusValue}`,
      `geoLat: ${body[0].geoLat} -`,
      `geoLong: ${body[0].geoLong}`,
      `connectionState: ${body[0].connectionState}`
      
    );
    
  */
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
    // Use socket to communicate with this particular client only, sending it it's own id
   socket.emit('welcome', { message: 'Welcome!', id: socket.id });

    socket.on('i am client', console.log);

});

function getData() {
   getDevice();
   getAlert();
}

setInterval(getData, 3000);

app.listen(8080);