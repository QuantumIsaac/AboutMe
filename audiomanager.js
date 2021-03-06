var clips = {};

function load_audio(name, src){
	var a = document.createElement('audio');
	a.src = src;
	a.addEventListener('timeupdate', update_time);
	clips[name] = a;
}

//Controls
var title = null;
var toggler = null;
var time_bar = null;

function InitControls(){
	title = document.getElementById("now-playing");
	toggler = document.getElementById("toggler");
	time_bar = document.getElementById("time-bar");
}

window.addEventListener('load', InitControls);

//Player
var playing = null;
var in_fader = null;
var out_fader = null;
var end_time = -1;
var start_time = -1;

function update_time(){
	console.log("time is " + playing.currentTime);
	time_bar.value = parseInt(((playing.currentTime - start_time) / ((end_time+5) - start_time)) * 100);
}

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
			if( out_fader != null ) clearTimeout(out_fader);
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
		toggler.innerText = "Pause";
		title.innerText = name;
		start_time = start;
		end_time = end;
		fade_in();
		out_fader = setTimeout(fade_out, (end-start)*1000);
	}
}

function stop(){
	playing.pause();
	playing = null;
}
function toggle(){
	if( !playing.paused ){
		clearTimeout(out_fader);
		playing.pause();
		toggler.innerText = "Play";
	}else{
		setTimeout(fade_out, parseInt(end_time - playing.currentTime)*1000);
		playing.play();
		toggler.innerText = "Pause";
	}
}
