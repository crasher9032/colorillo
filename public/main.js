$(document).ready(function(){
    var socket = io();
    socket.on('faltaJug', function(){
        alert("Son necesarios al menos 2 jugadores");
        // location.reload();
    });
    var usuario = prompt("Ingresa el nombre de usuario");
    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight/2;
    var context = canvas.getContext("2d");
    var posicion = {};
    // var io = SocketIO.listen(server);
    var tiempo;
    
    document.getElementById('btnComenzar').onclick = function(){
        socket.emit('comienzoJuego');
    };

    document.getElementById("canvas").disabled = true;

    
    socket.on('inicioJuego', function(jugadores){
        // do {
        //     persona++;
        //     if(persona > jugadores.length){
        //         persona=0;
        //     }
        //     var palabra = palabras[Math.round(Math.random()*palabras.length)];
        //     $("#ulComentarios").append(`<li><b>Comienza el juego</b></li>`);
        //     io.clients[persona].send(alert("Dibuja lo siguiente: "+palabra));
            
        //     contTurno++;
        //     document.getElementById('contador').innerHTML = tiempo;

        // } while (contTurno!=turnos);
        socket.on('juego', function(){
            document.getElementById('palabra').disabled = false;
            document.getElementById("canvas").disabled = true;
            tiempo = 60;
            for(var i = 0; i < tiempo; i++){
                document.getElementById('contador').innerHTML = tiempo;
                sleep(1000);
                tiempo--;
            }
        });

        socket.on('encontrado', function(puntos){
            $("#ulComentarios").append(`<li><b>${puntos}</b></li>`)
        });


        socket.on('dibujante', function(data){
            alert("Dibuja lo siguiente: "+data);
            document.getElementById("canvas").disabled = false;
            document.getElementById('palabra').disabled = true;
        });

        $("#canvas").on("mousedown", onMouseDown);
        $("#canvas").on("mouseup", onMouseUp);
        $("#canvas").on("mouseout", onMouseUp);
        $("#canvas").on("mousemove", onMouseMove);

        $("#canvas").on("touchstart", onMouseDown);
        $("#canvas").on("touchend", onMouseUp);
        $("#canvas").on("touchcancel", onMouseUp);
        $("#canvas").on("touchmove", onMouseMove);


        $("#colorcito").on("change",function(data){
            context.strokeStyle = data.target.value;
        })

        $("#anchito").on("change",function(data){
            context.lineWidth = data.target.value;
        })

        $("form").submit(function(e){
            e.preventDefault();
            var data = {
                username: usuario,
                message: $("#palabra").val(),
                tiempo: tiempo
            }
            socket.emit("intento palabra",data);
            $('#palabra').val('');
            return false;
        });

        socket.on("recibiendo palabra",function(data){
            $("#ulComentarios").append(`<li><b>${data.username}</b> - ${data.message}</li>`)
        });

        socket.on("dibujando",dibujando);

        function dibujarLinea(x0,y0,x1,y1){
            context.beginPath();
            context.moveTo(x0,y0);
            context.lineTo(x1,y1);
            context.lineWidth = anchito.value;
            context.stroke();
            context.closePath();

            socket.emit("dibujando",{
                x0:x0,
                y0:y0,
                x1:x1,
                y1:y1
            });
        }

        function onMouseDown(e){
            dibujando = true;
            posicion.x = e.clientX || e.touches[0].clientX;
            posicion.y = e.clientY || e.touches[0].clientY;
        }

        function onMouseUp(e){
            if(!dibujando){
                return;
            }
            dibujando = false;
            dibujarLinea(posicion.x, posicion.y, e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY);
        }

        function onMouseMove(e){
            if(!dibujando){
                return;
            }
            dibujarLinea(posicion.x,posicion.y,e.clientX || e.touches[0].clientX,e.clientY || e.touches[0].clientY);
            posicion.x = e.clientX || e.touches[0].clientX;
            posicion.y = e.clientY || e.touches[0].clientY;
        }

        function dibujando(data){
            dibujarLinea(data.x0,data.y0,data.x1,data.y1);
        }
    });
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}