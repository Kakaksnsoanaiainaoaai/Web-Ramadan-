// ==========================
// BADGE SYSTEM
// ==========================

function unlockBadge(name){

    let badges = JSON.parse(localStorage.getItem("badges") || "[]");

    if(!badges.includes(name)){

        badges.push(name);

        localStorage.setItem("badges", JSON.stringify(badges));

        showBadgePopup(name);

    }

}


// popup animasi badge
function showBadgePopup(name){

    const popup = document.createElement("div");

    popup.textContent = "🏆 Badge didapat: " + name;

    popup.style.position = "fixed";
    popup.style.top = "20px";
    popup.style.right = "20px";
    popup.style.background = "rgba(0,0,0,0.8)";
    popup.style.color = "#ffd700";
    popup.style.padding = "12px 18px";
    popup.style.borderRadius = "10px";
    popup.style.boxShadow = "0 0 20px rgba(255,215,0,0.5)";
    popup.style.zIndex = "9999";
    popup.style.opacity = "0";
    popup.style.transform = "translateY(-20px)";
    popup.style.transition = "0.4s";

    document.body.appendChild(popup);

    setTimeout(()=>{
        popup.style.opacity = "1";
        popup.style.transform = "translateY(0)";
    },10);

    setTimeout(()=>{
        popup.style.opacity = "0";
        popup.remove();
    },2500);

}

// ==========================
// MINI GAME RAMADAN PREMIUM
// ==========================

const kurmaContainer = document.getElementById("kurmaContainer");
const answersDiv = document.getElementById("answers");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");

let correctCount = 0;
let score = 0;
let timeLeft = 20;
let timerInterval;

// ==========================
// LOAD HIGH SCORE
// ==========================

let highScore = localStorage.getItem("ramadanHighScore") || 0;
highScoreEl.textContent = "High Score: " + highScore;


// ==========================
// START GAME
// ==========================

function startGame() {

    // reset state
    score = 0;
    timeLeft = 20;

    scoreEl.textContent = "Score: 0";

    kurmaContainer.style.opacity = "1";

    startTimer();

    nextRound();
}


// ==========================
// TIMER
// ==========================

function startTimer(){

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {

        timeLeft--;

        timerEl.textContent = "Waktu: " + timeLeft;

        if(timeLeft <= 0){

            endGame();

        }

    }, 1000);

}


// ==========================
// NEXT ROUND
// ==========================

function nextRound(){

    kurmaContainer.innerHTML = "";
    answersDiv.innerHTML = "";

    correctCount = Math.floor(Math.random()*6)+3;

    // animasi muncul satu-satu
    for(let i=0;i<correctCount;i++){

        const kurma = document.createElement("div");
        kurma.textContent = "🌰";
        kurma.className = "kurma";
        kurma.style.opacity = "0";
        kurma.style.transform = "scale(0.5)";

        kurmaContainer.appendChild(kurma);

        setTimeout(()=>{
            kurma.style.opacity = "1";
            kurma.style.transform = "scale(1)";
            kurma.style.transition = "0.3s ease";
        }, i*120);

    }

    generateAnswers();

}


// ==========================
// GENERATE ANSWERS
// ==========================

function generateAnswers(){

    let options = [correctCount];

    while(options.length < 4){

        let rand = correctCount + Math.floor(Math.random()*5)-2;

        if(rand > 0 && !options.includes(rand)){
            options.push(rand);
        }

    }

    options.sort(()=>Math.random()-0.5);

    options.forEach(num => {

        const btn = document.createElement("button");

        btn.textContent = num;

        btn.onclick = () => checkAnswer(num, btn);

        answersDiv.appendChild(btn);

    });

}

function checkAnswer(answer, btn){

    if(answer === correctCount){

        // BENAR
        score++;

        scoreEl.textContent = "Score: " + score;

        btn.style.background = "#00ff9d";
        btn.style.boxShadow = "0 0 15px #00ff9d";


        // UNLOCK BADGES
        if(score >= 10){
            unlockBadge("Pemula Kurma 🌰");
        }

        if(score >= 50){
            unlockBadge("Pecinta Kurma 🌴");
        }

        if(score >= 100){
            unlockBadge("Master Kurma 🔥");
        }

    }
    else{

        // SALAH
        btn.style.background = "#ff5252";
        btn.style.boxShadow = "0 0 15px #ff5252";

    }

    setTimeout(()=>{
        nextRound();
    },400);

}

// ==========================
// END GAME
// ==========================

function endGame(){

    clearInterval(timerInterval);

    // fade out kurma
    kurmaContainer.style.opacity = "0.3";

    answersDiv.innerHTML = "";

    // update high score
    if(score > highScore){

        highScore = score;

        localStorage.setItem("ramadanHighScore", highScore);

        highScoreEl.textContent = "High Score: " + highScore;

    }

    // tampil hasil
    const result = document.createElement("div");

    result.innerHTML = `
        <h3>Game Selesai 🌙</h3>
        <p>Score kamu: <b>${score}</b></p>
        <button id="restartBtn">Main Lagi 🔄</button>
    `;

    result.style.marginTop = "15px";

    answersDiv.appendChild(result);

    document.getElementById("restartBtn").onclick = restartGame;

}


// ==========================
// RESTART GAME
// ==========================

function restartGame(){

    // animasi reset
    kurmaContainer.style.opacity = "0";

    setTimeout(()=>{

        kurmaContainer.style.opacity = "1";

        startGame();

    }, 300);

}


// ==========================
// START FIRST TIME
// ==========================

startGame();