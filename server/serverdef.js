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

function Player(id,pos,dir,vel) { 
	this.id = id;
	this.pos = pos;
	this.dir = dir;
	this.vel = vel;
}

function Bullet(id,player_id,pos,vel){
	this.id = id;
	this.player_id = player_id;
	this.pos = pos;
	this.vel = vel;
}	

function Walls(){
}