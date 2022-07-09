const randomTextUrl = 'http://api.quotable.io/random'
const textArea = document.querySelector("#word-input")
const hiddenArea = document.querySelector('#hidden-input')
const accuracy = document.querySelector('#accuracy-count')
let charIndex = 0
let correctCount = 0
let incorrectCount = 0
let wordCount = 0
let wordIndex = 0
let textWords = []
let cumulativeWordCount = 0
let startTime
let elapsedTime
let option = window.localStorage.getItem("option")
let timeLeft = document.querySelector("#time-count")
timeLeft.innerText = option + "s"

let correctChars = 0
let wrongChars = 0
let i = 0



const resetbtn = document.querySelector("#reset")

const wpm = document.querySelector("#speed-count")

function fetchRandomText() {
    return fetch(randomTextUrl).then(response => response.json()).then(data => data.content)
}

async function getNextText() {
    const Text = await fetchRandomText()
    Text.split("").forEach(char => {
        let charTag = `<span>${char}</span>`
        textArea.innerHTML += charTag;
    })

    textWords = []
    Text.split(" ").forEach(word => textWords.push(word))

    document.addEventListener('keydown', () => hiddenArea.focus())
    textArea.addEventListener('click', () => hiddenArea.focus())

}

hiddenArea.addEventListener('input', typingStarted)
hiddenArea.addEventListener('input', timerStart, { once: true })
hiddenArea.addEventListener('input', timeElapsed, { once: true })
hiddenArea.addEventListener('input', displayWords, { once: true })
hiddenArea.addEventListener('input', displayResult, { once: true })

function countWords() {
    let hiddenWords = hiddenArea.value.split(" ")
    wordCount = cumulativeWordCount
    for (let i = 0; i < hiddenWords.length; i++) {
        if (hiddenWords[i] === textWords[i]) {
            wordCount++
            // console.log(wordCount)

        }
    }
}
function timerStart() {
    startTime = performance.now()


}

resetbtn.addEventListener('click', () => resetApp())

function resetApp() {
    document.location.reload()

}

// function displayResult(){

// }

function timeElapsed() {

    setInterval(() => {
        if (elapsedTime == option) {
            timeLeft.innerText = 0 + "s"
            hiddenArea.remove()
            displayResult()
            // console.log("over")
            // console.log(elapsedTime + " "+ option)
            return;
        }
        currentTime = performance.now();
        elapsedTime = Math.floor((currentTime - startTime) / 1000)
        timeLeft.innerText = option - elapsedTime + "s"


    }, 500)




}

function displayWords() {
    setInterval(() => {
        countWords()

        wpm.innerText = Math.floor(wordCount * 60 / elapsedTime)
        accuracy.innerText = (correctChars * 100 / (correctChars + wrongChars)).toFixed(1) + "%"
    }
        , 1000)

}

// function displayResult(){
//     setInterval(()=>{
//         if(timeLeft.innerText<=0){
//             window.localStorage.setItem("wpm",wpm.innerText)
//             window.localStorage.setItem("accuracy", accuracy.innerText)
//             window.localStorage.setItem("option",option)

//             // resetApp()

//         }
//         // console.log("hi")
//     },100)
// }


function displayResult() {
    window.localStorage.setItem("wpm", wpm.innerText)
    window.localStorage.setItem("accuracy", accuracy.innerText)
    window.localStorage.setItem("option", option)
    // hiddenArea.blur()
    // hiddenArea.remove()




}


function typingStarted() {

    const chars = textArea.querySelectorAll("span")
    let typedChar = hiddenArea.value.split("")[charIndex];



    if (typedChar == null) {
        chars[charIndex].classList.remove("active")
        charIndex--
        chars[charIndex].classList.add("active")
        chars[charIndex].classList.remove("correct")
        chars[charIndex].classList.remove("incorrect")
    }
    else {
        if (chars[charIndex] === " " && typedChar !== " ") {
            newSpan = document.createElement('span')
            newSpan.innerText = typedChar
            textArea.insertBefore(newSpan, textArea[charIndex])
        }
        else {

            if (chars[charIndex].textContent === typedChar) {
                chars[charIndex].classList.add("correct")
                correctChars++



            }
            else {
                chars[charIndex].classList.add("incorrect")
                wrongChars++


            }
            charIndex++
        }
        if (textArea.childElementCount === charIndex) {
            textArea.innerHTML = ""
            hiddenArea.value = ""
            charIndex = 0;
            cumulativeWordCount = wordCount




            getNextText()
        }
        chars.forEach((spanTag) => spanTag.classList.remove("active"))
        chars[charIndex].classList.add("active")
    }

}


function setOption(opt) {


    if (opt === 1) {
        window.localStorage.setItem("option", 60)
        // resetApp()

        timeLeft.innerText = 60 + "s"

    }
    if (opt === 2) {
        window.localStorage.setItem("option", 30)
        // resetApp()


        timeLeft.innerText = 30 + "s"

    }
    if (opt === 3) {
        window.localStorage.setItem("option", 15)
        // resetApp()

        timeLeft.innerText = 15 + "s"
    }
    resetApp()


}


// function displayResult(){
//     window.localStorage.setItem("wpm",wpm.innerText)
// }

getNextText()



