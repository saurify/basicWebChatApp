var express= require('express');
var app = require('express')();                         //importing express
var server = require("http").Server(app);               //creating a http server using express
var io = require("socket.io").listen(server);           //adding socket io to our server
users = [];                                             //array of users
connections = [];                                       //list of active socket connections

server.listen(process.env.PORT || 3000);                   //deploying server on posrt 3000 or any online server
console.log("Server running...");

app.use(express.static('./'))
app.get('/', function(req, res) {
    res.sendFile((__dirname + '/index.html'));              //redirecting to index.html
});


io.sockets.on('connection', socket =>{
    connections.push(socket);                                           //adding socket to our connections arry        

    socket.on('disconnect', data=>{                                     // disconnect
        users.splice(users.indexOf(socket.username), 1);                //removing user  
        updateUsernames();                                             //updating users
        connections.splice(connections.indexOf(socket), 1);             //removing connection   
                
    });
    
    socket.on('send message', data =>{                                      // send message
        console.log(data);
        io.sockets.emit('new message', {msg: data, user: socket.username});         //sending message and username
    });

    
    socket.on('new user', (data, callback)=>{                         // New User
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();                                              //updating users array
    });

    function updateUsernames() {                                                  //function to update user list
        io.sockets.emit('get users', users);
    }

});