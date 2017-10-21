//
// @ThomasLandspurg Thomas.Landspurg@gmail.com 2014
// Node.js client to search all tweet within a geographical zone and forwared them
// in real time using a socket
// http://blog.landspurg.net
//
var es_client = require('./search_tool.js');
var streaming = require('./streaming_tool.js');
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(8081);

// routing
app.get('/', function (req, res) {
  console.log('index page request header'+req.headers);
  res.sendFile(__dirname + '/template/show.html');
});
app.get('/search', function(req, res){
    console.log('search page request header'+req.headers);
    res.sendFile(__dirname + '/template/search.html')
});
app.get('/show', function(req, res){
    console.log('show page request header'+req.headers);
    res.sendFile(__dirname + '/template/show.html')
});
app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function (socket) {
    socket.on('search_keyword', function(keyword){
        console.log("keyword is "+keyword);
        //return a list of tweets to website
        es_client.search({
            index : 'tweets',
            type : 'test',
            body : {
                "query":{
                    "match":{
                        "text":keyword
                    }
                }
            }
        }, function(error, response, status){
            if(error){
                console.log("search error: "+error);
            }else{
                data_list = [];
                response.hits.hits.forEach(function(hit){
                    data_list.push(hit._source);
                    console.log("push data to list");
                });
                //console.log(data_list)
                socket.emit('searchTweets', data_list);
            }
        });
    });
    socket.on('click', function(center_point){
        console.log('get data from website (lat:' + center_point["lat"]+", lon"+center_point["lng"]+")");
        es_client.search({
            index :'tweets',
            type : 'test',
            body : {
                "query": {
                    "bool" : {
                        "must" : {
                            "match_all" : {}
                        },
                        "filter" : {
                            "geo_distance" : {
                                "distance" : "20km",
                                "geo" : {
                                    "lat" : center_point["lat"],
                                    "lon" : center_point["lng"]
                                }
                            }
                        }
                    }
                }
            }
        }, function(error, response, status){
            if (error){
                console.log("search error: "+error)
            }else{
                data_list = [];
                response.hits.hits.forEach(function(hit){
                    data_list.push(hit._source);
                    console.log("push data to list");
                });
                //console.log(data_list)
                socket.emit('clickTweets', data_list);
            }
        });
    });
    socket.on('recenter',function(msg){
        console.log("recenter:"+msg);
    });
    socket.on('disconnect',function(socket){
        //  Here we try to get the correct element in the client list
        console.log("disconnect");
    });
});
