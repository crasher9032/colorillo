const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
var clientes = [];
var puntos=[];
var obj = {};
var palabras = ["señal", "alto", "perro", "gato", "lentes", "cerveza", "saltar", "xbox", "youtube", "zelda"];
var turnos = 10;
var tiempo = 60;

app.use(express.static(__dirname+"/public"));

io.on("connection",function(socket){
    clientes.push(socket.id);
    socket.on("dibujando",function(data){
        socket.broadcast.emit("dibujando",data);
    });
    socket.on("intento palabra",function(data){
        if(data.message==palabra){
            if(puntos.find(data.username)){
                puntos[data.username] += data.tiempo;
            }else{
                obj[data.username] = data.tiempo;
                puntos.push(obj);
                obj={};
            }
            socket.emit('encontrado', puntos);
            cont = 0;
        }else{

        }
        io.emit("recibiendo palabra",data);
    });
    socket.on("comienzoJuego", function(){
        var contClientes=0;
        if(io.engine.clientsCount >= 2){
            var contTurno = 0;
            socket.emit('inicioJuego');
            do {
                var palabra = palabras[Math.round(Math.random()*palabras.length)];
                socket.emit('juego');
                    if(contClientes < clientes.length){
                        io.sockets.connected[clientes[contClientes]].emit('dibujante', palabra);   
                    }else{
                        contClientes = 0;
                        io.sockets.connected[clientes[contClientes]].emit('dibujante', palabra);
                    }
                    contClientes++;
                var cont = 60;
                do {
                    sleep(1000);
                    cont--;
                } while (cont > 0);
            } while (contTurno < 10);
        }
        else{
            socket.emit('faltaJug');
        }
    });
});

io.on('disconnect', function(){
    for(var name in clientes){
        if(clientes[name].socket == socket.id){
            delete clientes[name];
            break;
        }
    }
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

http.listen(3000,function(){
    console.log("Are you listening?! Port 3000");
});