var clips = {};

function load_audio(name, src){
	var a = document.createElement('audio');
	a.src = src;
	clips[name] = a;
}

//Player
var playing = null;
var in_fader = null;
var out_fader = null;

function fade_in(){
	if( playing == null ) return;
	playing.volume = Math.min(1, playing.volume + .01);
	if( playing.volume < 1 ){
		in_fader = setTimeout(fade_in, 50);
	}else{
		in_fader = null;
	}
}

function fade_out(){
	if( playing == null ) return;
	playing.volume = Math.max(0, playing.volume - .01);
	if( playing.volume > 0 ){
		out_fader = setTimeout(fade_out, 50);
	}else{
		out_fader = null;
	}
}

function play(name, start, end){
	var a = clips[name];
	if( a != null ){
		if( playing != null ){
			stop();
		}
		if( in_fader != null ){
			clearTimeout(in_fader);
			in_fader = null;
		}
		a.currentTime = start;
		a.volume = 0;
		a.play();
		playing = a;
		fade_in();
		setTimeout(fade_out, (end-start)*1000);
	}
}

function stop(){
	playing.pause();
	playing = null;
}
