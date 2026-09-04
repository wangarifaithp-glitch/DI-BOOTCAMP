const pads = document.querySelectorAll(".pad");
const tempo = document.querySelector("#tempo");
const tempoValue = document.querySelector("#tempoValue");
const statusText = document.querySelector("#statusText");
const clearButton = document.querySelector("#clearButton");
const themeButtons = document.querySelectorAll(".theme-button");

let audioContext;

function getAudioContext() {
	if (!audioContext) {
		const AudioCtor = window.AudioContext || window.webkitAudioContext;
		audioContext = new AudioCtor();
	}
	if (audioContext.state === "suspended") {
		audioContext.resume();
	}
	return audioContext;
}

function noiseBuffer(context) {
	const buffer = context.createBuffer(1, context.sampleRate * 1.2, context.sampleRate);
	const data = buffer.getChannelData(0);
	for (let index = 0; index < data.length; index += 1) {
		data[index] = Math.random() * 2 - 1;
	}
	return buffer;
}

function playDrum(sound) {
	const context = getAudioContext();
	const now = context.currentTime;
	const output = context.createGain();
	output.gain.setValueAtTime(0.0001, now);
	output.gain.exponentialRampToValueAtTime(0.8, now + 0.006);
	output.connect(context.destination);

	if (sound === "kick" || sound === "tom") {
		const oscillator = context.createOscillator();
		oscillator.type = sound === "kick" ? "sine" : "triangle";
		oscillator.frequency.setValueAtTime(sound === "kick" ? 145 : 190, now);
		oscillator.frequency.exponentialRampToValueAtTime(sound === "kick" ? 42 : 90, now + 0.22);
		output.gain.exponentialRampToValueAtTime(0.0001, now + (sound === "kick" ? 0.45 : 0.3));
		oscillator.connect(output);
		oscillator.start(now);
		oscillator.stop(now + 0.5);
	} else {
		const source = context.createBufferSource();
		const filter = context.createBiquadFilter();
		source.buffer = noiseBuffer(context);
		filter.type = sound === "snare" || sound === "clap" ? "bandpass" : "highpass";
		filter.frequency.value = sound === "rim" ? 1800 : sound === "ride" ? 5000 : 7000;
		output.gain.exponentialRampToValueAtTime(0.0001, now + (sound === "openHat" ? 0.55 : 0.16));
		source.connect(filter);
		filter.connect(output);
		source.start(now);
		source.stop(now + 0.6);
	}
}

function hitPad(pad) {
	playDrum(pad.dataset.sound);
	pad.classList.remove("is-playing");
	void pad.offsetWidth;
	pad.classList.add("is-playing");
	statusText.textContent = `${pad.querySelector(".pad-name").textContent} hit`;
	window.setTimeout(() => pad.classList.remove("is-playing"), 180);
}

pads.forEach((pad) => {
	pad.addEventListener("click", () => hitPad(pad));
	pad.setAttribute("aria-label", `${pad.querySelector(".pad-name").textContent} drum pad`);
});

window.addEventListener("keydown", (event) => {
	if (event.repeat) return;
	const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
	const pad = [...pads].find((item) => item.dataset.key === key);
	if (pad) {
		event.preventDefault();
		hitPad(pad);
	}
});

tempo.addEventListener("input", () => {
	tempoValue.textContent = tempo.value;
	statusText.textContent = `Tempo set to ${tempo.value} BPM`;
});

clearButton.addEventListener("click", () => {
	pads.forEach((pad) => pad.classList.remove("is-playing"));
	statusText.textContent = "Ready to play";
});

themeButtons.forEach((button) => {
	button.addEventListener("click", () => {
		document.body.classList.toggle("crystal", button.dataset.theme === "crystal");
		themeButtons.forEach((item) => item.classList.toggle("active", item === button));
		statusText.textContent = `${button.textContent} theme selected`;
	});
});

tempoValue.textContent = tempo.value;
