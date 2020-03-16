const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.use(express.static(__dirname+"/public"));

io.on("connection",function(socket){
    socket.on("dibujando",function(data){
        socket.broadcast.emit("dibujando",data);
    });
    socket.on("intento palabra",function(data){
        io.emit("recibiendo palabra",data);
    });
    if(io.engine.clientsCount >= 2){
        socket.emit('inicioJuego', io.engine.clientsCount);
    }
    else{
        socket.emit('faltaJug');
    }
});

http.listen(3000,function(){
    console.log("Are you listening?! Port 3000");
});