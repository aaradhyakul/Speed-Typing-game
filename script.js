const textArea = document.querySelector("#word-input");
const hiddenArea = document.querySelector('#hidden-input');
const accuracy = document.querySelector('#accuracy-count');
const wpm = document.querySelector("#speed-count");
const timeLeft = document.querySelector("#time-count");
const resetbtn = document.querySelector("#reset");

let charIndex = 0;
let correctChars = 0;
let wrongChars = 0;
let wordCount = 0;
let startTime;
let elapsedTime;
let option = window.localStorage.getItem("option") || 60;
let currentText = "";

timeLeft.innerText = option + "s";

const predefinedTexts = [
	"The quick brown fox jumps over the lazy dog while the sun sets in the distance.",
	"Programming is the art of telling another human what one wants the computer to do.",
	"Success is not final, failure is not fatal: it is the courage to continue that counts.",
	"In three words I can sum up everything I've learned about life: it goes on.",
	"The best way to predict the future is to create it yourself.",
	"Every great developer you know got there by solving problems they were unqualified to solve.",
	"Life is like riding a bicycle. To keep your balance, you must keep moving forward.",
	"Technology is best when it brings people together and helps solve real-world problems.",
	"The only way to do great work is to love what you do and never give up on your dreams.",
	"Debugging is twice as hard as writing the code in the first place.",
	"The internet is not just a technology, it's a way of life and communication.",
	"Innovation distinguishes between a leader and a follower in the modern world.",
	"The computer was born to solve problems that did not exist before its creation.",
	"Learning to code is learning to create and innovate in the digital age.",
	"The best error message is the one that never shows up during development.",
	"Sometimes the questions are complicated and the answers are simple.",
	"Good code is its own best documentation, making it easy to understand.",
	"The only limit to our realization of tomorrow will be our doubts of today.",
	"Every expert was once a beginner who never gave up on their journey.",
	"Simplicity is the ultimate sophistication in both life and coding."
];

function getRandomText() {
	return predefinedTexts[Math.floor(Math.random() * predefinedTexts.length)];
}

function initializeText() {
	textArea.innerHTML = "";
	currentText = getRandomText();
	currentText.split("").forEach(char => {
		const span = document.createElement('span');
		span.textContent = char;
		textArea.appendChild(span);
	});
	const chars = textArea.querySelectorAll("span");
	chars[0].classList.add("active");
}

function resetApp() {
	location.reload();
}

function startTimer() {
	startTime = Date.now();
	const timer = setInterval(() => {
		if (!startTime) return;

		elapsedTime = Math.floor((Date.now() - startTime) / 1000);
		const remainingTime = option - elapsedTime;

		if (remainingTime <= 0) {
			timeLeft.innerText = "0s";
			hiddenArea.disabled = true;
			clearInterval(timer);
			saveResults();
			return;
		}

		timeLeft.innerText = remainingTime + "s";
		updateStats();
	}, 1000);
}

function updateStats() {
	if (elapsedTime > 0) {
		const wordsPerMinute = Math.floor((wordCount * 60) / elapsedTime);
		wpm.innerText = wordsPerMinute;
		const accuracyValue = ((correctChars * 100) / (correctChars + wrongChars)) || 0;
		accuracy.innerText = accuracyValue.toFixed(1) + "%";
	}
}

function saveResults() {
	localStorage.setItem("wpm", wpm.innerText);
	localStorage.setItem("accuracy", accuracy.innerText);
	localStorage.setItem("option", option);
}

function handleTyping(e) {
	const chars = textArea.querySelectorAll("span");
	const typedChar = e.target.value;

	if (typedChar.length < charIndex) {
		charIndex = typedChar.length;
		chars.forEach(span => span.classList.remove("active"));
		if (charIndex < chars.length) {
			chars[charIndex].classList.add("active");
		}
		return;
	}

	const currentChar = chars[charIndex];
	const typedValue = typedChar[charIndex];

	if (currentChar && typedValue) {
		if (currentChar.textContent === typedValue) {
			currentChar.classList.add("correct");
			correctChars++;
		} else {
			currentChar.classList.add("incorrect");
			wrongChars++;
		}

		chars.forEach(span => span.classList.remove("active"));
		charIndex++;

		if (typedValue === " ") {
			wordCount++;
		}

		if (charIndex >= chars.length) {
			wordCount++;
			charIndex = 0;
			e.target.value = "";
			initializeText();
			return;
		}

		if (charIndex < chars.length) {
			chars[charIndex].classList.add("active");
		}
	}
}

function setOption(opt) {
	option = opt === 1 ? 60 : opt === 2 ? 30 : 15;
	localStorage.setItem("option", option);
	resetApp();
}

hiddenArea.addEventListener('input', handleTyping);
hiddenArea.addEventListener('focus', startTimer, { once: true });
resetbtn.addEventListener('click', resetApp);
document.addEventListener('keydown', () => hiddenArea.focus());
textArea.addEventListener('click', () => hiddenArea.focus());

initializeText();