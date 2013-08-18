
var http = require('http'),
    fs = require('fs'),
	url = require('url'),
	Autocomplete = require('./autocomplete'),
	sys = require('sys');
 
/////////////////////////////////////////////////////////
 var queries = [
		["how to train your dragon" , 100],
		["how to get a tatkal train ticket" , 1000],
		["how to kiss" , 80],
		["how to loose wt" , 900],
		["how to program" , 20],
		["how can I use nodejs" , 10],
		["Do you know how to train your dragon" , 50],
		["what did you know " , 50],
		["whatsapp download " , 500],
		["what is my ip" , 400],
		["whatsapp" , 504],
		["what did you know " , 50],
		["what is the reason of " , 100],
		["where is the doc " , 500],
		["where's my wifi " , 501],
		["where can i get a signal " , 502],
		["where is grand canyon " , 503],
		["where's my water " , 504]

    ];

// Create the autocomplete object
var autocomplete = Autocomplete.connectAutocomplete();

// Initialize the autocomplete object and define a 
// callback to populate it with data
autocomplete.initialize(function(onReady) {
    onReady(queries);
});

/////////////////////////////////////////////////////////

//Handling Request Response
var app = http.createServer(function (request, response) {
	
	var path = url.parse(request.url).pathname;

		{
		console.log('HTML file request');
		fs.readFile("client.html", 'utf-8', function (error, data) {
         response.writeHead(200, {'Content-Type': 'text/html'});
         response.write(data);
         response.end();	
		});
	}
}).listen(1337);
 


var io = require('socket.io').listen(app);
io.sockets.on('connection', function(socket) {
   

	socket.on('message_to_server', function(data) {

	//Data is here in the form of data["message"]
	//console.log('message from client ' + data["message"]);
	var userQuery = data["message"];

	var matches = autocomplete.search(userQuery);
	
	//sorting the result based on the hit count, here the variable is [query, hitCount]
	// a[1] and b[1] are hitCounts 
	matches.sort(function(a,b){
		return b[1] - a[1];
	});

	//console.log("After sort values are :" + matches);
	//Getting the top 4 queries
	matches.splice(4);
   	socket.emit("message_to_client",{message: matches});

	});
        
});