const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://anikate12:anikate123@cluster0-py51n.mongodb.net/test?retryWrites=true&w=majority',{useNewUrlParser: true,useUnifiedTopology: true});

var chatSchema = new mongoose.Schema({
    username :{ 
        type :String
    },
    status : {
        type :Boolean
    },
    messages : {
      type :  String
    }

});

var Chat = mongoose.model('Chat',chatSchema);

var urlencodedParser =bodyParser.urlencoded({extended: false});

app.set('view engine','ejs');

app.get('/', function(req, res) {
    res.render('chat');
});


//app.post('/',  function(req,res){
    
    // Chat.create(req.body).then(function(chat){
    //     res.send(chat);
    // });
    
    // var chat = Chat(req.body).save(function(err,data){
    //     if (err) throw err;
    //     console.log(req.body);
    //     res.json(data);
    // });
//});

io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username= username;
        io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
    });

    socket.on('disconnect', function(username) {
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
    })

    socket.on('chat_message', function(message) {
        var chat = Chat({username : socket.username, messages : message}).save(function(err,data){
            if (err) throw err;
            io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
        });        
    });
    
});

// var chat = Chat().save(function(err,data){
//         if (err) throw err;
// });

const server = http.listen(process.env.PORT || 8080, function() {
    console.log('listening on *:8080');
});