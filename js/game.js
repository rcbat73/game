var timer={
 hour: "",
 min: "",
 sec: "",
 deci: "",
 init:function(id){
   this[id]={obj:document.getElementById(id)}
 },

 start:function(id){
  var obj=this[id];
  obj.srt=new Date();
  clearTimeout(obj.to);
  this.counting(id);
 },

 stop:function(id){
	clearTimeout(this[id].to);
 },

 counting:function(id){
	var obj=this[id];
	if((gameFactory.contSelObj == 2) & (gameFactory.container.childNodes.length == 2)){
		gameFactory.arrSelObj[0].parent.parentNode.removeChild(gameFactory.arrSelObj[0].parent);
		gameFactory.arrSelObj[1].parent.parentNode.removeChild(gameFactory.arrSelObj[1].parent);
		gameFactory.arrSelObj.length = 0;
		gameFactory.contSelObj = 0;
		this.stop(id);
		gameFactory.mindGame.innerHTML = "";
		var gameEnded = document.createElement("div");
		gameEnded.id = "end";
		gameEnded.style.width = gameFactory.mindGame.style.width;
		gameEnded.innerHTML = "<p>GAME OVER</p><a href='https://twitter.com/intent/tweet/?text=Memory JavaScript FTW em: " + obj.obj.innerHTML + "'>Share on Twitter</a>";		
		
		gameFactory.mindGame.appendChild(gameEnded);
		gameFactory.btn.value = "New Game";
		gameFactory.btn.style.display = "inline";
		gameFactory.btn.onclick = gameFactory.askForData;
	}
	else{
		this.stop(id);
		var obj=this[id];
		var time = new Date()-obj.srt;
		var mili = time / 1000;
		this.min = Math.floor(mili / 60) + "";
		this.hour = Math.floor(this.min / 60) + "";
		var strTime = mili % 60 + "";
		var arrTime = strTime.split(".");
		this.sec = arrTime[0];
		this.deci = arrTime[1] + "";
		this.deci = this.deci.substr(0,1);
		if(this.hour.length < 2){
			this.hour = "0" + this.hour;
		}
		if(this.min.length < 2){
			this.min = "0" + this.min;
		}
		if(this.sec.length < 2){
			this.sec = "0" + this.sec;
		}
		obj.obj.innerHTML = this.hour + ":" + this.min + ":" + this.sec + ":" + this.deci;
		obj.to=setTimeout(function(){ timer.counting(id); },100);
	}
	
 }
}

