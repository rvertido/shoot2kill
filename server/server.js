//Objects
var fs = require('fs');
var vm = require('vm');
var includeInThisContext = function(path) {
    var code = fs.readFileSync(path);
    vm.runInThisContext(code, path);
}.bind(this);
includeInThisContext("./chatserver.js");
<<<<<<< HEAD
includeInThisContext("../client/vector.js");
includeInThisContext("./serverdef.js");
=======

function Pos(x,y) {
	this.x = x;
	this.y = y;
}

function Dir(dir_x,dir_y) {
	this.x = dir_x;
	this.y = dir_y;
}
function Vel(vel_x,vel_y) {
	this.x = vel_x;
	this.y = vel_y;
}

function Player(id,pos,dir,vel, name) { 
	this.id = id;
	this.pos = pos;
	this.dir = dir;
	this.vel = vel;
	this.name = name;
}

function Bullet(id,player_id,pos,vel){
	this.id = id;
	this.player_id = player_id;
	this.pos = pos;
	this.vel = vel;
}	

function Walls(){
}

function cons_point(x,y) {
	return {"x":x,"y":y};
}

function point_distance(a,b) {
	return Math.sqrt(Math.pow(a.x-b.x,2)+Math.pow(a.y-b.y,2));
}

function rotate_by(pt,theta) {
	var len = point_distance(pt,cons_point(0,0));
	var curtheta = Math.atan2(pt.y,pt.x);
	curtheta += theta;
	var rtp = cons_point(Math.cos(curtheta),Math.sin(curtheta));
	return rtp;
}		
>>>>>>> 02be0267fa13221b428f17ef4b90b5d67f9095f5

var _all_players = [];
var _all_bullets = [];
var _bullet_id = 0;

//id for players, starts at 0, increment by 1 per player
var _player_id_set = 0;

// Start server -- Shiny code WOOO
//var stdin = process.openStdin();    
var io = require('socket.io').listen(1500);
io.set('log level', 1);

_all_players.push(new Player(0,new Pos(150,150),new Dir(1,0),new Vel(0,0)));

io.sockets.on('connection', function(socket) {
	
	socket.on('chat_enter',chat_enter);

	io.sockets.emit('connect', gen_output());
	
	//give the player an id and add a new player object when an id is requested
	socket.on('player_request_id', function(data, callback) { 
		_all_players.push(new Player(_player_id_set, new Pos(0,0), new Dir(0,0), new Vel(0,0), data.name));
		callback(_player_id_set);
		_player_id_set++;
	});
	
	socket.on('fire', function(data) {
		var tarplayer = find_player(data.id);
		if (tarplayer) {	
			var vec = new $V([tarplayer.dir.x, tarplayer.dir.y, 0]);
			vec.normalizem();
			vec.scalem(14);
	
			var bullet_pos = new Pos(tarplayer.pos.x+vec.x(), tarplayer.pos.y+vec.y());
			
			vec.normalizem();
			vec.scalem(9);
			var bullet_vel = new Vel(vec.x(), vec.y());
			
			var newbullet = new Bullet(_bullet_id, data.id, bullet_pos, bullet_vel);
			newbullet.ct = 50;
			_all_bullets.push(newbullet);
			_bullet_id++;
		}
	});

	var update_game = setInterval(function (){
		io.sockets.emit('server_push', gen_output());
		io.sockets.emit('chat_push', chat_output());
	}, 50)
	
	setInterval(function() {
		game_update();
	},50);
	
	socket.on("turn",function(data) {
		var tarplayer = find_player(data.id);
		if (tarplayer) tarplayer.dir = rotate_by(tarplayer.dir,data.theta);
	});
	
	socket.on("move",function(data) {
		var tarplayer = find_player(data.id);
		if (tarplayer) tarplayer.vel = data.dirv;
	});
	
});

function find_player(id) {
	var tarplayer = null;
	_all_players.forEach(function(i) {
		if (i.id == id) {
			tarplayer = i;
		}
	});
	return tarplayer;
}

function gen_output() {
	return {players: _all_players, bullets: _all_bullets, walls:[]};
}

function game_update(){
	for (var i = 0; i < _all_players.length; i++) {
		var curr_player = _all_players[i];
		curr_player.pos.x += curr_player.vel.x;
		curr_player.pos.y += curr_player.vel.y;
		
		curr_player.vel.x*=0.5;
		curr_player.vel.y*=0.5;
	}
	
	for (var i = 0; i < _all_bullets.length; i++){
		var curr_bullet = _all_bullets[i];
		curr_bullet.pos.x += curr_bullet.vel.x;
		curr_bullet.pos.y += curr_bullet.vel.y;
		curr_bullet.ct--;
		if (curr_bullet.ct <= 0) {
			//_all_bullets.remove(curr_bullet);
		}
	}
}
