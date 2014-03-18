var velSlider;
var raioSlider;
var checkEscalar;
var checkVetorial;
var r = 60;
var vel = 0;
var current = 0;
var divVel;
var divRaio;
var divAngle;
var divArc;
var conteudo;
var circle, circleImage;
var angle = 0;
var arch = 0;
var mcRaio;
var mcArco;
var personagem;
var personw = 80/4;
var personh = 218/4;
var vetorVel;

var rMin = 120;
var rMax = 200;
var m = 100/(rMax - rMin);

function init(){
	//var conteudo = $("#conteudo");
	divVel = $("#vel");
	divRaio = $("#raio");
	divAngle = $("#angle");
	divArc = $("#arc");
	checkEscalar = $("#esc");
	checkVetorial = $("#vet");
	checkEscalar.attr('checked', true);
	checkVetorial.attr('checked', true);

	conteudo = Raphael("conteudo");
	circleImage = conteudo.image("img/background.jpg", 300 - r, 240 - r, 2 * r, 2 * r).attr("opacity", "0.8");
	personagem = conteudo.image("img/person.png", 300 + r, 240, personw, personh);
	//circle = conteudo.circle(300, 240, r);
	mcArco = conteudo.path("M0,0").attr("stroke-width", "5");
	mcRaio = conteudo.path("M0,0").attr({"fill": "#0000FF", 'fill-opacity': 0.5});
	vetorVel = conteudo.path("M0,0").attr({"stroke-width": "3", "stroke": "#00FF00", fill:"#00FF00"});

	velSlider = new Dragdealer('velSlider', {slide:false, steps:101, snap:true, x:0.5, animationCallback: velMoving});
	raioSlider = new Dragdealer('raioSlider', {slide:false, horizontal:false, vertical:true, steps:101, snap:true, y:0.5, animationCallback: raioMoving});

	checkEscalar.on("click", escClick);
	checkVetorial.on("click", vetClick);

	
	//drawCircle();
	requestAnimationFrame(update);
}

function drawCircle(){
	var raio = getR();
	circleImage.attr({x: 300 - raio, y: 240 - raio, width: 2 * raio, height: 2 * raio});
	//circle.attr("r", raio);
	circleImage.transform("r" + angle);
}

function updatePerson(){7
	var raio = getR();
	personagem.attr({
		x: 300 + (raio * Math.cos(angle * Math.PI/180)) - personw/2,
		y: 240 + (raio * Math.sin(angle * Math.PI/180)) - personh/2,
	})
}

function updateVetorVel(){
	if(checkVetorial.is(':checked')){
		if(Number(vel) == 0) vetorVel.hide();
		else vetorVel.show();
	}else{
		vetorVel.hide();
	}
	
	var raio = getR() + 5;
	var posX = 300 + (raio * Math.cos(angle * Math.PI/180));
	var posY = 240 + (raio * Math.sin(angle * Math.PI/180));
	vetorVel.attr("path", "M" + (posX) + "," + posY + "L" + (posX) + "," + (posY + Number(vel) * 2) + "L" + (posX - 5) + "," + (posY + Number(vel) * 2) + "L" + posX + "," + (posY + Number(vel) * 2 + (Number(vel) < 0 ? -8 : 8)) + "L" + (posX + 5) + "," + (posY + Number(vel) * 2) + "L" + (posX) + "," + (posY + Number(vel) * 2));
	vetorVel.transform(["R", angle, posX ,posY]);
}

function getR(){
	return (r - 10)/m + rMin;
}

function escClick(e){
	if(checkEscalar.is(':checked')){
		mcArco.show();
		mcRaio.show();
	}else{
		mcArco.hide();
		mcRaio.hide();
	}
}

function vetClick(e){
	if(checkVetorial.is(':checked')){
		personagem.show();
	}else{
		personagem.hide();
	}
}


function velMoving(x, y){
	var newVel = (((Number(x.toFixed(2)) - 0.5) * Math.PI/2) * 180/Math.PI).toFixed(0);

	vel = newVel;
	divVel.html("Velocidade: " + newVel);
	//update(2000);
}

function raioMoving(x, y){
	var newRaio = ((y * 100) + 10).toFixed(0);

	r = newRaio;
	divRaio.html("Raio: " + newRaio);
	//update();
}

function getTheta(t){
	return vel * t;
}

function getArch(theta){
	return r * theta * Math.PI/360;
}

function update(timestamp){
	//Tempo passado desdo a últim chamada
	var dt = (timestamp - current)/1000;
	current = timestamp;
	//Angulo 
	var deltaAngle = getTheta(dt);
	angle += deltaAngle;
	angle = angle%360;
	if(angle < 0) angle += 360;
	divAngle.html("Ângulo: " + angle.toFixed(1) + "º");

	arch = getArch(angle);
	divArc.html("Arco: " + arch.toFixed(1));


	updatePerson();
	updateVetorVel();
	drawCircle();
	if(angle > 0){
		var paths = getPaths();
		mcRaio.attr("path", paths.raio);
		mcArco.attr("path", paths.arco)
	}


	//if(timestamp < 2000)
		requestAnimationFrame(update);
}

function getPaths(){
	var caminhos = {};
	var cte = Math.PI/180;
	var cx = 300;
	var cy = 240;
	var rAngle = 60;
	var rTotal = getR() + 3;
	var ptFinal = {x:rAngle * Math.cos(angle * cte), y:rAngle * Math.sin(angle * cte)};
	var raioPath = "M" + (ptFinal.x + cx) + "," + (ptFinal.y + cy) + "L" + cx + "," + cy + "L" + (cx + rAngle) + "," + cy;
	var arcoPath = "M" + (cx + rTotal) + "," + cy;

	for (var i = 0; i <= angle; i+=1) {
		var ang = i;

		var rx = rAngle * Math.cos(ang * cte);
		var ry = rAngle * Math.sin(ang * cte);
		raioPath += "L" + (rx + cx) + "," + (ry + cy);

		var rtx = rTotal * Math.cos(ang * cte);
		var rty = rTotal * Math.sin(ang * cte);
		arcoPath += "L" + (rtx + cx) + "," + (rty + cy);
	};

	raioPath += "L" + (ptFinal.x + cx) + "," + (ptFinal.y + cy);

	caminhos.raio = raioPath;
	caminhos.arco = arcoPath;

	return caminhos;
}

function distance(x1, y1, x2, y2){
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
