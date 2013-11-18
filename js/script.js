(function(root){
	$$ = function(e){
		if(typeof e === 'string'){
			e = document.getElementById(e.substring(1));
		}
		e.addClass = function(c){
			((this.className && (this.className += " "+c)) || (this.className = c));
			return this;
		};
		e.removeClass = function(c){
			this.className = this.className.replace(c,"");
			return this;
		};
		e.hasClass = function(c){
			return this.className.indexOf(c) != -1;
		};
		e.css = function(a,v){
			this.style[a] = v;
			return this;
		};
		e.html = function(html){
			if(html){
				this.innerHTML = html;
				return this;
			}
			else{
				return this.innerHTML;
			}
		};
		e.hasClass = function(c){
			return (" " + this.className + " ").replace(/[\n\t]/g, " ").indexOf(" " + c + " ") > -1;
		};
		return e;
	};
	
	
	var name1,
		name2,
		turn = true,
		x,
		y,
		clicked = false,
		val,
		cache,
		twoplayers = false,
		score1 = 0,
		score2 = 0;
	
	var addClass = function(e,c){
		if(e.className)
			e.className += " "+c;
		else
			e.className = c;
	};
	
	var getTDByCoordinate = function(i,j){
		return document.getElementById(i+'-'+j);
	};
	
	var computeScore = function(operator, prey){
		if($$(operator).hasClass('plus')){
			return parseInt(parseInt(val) + parseInt(prey.innerHTML));
		}
		if($$(operator).hasClass('minus')){
			return parseInt(parseInt(val) - parseInt(prey.innerHTML));
		}
		if($$(operator).hasClass('divide')){
			if(parseInt(prey.innerHTML) == 0) return 0;
			return parseInt(parseInt(val) / parseInt(prey.innerHTML));
		}
		if($$(operator).hasClass('times')){
			return parseInt(parseInt(val) * parseInt(prey.innerHTML));
		}
	};
	
	var revertValue = function(ha){
		cache = ha || cache;
		if($$(cache).hasClass('plus')){
			$$(cache).html('+');
		}
		else if($$(cache).hasClass('minus')){
			$$(cache).html('&minus;');
		}
		else if($$(cache).hasClass('divide')){
			$$(cache).html('&divide;');
		}
		else if($$(cache).hasClass('times')){
			$$(cache).html('&times;');
		}
		else{
			$$(cache).html('');
		}
		$$(cache).css('background', "#19AAD9").removeClass('green-chip').removeClass('yellow-chip');
	};
	
	var newBoard = function(){
		var n1 = document.getElementById('player1-name'),
			n2 = document.getElementById('player2-name');
		n1.innerHTML = (name1 || "Player1")+" | ---";
		n2.innerHTML = (name2 || "Player2")+" | ---";	
		$$(document.body).css('background','#92FA37');
		var h = window.innerHeight,
			w = window.innerWidth;
		if(w < h){
			n1.style.top = 0;
			n1.style.left = ((w/2) - (n1.offsetWidth/2))+"px";
			n2.style.left = ((w/2) - (n2.offsetWidth/2))+"px";
			n2.style.bottom = 0;
		}else{
			n2.style.right = n2.style.top = n1.style.left = n1.style.top = 0;
		}
		
		getTDByCoordinate(0,0).innerHTML = 2;
		getTDByCoordinate(0,2).innerHTML = 5;
		getTDByCoordinate(0,4).innerHTML = 8;
		getTDByCoordinate(0,6).innerHTML = 11;
		getTDByCoordinate(1,1).innerHTML = 7;
		getTDByCoordinate(1,3).innerHTML = 10;
		getTDByCoordinate(1,5).innerHTML = 3;
		getTDByCoordinate(1,7).innerHTML = 0;
		getTDByCoordinate(2,0).innerHTML = 4;
		getTDByCoordinate(2,2).innerHTML = 1;
		getTDByCoordinate(2,4).innerHTML = 6;
		getTDByCoordinate(2,6).innerHTML = 9;
		
		addClass(getTDByCoordinate(0,0),"yellow-chip");
		addClass(getTDByCoordinate(0,2),"yellow-chip");
		addClass(getTDByCoordinate(0,4),"yellow-chip");
		addClass(getTDByCoordinate(0,6),"yellow-chip");
		addClass(getTDByCoordinate(1,1),"yellow-chip");
		addClass(getTDByCoordinate(1,3),"yellow-chip");
		addClass(getTDByCoordinate(1,5),"yellow-chip");
		addClass(getTDByCoordinate(1,7),"yellow-chip");
		addClass(getTDByCoordinate(2,0),"yellow-chip");
		addClass(getTDByCoordinate(2,2),"yellow-chip");
		addClass(getTDByCoordinate(2,4),"yellow-chip");
		addClass(getTDByCoordinate(2,6),"yellow-chip");
		
		getTDByCoordinate(5,1).innerHTML = 9; 
		getTDByCoordinate(5,3).innerHTML = 6;
		getTDByCoordinate(5,5).innerHTML = 1;
		getTDByCoordinate(5,7).innerHTML = 4;
		getTDByCoordinate(6,0).innerHTML = 0;
		getTDByCoordinate(6,2).innerHTML = 3;
		getTDByCoordinate(6,4).innerHTML = 10;
		getTDByCoordinate(6,6).innerHTML = 7;
		getTDByCoordinate(7,1).innerHTML = 11;
		getTDByCoordinate(7,3).innerHTML = 8;
		getTDByCoordinate(7,5).innerHTML = 5;
		getTDByCoordinate(7,7).innerHTML = 2;
		
		addClass(getTDByCoordinate(5,1),"green-chip");
		addClass(getTDByCoordinate(5,3),"green-chip");
		addClass(getTDByCoordinate(5,5),"green-chip");
		addClass(getTDByCoordinate(5,7),"green-chip");
		addClass(getTDByCoordinate(6,0),"green-chip");
		addClass(getTDByCoordinate(6,2),"green-chip");
		addClass(getTDByCoordinate(6,4),"green-chip");
		addClass(getTDByCoordinate(6,6),"green-chip");
		addClass(getTDByCoordinate(7,1),"green-chip");
		addClass(getTDByCoordinate(7,3),"green-chip");
		addClass(getTDByCoordinate(7,5),"green-chip");
		addClass(getTDByCoordinate(7,7),"green-chip");
		
		
		var boxes = document.querySelectorAll('#board td');
		for(var a in boxes){
			if(boxes.hasOwnProperty(a)){
				boxes[a].onclick = function(e){
					var box = e.originalTarget,
						xx = box.id.split('-')[0],
						yy = box.id.split('-')[1];
					if(!clicked && turn && ( (" " + box.className + " ").replace(/[\n\t]/g, " ").indexOf(" green-chip ") > -1 )){
						box.style.background = "#104D61";
						box.style.className += " clicked";
						x = box.id.split('-')[0];
						y = box.id.split('-')[1];
						val = box.innerHTML;
						clicked = true;
						cache = box;
					}
					else if(clicked && parseInt(xx) == parseInt(x) && parseInt(yy) == parseInt(y)){
						box.style.background = "#19AAD9";
						clicked = false;
					}
					else if(turn && !( (" " + box.className + " ").replace(/[\n\t]/g, " ").indexOf(" yellow-chip ") > -1)){
						if(parseInt(xx)+1 == parseInt(x) && ((parseInt(yy)-1 == parseInt(y))  || (parseInt(yy)+1 == parseInt(y)))){
							box.innerHTML = val;
							$$(box).addClass('green-chip');
							$$(cache).removeClass('green-chip');
							$$(cache).removeClass('green-chip');
							revertValue();
							turn = false;
							clicked = false;
							$$(document.body).css('background','#FCCA0A');
						}
						else if(parseInt(xx)+2 == parseInt(x) && (parseInt(yy)-2 == parseInt(y))){
							var hanz = getTDByCoordinate(parseInt(xx)+1, parseInt(y)+1);
							if($$(hanz).hasClass('yellow-chip')){
								score1 += computeScore(box, hanz);
								$$(hanz).removeClass('yellow-chip');
								$$(box).html($$(cache).html()).addClass('green-chip');
								revertValue();
								revertValue(hanz);
								turn = false;
								clicked = false;
								$$(document.body).css('background','#FCCA0A');
								$$('#player1-name').html(name1 + " | " + score1);
							}
						}
						else if(parseInt(xx)+2 == parseInt(x) && (parseInt(yy)+2 == parseInt(y))){
							var hanz = getTDByCoordinate(parseInt(xx)+1, parseInt(y)-1);
							if($$(hanz).hasClass('yellow-chip')){
								score1 += computeScore(box, hanz);
								$$(hanz).removeClass('yellow-chip');
								$$(box).html($$(cache).html()).addClass('green-chip');
								revertValue();
								revertValue(hanz);
								turn = false;
								clicked = false;
								$$(document.body).css('background','#FCCA0A');
								$$('#player1-name').html(name1 + " | " + score1);
							}
						}
					}
					
					if(twoplayers){
						if(!clicked && !turn && ( (" " + box.className + " ").replace(/[\n\t]/g, " ").indexOf(" yellow-chip ") > -1 )){
							box.style.background = "#104D61";
							box.style.className += " clicked";
							x = box.id.split('-')[0];
							y = box.id.split('-')[1];
							val = box.innerHTML;
							clicked = true;
							cache = box;
						}
						else if(!turn){
							var xx = box.id.split('-')[0],
								yy = box.id.split('-')[1];
							if(parseInt(xx)-1 == parseInt(x) && ((parseInt(yy)-1 == parseInt(y))  || (parseInt(yy)+1 == parseInt(y)))){
								box.innerHTML = val;
								$$(box).addClass('yellow-chip');
								$$(cache).removeClass('yellow-chip');
								$$(cache).removeClass('yellow-chip');
								revertValue();
								turn = true;
								clicked = false;
								$$(document.body).css('background','#92FA37');
							}
							else if(parseInt(xx)-2 == parseInt(x) && (parseInt(yy)-2 == parseInt(y))){
								var hanz = getTDByCoordinate(parseInt(xx)-1, parseInt(y)+1);
								if($$(hanz).hasClass('green-chip')){
									score2 += computeScore(box, hanz);
									$$(hanz).removeClass('green-chip');
									$$(box).html($$(cache).html()).addClass('yellow-chip');
									revertValue();
									revertValue(hanz);
									turn = true;
									clicked = false;
									$$(document.body).css('background','#92FA37');
									$$('#player2-name').html(name2 + " | " + score2);
								}
							}
							else if(parseInt(xx)-2 == parseInt(x) && (parseInt(yy)+2 == parseInt(y))){
								var hanz = getTDByCoordinate(parseInt(xx)-1, parseInt(y)-1);
								if($$(hanz).hasClass('green-chip')){
									score2 += computeScore(box, hanz);
									$$(hanz).removeClass('green-chip');
									$$(box).html($$(cache).html()).addClass('yellow-chip');
									revertValue();
									revertValue(hanz);
									turn = true;
									clicked = false;
									$$(document.body).css('background','#92FA37');
									$$('#player2-name').html(name2 + " | " + score2);
								}
							}
						}
					}else
					{
						// AI!;
					}
				};
			}
		}
		
		window.onresize();
	};
	
	
	var bindTransitions = function(){
		// document.getElementById('btn-sp').addEventListener ('click', function () {
			// document.getElementById('single-player').className = 'current';
			// document.querySelector('[data-position="current"]').className = 'left';
		// });
		// document.getElementById('btn-sp-back').addEventListener ('click', function () {
			// document.getElementById('single-player').className = 'right';
			// document.querySelector('[data-position="current"]').className = 'current';
		// });
		document.getElementById('btn-2p').addEventListener ('click', function () {
			document.getElementById('two-player').className = 'current';
			document.querySelector('[data-position="current"]').className = 'left';
		});
		document.getElementById('btn-htp').addEventListener ('click', function () {
			document.getElementById('how-to-play').className = 'current';
			document.querySelector('[data-position="current"]').className = 'left';
		});
		document.getElementById('btn-2p1-back').addEventListener ('click', function () {
			document.getElementById('two-player').className = 'right';
			document.querySelector('[data-position="current"]').className = 'current';
		});
		document.getElementById('btn-2p1-cont').addEventListener ('click', function () {
			document.getElementById('two-player-two').className = 'current';
			document.getElementById('two-player').className = 'left';
		});
		document.getElementById('btn-2p2-back').addEventListener ('click', function () {
			document.getElementById('two-player-two').className = 'right';
			document.getElementById('two-player').className = 'current';
		});
		document.getElementById('btn-htp-back').addEventListener ('click', function () {
			document.getElementById('how-to-play').className = 'right';
			document.querySelector('[data-position="current"]').className = 'current';
		});
		document.getElementById('btn-start-single').addEventListener ('click', function () {
			name1  = document.getElementById('player-name').value;
			document.getElementById('single-player').className = 'left';
			document.getElementById('board-game').className = 'current';
			newBoard();
		});
		document.getElementById('btn-start-double').addEventListener ('click', function () {
			name1  = document.getElementById('2player-name1').value;
			name2  = document.getElementById('2player-name2').value;
			document.getElementById('two-player-two').className = 'left';
			document.getElementById('board-game').className = 'current';
			twoplayers = true;
			newBoard();
		});
		document.getElementById('btn-pause').addEventListener ('click', function () {
			$$(document.body).css('background','#104D61');
			document.getElementById('board-game').className = 'left';
			document.getElementById('pause-menu').className = 'current';
		});
		document.getElementById('btn-backtomenu').addEventListener ('click', function () {
			$$(document.body).css('background','#19AAD9');
			document.getElementById('pause-menu').className = 'left';
			document.querySelector('[data-position="current"]').className = 'current';
		});
		document.getElementById('btn-reset').addEventListener ('click', function () {
			document.getElementById('pause-menu').className = 'left';
			document.getElementById('board-game').className = 'current';
			newBoard();
		});
	};


	window.onresize = function(){
		var h = window.innerHeight,
			w = window.innerWidth,
			table = document.getElementById('board');
		if(h > w){
			table.style.width = w+'px';
			table.style.height = w+'px';
			table.style.top = ((h/2)-(w/2))+'px';
		}else{
			table.style.left = ((w/2)-(h/2))+'px';
			table.style.width = h+'px';
			table.style.height = h+'px';
		}
	};
	
	bindTransitions();
	window.onresize();
	
})(this);
