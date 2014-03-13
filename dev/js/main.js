
var velSlider;
var raioSlider;
var checkEscalar;
var checkVetorial;
var r = 50;
var vel = 0;
var t;
var divVel;
var divRaio;


function init(){
	var conteudo = $("#conteudo");
	divVel = $("#vel");
	divRaio = $("#raio");
	checkEscalar = $("#esc");
	checkVetorial = $("#vet");

	velSlider = new Dragdealer('velSlider', {slide:false, steps:101, snap:true, x:0.5, animationCallback: velMoving});
	raioSlider = new Dragdealer('raioSlider', {slide:false, horizontal:false, vertical:true, steps:101, snap:true, y:0.5, animationCallback: raioMoving});

	checkEscalar.on("click", escClick);
	checkVetorial.on("click", vetClick);
}

function escClick(e){

}

function vetClick(e){

}


function velMoving(x, y){
	var newVel = (((Number(x.toFixed(2)) - 0.5) * Math.PI/2) * 180/Math.PI).toFixed(0);

	vel = newVel;
	divVel.html("Velocidade: " + newVel);
}

function raioMoving(x, y){
	var newRaio = ((y * 100) + 10).toFixed(0);

	r = newRaio;
	divRaio.html("Raio: " + newRaio);
}

function getTheta(){
	return vel * t;
}

function getArch(){
	return r * getTheta();
}

function update(){
	var angle = getTheta();
	var arch = getArch();

	//Posiciona o personagem

	//Rotaciona o personagem

	//Desenhar o angulo

	//Desenhar o arco

	//Atualiza o tempo
}

function convertPathToArray(path){
	return Raphael.parsePathString(path);
}

function distance(x1, y1, x2, y2){
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function getRpath(){
	var arrCaminhos = [];
	var posPtF = raphs[tgId].ptF;
	var posPt = raphs[tgId].pt;


	var caminho = "M" + cx + "," + cy;
	caminho += "L" + posPt.x + "," + posPt.y;
	arrCaminhos.push(caminho);

	var caminho2 = "M" + cx + "," + cy;
	caminho2 += "L" + posPtF.x + "," + posPtF.y;
	arrCaminhos.push(caminho2);

	var caminho3 = "M" + cx + "," + cy;

	var raio = 50;

	var anguloInicial = Math.atan2(posPtF.y - cy,posPtF.x - cx);
	var anguloFinal = Math.atan2(posPt.y - cy,posPt.x - cx);
	

	//if(anguloInicial < 0) anguloInicial += 2 * Math.PI;
	//if(anguloFinal < 0) anguloFinal += 2 * Math.PI;

	anguloInicial *= 180/Math.PI;
	anguloFinal *= 180/Math.PI;

	var max;
	var min;

	if(anguloInicial > 0){
		min = anguloInicial - 180;
		if(anguloFinal < min){
			anguloFinal = 180 + (180 + anguloFinal);
		}
	}else{
		max = anguloInicial + 180;
		if(anguloFinal > max){
			anguloFinal = -179.99 - (180 - anguloFinal);
		}
	}

	//var passo = anguloFinal > anguloInicial ? (anguloFinal - anguloInicial)/100 : (anguloInicial - anguloFinal)/100;
	var passo = 1// * (anguloFinal > anguloInicial ? 1 : -1);//(anguloFinal - anguloInicial)/100;
	//console.log(anguloFinal - anguloInicial);
	$("#distAngle").html(((anguloFinal - anguloInicial) * -1).toFixed(1) + "º");

	if(anguloFinal < anguloInicial){
		var aux = anguloFinal;
		anguloFinal = anguloInicial;
		anguloInicial = aux;
	}

	var count = 0;

	
	for (var i = anguloInicial; i < anguloFinal; i+=passo) {
		var ang = i * Math.PI/180;

		//if(ang > Math.PI) ang -= 2 * Math.PI;
		var rx = raio * Math.cos(ang);
		var ry = raio * Math.sin(ang);
		caminho3 += "L" + (rx + cx) + "," + (ry + cy);

		count++;
		if(count > 180) break;
	};

	caminho3 += "z";

	arrCaminhos.push(caminho3);

	return arrCaminhos;

}