var gameFactory = {
	arrSelSrc: null,
	arrSelObj: [],
	contSelObj: 0,
	mindGame: null,
	container: null,
	btn: null,
	imgPos: "",
	rows: 3,
	cols: 6,
	numItems: 0,
	myJSON: null,
	arrPos: [],
	arrRandom: [],
	arrImgPos: {},
	checkStatus: function(theObj){
		return function(event){
			var obj; var pos;
			if (window.addEventListener) {
				obj = event.target;
			}
			else{
				obj = event.srcElement;
			}
			pos = obj.id.substr(6);
			if(event.type == "mouseout"){				
				if((theObj.contSelObj == 2) & (theObj.container.childNodes.length > 2)){
					if(theObj.arrSelObj[0].src == theObj.arrSelObj[1].src){
						theObj.arrSelObj[0].parent.parentNode.removeChild(theObj.arrSelObj[0].parent);
						theObj.arrSelObj[1].parent.parentNode.removeChild(theObj.arrSelObj[1].parent);
					}
					else{
						theObj.arrSelObj[0].obj.className = "badge";
						theObj.arrSelObj[1].obj.className = "badge";
					}
					theObj.arrSelObj.length = 0;
					theObj.contSelObj = 0;
				}
			}
			else if(event.type == "mouseup"){
				var img = document.getElementById("img" + pos);
				if((theObj.contSelObj < 2) & theObj.imgPos != pos){
					obj.className = "badge-change";
					var img = document.getElementById("img" + pos);
					var badge = document.getElementById("badge" + pos);		
					theObj.imgPos = pos;
					theObj.arrSelObj.push({"parent": badge, "obj": obj, "src": img.src});
					theObj.contSelObj++;
				}
						
			}
		};
	}, 
 
	askForData: function(){
		this.mindGame = document.getElementById('gameCtn');
		this.mindGame.style.width = 128 * this.cols;
		var gameEnded = document.createElement("div");
		gameEnded.id = "end";
		gameEnded.innerHTML = '<p>Loading badges...<p>';
		this.mindGame.appendChild(gameEnded);
		var scriptEle = document.createElement('script');
		scriptEle.id = "scriptData";
		scriptEle.src = 'https://services.sapo.pt/Codebits/listbadges?callback=gameFactory.getBadges';
		this.mindGame.appendChild(scriptEle);
	},
 
	getBadges: function (json) {
		if(json[0].img != null | json[0].img != ""){
			this.myJSON = json;
			this.mindGame.innerHTML = '';
			this.init();
			this.selBadge();
			this.createMatrix();
			this.btn.value = "Start Game";
			this.btn.onclick = this.startGame(this);
		}
	},

	init: function (){
		this.numItems = this.rows * this.cols;
		this.btn = document.getElementsByTagName("input")[0];
		this.arrPos.length = 0;
		this.arrSelObj.length = 0;
		this.contSelObj = 0;
		for(var pos = 0; pos < this.numItems; pos++){
			this.arrPos.push(pos);
			this.arrImgPos["img" + pos] = "";
		}
		posRan = 0;
		this.arrRandom.length = 0;
		while(posRan < 9){
			var item = this.getRandomVal(this.myJSON.length);
			if((this.arrRandom.length == 0) | (this.arrRandom.indexOf(item) == -1)){
				this.arrRandom.push(item);
				
				posRan++
			}
		}
		var obj = document.createElement('div');
		obj.id = "container";
		obj.style.position = "relative";
		obj.style.display = "none";
		this.container = obj;
		
	},

	getRandomVal: function(limit){
		return Math.floor(Math.random()* limit);
	},

	selBadge: function (){
		if(this.arrSelSrc != null){
			this.arrSelSrc.length = 0;	
		}
		else{
			this.arrSelSrc = [];
		}
		
		for(var jitem = 0;jitem < 9; jitem++){
			
			this.arrSelSrc.push(this.myJSON[this.arrRandom[jitem]]);
			
			
		}	
	},

	createMatrix: function(){
		this.container.innerHTML = "";
		for(var j = 0; j < 9; j++){
			var pos1 = this.getRandomVal(this.arrPos.length);
			this.arrImgPos["img" + this.arrPos[pos1]] = this.arrSelSrc[j].img;
			this.arrPos.splice(pos1, 1);
			var pos2 = this.getRandomVal(this.arrPos.length);
			this.arrImgPos["img" + this.arrPos[pos2]] = this.arrSelSrc[j].img;
			this.arrPos.splice(pos2, 1);		
		}
		for(var k = 0; k < this.numItems; k++){
			var imgCtn = document.createElement('div');
			imgCtn.id = "badge" + k;
			imgCtn.style.position = "absolute";
			var img = document.createElement('img');
			var costasImg = document.createElement("img");
			img.id = "img" + k;
			img.src = this.arrImgPos["img" + k];
			img.style.position = "absolute";
			img.style.left = "0px";
			
			costasImg.id = "costas" + k;
			costasImg.src = "images/costas.png";
			costasImg.style.position = "absolute";	
			costasImg.style.left = "0px";
			costasImg.className = "badge";
			
			imgCtn.appendChild(img);
			imgCtn.appendChild(costasImg);		
			this.container.appendChild(imgCtn);						
		}
		this.mindGame.appendChild(this.container);
		this.mindGame.style.backgroundColor = "white";
		this.mindGame.style.border = "3px solid green";
		for(var m = 0; m < this.rows; m++){
			for(var n = 0; n < this.cols; n++){
				var idx = n + m * this.cols;
				var badge = document.getElementById("badge" + idx);
				
				// Mozilla, Netscape, Firefox
				if (window.addEventListener) { 
					badge.onmouseout = this.checkStatus(this);
					badge.onmouseup = this.checkStatus(this);
				} 
				 // IE
				else {
					badge.setAttribute("onmouseout", "this.checkStatus(this);");
					badge.setAttribute("onmouseup", "this.checkStatus(this);");
				}
				badge.style.left = n * 128 + "";
				badge.style.top = m * 128 + "";
			}
		}
			
		
	},
	startGame: function(theObj){
		return function(){
			theObj.container.style.display = "inline";
			theObj.btn.style.display = "none";
			timer.init('counter');
			timer.start('counter');
		};
	},
}