
let ticking = false;

function safeUpdate(fn){
    if(!ticking){
        requestAnimationFrame(()=>{
            fn();
            ticking=false;
        });
        ticking=true;
    }
}

setInterval(()=>{
    safeUpdate(updateCountdown);
},1000);

// ==========================
// DARK / LIGHT MODE SYSTEM (AUTO + MANUAL)
// ==========================

const toggleBtn = document.getElementById("toggleMode");

// LOAD THEME dari localStorage
function loadTheme() {

    const savedTheme = localStorage.getItem("theme");

    if(savedTheme === "light"){
        document.body.classList.add("light");
    }else if(savedTheme === "dark"){
        document.body.classList.remove("light");
    }

}

// AUTO THEME berdasarkan jam
function autoThemeByTime(){

    // kalau user pernah manual override, skip auto
    const manual = localStorage.getItem("themeManual");

    if(manual === "true") return;

    const hour = new Date().getHours();

    // malam → dark
    if(hour >= 18 || hour < 5){

        document.body.classList.remove("light");
        localStorage.setItem("theme","dark");

    }

    // siang → light
    else{

        document.body.classList.add("light");
        localStorage.setItem("theme","light");

    }

}

// TOGGLE MANUAL
if(toggleBtn){

    toggleBtn.addEventListener("click", () => {

        document.body.classList.toggle("light");

        // tandai manual override
        localStorage.setItem("themeManual","true");

        if(document.body.classList.contains("light")){

            localStorage.setItem("theme","light");

        }else{

            localStorage.setItem("theme","dark");

        }

    });

}

// LOAD awal
loadTheme();

// AUTO setelah load
autoThemeByTime();

// cek tiap 1 menit
setInterval(autoThemeByTime, 60000);

// ==========================
// JAM REALTIME
// ==========================

function updateClock() {

    const clock = document.getElementById("clock");
    if (!clock) return;

    const now = new Date();

    clock.textContent = now.toLocaleTimeString("id-ID");
}

setInterval(updateClock, 1000);
updateClock();


// ==========================
// RAMADAN TABLE (FORMAT ISO FIX)
// ==========================

const ramadanTable = {

    2024: "2024-03-11",
    2025: "2025-03-01",
    2026: "2026-02-19",
    2027: "2027-02-09",
    2028: "2028-01-29",
    2029: "2029-01-17",
    2030: "2030-01-06"

};

function getRamadanStart() {

    const year = new Date().getFullYear();

    if (ramadanTable[year]) {

        return new Date(ramadanTable[year] + "T00:00:00");

    }

    // fallback estimasi
    const lastYear = 2030;
    const lastDate = new Date(ramadanTable[lastYear] + "T00:00:00");

    const diffYear = year - lastYear;

    lastDate.setDate(lastDate.getDate() - Math.round(diffYear * 10.875));

    return lastDate;
}

const startRamadan = getRamadanStart();


// ==========================
// CONFIG WAKTU
// ==========================

const bukaHour = 17;
const bukaMinute = 55;

const sahurHour = 3;
const sahurMinute = 0;

// ==========================
// QUOTE HARIAN RAMADAN
// ==========================

const quotes = [
    "Awali hari dengan sahur, tutup dengan syukur.",
    "Sabar itu kunci puasa yang barokah.",
    "Perbanyak doa dan tilawah di bulan suci.",
    "Sedekah kecil lebih baik daripada tidak sama sekali.",
    "Ramadan adalah perjalanan hati dan jiwa.",
    "Hargai setiap detik ibadahmu.",
    "Berbagi itu memperkaya hati.",
    "Puasa mengajarkan kontrol diri dan kesabaran.",
    "Syukur membuat setiap hari lebih berarti.",
    "Tingkatkan amal, perbanyak senyum."
];

// function untuk update quote
function updateDailyQuote(day) {
    const el = document.getElementById("dailyQuote");
    if (!el) return;

    // pilih quote berdasarkan hari, looping jika day > quotes.length
    const index = (day - 1) % quotes.length;
    el.textContent = quotes[index];
}

// ==========================
// HITUNG DAY RAMADAN (FIX UTC)
// ==========================

function updateRamadanDay() {

    const el = document.getElementById("ramadanDay");
    if (!el) return;

    const now = new Date();

    const nowUTC = Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    const startUTC = Date.UTC(
        startRamadan.getFullYear(),
        startRamadan.getMonth(),
        startRamadan.getDate()
    );

    const diffDays =
        Math.floor((nowUTC - startUTC) / 86400000) + 1;

    el.textContent =
        `Ramadan ${startRamadan.getFullYear()} - Day ${diffDays}`;

    updateProgress(diffDays);
    updateDailyQuote(diffDays);
}

function updateProgress(day) {

    const bar = document.getElementById("progressBar");
    const text = document.getElementById("progressText");
    const remain = document.getElementById("remainingText");
    const status = document.getElementById("statusText");
    const eid = document.getElementById("eidCountdown");

    if (!bar || !text || !remain || !status || !eid) return;

    const total = 30;
    const safeDay = Math.max(0, Math.min(day, total));
    const percent = (safeDay / total) * 100;

    // ANIMASI PELAN
    const current = parseFloat(bar.style.width) || 0;
    let diff = percent - current;

    if (diff !== 0) {
        const step = diff / 10; // 10 step animasi
        let i = 0;
        const interval = setInterval(() => {
            i++;
            bar.style.width = current + step * i + "%";
            if (i >= 10) clearInterval(interval);
        }, 50); // update tiap 50ms, total 500ms smooth
    }

    // update teks & status tetap instant
    text.textContent = `${Math.floor(percent)}% selesai (${safeDay}/${total} hari)`;

    const remainingDays = total - safeDay;
    remain.textContent = remainingDays > 0 ?
        `Sisa ${remainingDays} hari lagi` : `Ramadan selesai 🌙`;

    if (safeDay <= 10) {
        status.textContent = "Status: Awal Ramadan ✨";
    } else if (safeDay <= 20) {
        status.textContent = "Status: Pertengahan Ramadan 🌙";
    } else if (safeDay < 30) {
        status.textContent = "Status: Akhir Ramadan 🔥";
    } else {
        status.textContent = "Status: Idul Fitri 🎉";
    }

    eid.textContent = remainingDays > 0 ?
        `Menuju Idul Fitri: ${remainingDays} hari` : "Selamat Idul Fitri 🎉";
        
bar.classList.remove("special");
bar.classList.remove("special-gold");
status.classList.remove("special");
status.classList.remove("special-gold");

if (safeDay === 15) {
    // Pertengahan Ramadan
    bar.classList.add("special");
    status.classList.add("special");
    status.textContent += " ✨ Pertengahan Ramadan!";
} else if (safeDay >= 28) {
    // Hampir akhir Ramadan sampai Idul Fitri
    bar.classList.add("special-gold");
    status.classList.add("special-gold");
    if (safeDay < 30) {
        status.textContent += " ✨ Hampir Akhir Ramadan!";
    } else {
        status.textContent += " 🎉 Akhir Ramadan!";
    }
}

}

// ==========================
// COUNTDOWN
// ==========================

function getCountdown(target) {

    const now = new Date();
    const diff = target - now;

    if (diff <= 0) return "Sedang berlangsung";

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    return `${h}j ${m}m ${s}d`;
}

function updateCountdown() {

    const bukaEl = document.getElementById("countdownBuka");
    const sahurEl = document.getElementById("countdownSahur");

    if (!bukaEl || !sahurEl) return;

    const now = new Date();

    const buka = new Date();
    buka.setHours(bukaHour, bukaMinute, 0, 0);

    const sahur = new Date();
    sahur.setHours(sahurHour, sahurMinute, 0, 0);

    if (now > buka) buka.setDate(buka.getDate() + 1);
    if (now > sahur) sahur.setDate(sahur.getDate() + 1);

    bukaEl.textContent =
        "Menuju buka: " + getCountdown(buka);

    sahurEl.textContent =
        "Menuju sahur: " + getCountdown(sahur);
}


// ==========================
// LOOP UPDATE
// ==========================

// countdown tiap detik
setInterval(updateCountdown,1000);

// ramadan update tiap 1 menit
setInterval(updateRamadanDay,60000);

updateRamadanDay();
updateCountdown();


// ==========================
// HAMBURGER MENU
// ==========================

const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

if (hamburger && navMenu) {

    hamburger.addEventListener("click", (e) => {

        e.stopPropagation();

        navMenu.classList.toggle("show");
        hamburger.classList.toggle("active");

    });

    document.addEventListener("click", (e) => {

        if (!navMenu.contains(e.target) &&
            !hamburger.contains(e.target)) {

            navMenu.classList.remove("show");
            hamburger.classList.remove("active");

        }

    });

// Format: [tanggal, subuh, dzuhur, asar, maghrib, isya]
const prayerTimes = [
  ["19/02/2026","04:20","11:50","14:58","17:59","19:09"],
  ["20/02/2026","04:10","11:50","14:59","18:00","19:10"],
  ["21/02/2026","04:10","11:49","14:58","17:59","19:09"],
  ["22/02/2026","04:10","11:49","14:57","17:59","19:09"],
  ["23/02/2026","04:10","11:49","14:57","17:58","19:09"],
  ["24/02/2026","04:10","11:49","14:56","17:58","19:08"],
  ["25/02/2026","04:11","11:49","14:56","17:58","19:08"],
  ["26/02/2026","04:11","11:48","14:55","17:56","19:07"],
  ["27/02/2026","04:11","11:49","14:53","17:57","19:08"],
  ["28/02/2026","04:11","11:48","14:52","17:56","19:07"],
  ["01/03/2026","04:11","11:48","14:51","17:56","19:07"],
  ["02/03/2026","04:11","11:48","14:50","17:56","19:06"],
  ["03/03/2026","04:11","11:48","14:50","17:55","19:06"],
  ["04/03/2026","04:11","11:48","14:50","17:54","19:05"],
  ["05/03/2026","04:12","11:48","14:50","17:54","19:05"],
  ["06/03/2026","04:12","11:48","14:50","17:54","19:04"],
  ["07/03/2026","04:22","11:47","14:51","17:54","19:04"],
  ["08/03/2026","04:22","11:47","14:51","17:53","19:03"],
  ["09/03/2026","04:12","11:46","14:51","17:52","19:02"],
  ["10/03/2026","04:12","11:46","14:52","17:53","19:02"],
  ["11/03/2026","04:12","11:46","14:52","17:52","19:01"],
  ["12/03/2026","04:12","11:46","14:53","17:52","19:01"],
  ["13/03/2026","04:12","11:45","14:53","17:51","19:00"],
  ["14/03/2026","04:12","11:45","14:53","17:51","18:59"],
  ["15/03/2026","04:12","11:45","14:53","17:50","18:59"],
  ["16/03/2026","04:12","11:45","14:54","17:50","18:59"],
  ["17/03/2026","04:12","11:44","14:54","17:48","18:58"],
  ["18/03/2026","04:12","11:44","14:54","17:48","18:56"],
  ["19/03/2026","04:12","11:44","14:55","17:47","18:55"],
  ["20/03/2026","04:12","11:43","14:55","17:47","18:56"],
  ["21/03/2026","04:12","11:43","14:55","17:46","18:55"]
];

// ==========================
// JADWAL SHOLAT PREVIEW 3 HARI
// ==========================

// Fungsi untuk update preview 3 hari
function updateSholatPreview() {
    const el = document.getElementById("sholat3days");
    if (!el) return;

    el.innerHTML = ""; // bersihkan dulu

    const today = new Date();
    today.setHours(0,0,0,0);

    let count = 0;
    for (let i = 0; i < prayerTimes.length && count < 3; i++) {
        const [dateStr, subuh, dzuhur, asar, maghrib, isya] = prayerTimes[i];
        const [d, m, y] = dateStr.split("/").map(Number);
        const dt = new Date(y, m-1, d);

        if (dt >= today) {
            const div = document.createElement("div");
            div.className = "sholat-day";
            div.innerHTML = `<strong>${dateStr}</strong> - Subuh: ${subuh} | Dzuhur: ${dzuhur} | Ashar: ${asar} | Maghrib: ${maghrib} | Isya: ${isya}`;
            el.appendChild(div);
            count++;
        }
    }
}

// Jalankan preview saat load
updateSholatPreview();

function getTodayPrayer() {
    const now = new Date();
    const today = now.getDate();
    return prayerTimes.find(p => p.day === today);
}

function displayPrayerTimes() {
    const today = getTodayPrayer();
    if (!today) return;

    document.getElementById("imsak").textContent = "Imsak: " + today.imsak;
    document.getElementById("subuh").textContent = "Subuh: " + today.subuh;
    document.getElementById("dzuhur").textContent = "Dzuhur: " + today.dzuhur;
    document.getElementById("ashar").textContent = "Ashar: " + today.ashar;
    document.getElementById("maghrib").textContent = "Maghrib: " + today.maghrib;
    document.getElementById("isya").textContent = "Isya: " + today.isya;
}

// ==========================
// Countdown ke sholat berikutnya
// ==========================
function updateNextPrayer() {
    const now = new Date();
    const today = getTodayPrayer();
    if (!today) return;

    const prayers = ["imsak","subuh","dzuhur","ashar","maghrib","isya"];
    let nextPrayer = null;
    let nextTime = null;

    for (let i=0;i<prayers.length;i++){
        const p = prayers[i];
        const [h,m] = today[p].split(":").map(Number);
        const time = new Date();
        time.setHours(h,m,0,0);
        if (time > now){
            nextPrayer = p.charAt(0).toUpperCase() + p.slice(1);
            nextTime = time;
            break;
        }
    }

    const countdownEl = document.getElementById("nextPrayer");
    if (!countdownEl) return;

    if (nextPrayer){
        const diff = nextTime - now;
        const h = Math.floor(diff/3600000);
        const m = Math.floor((diff%3600000)/60000);
        const s = Math.floor((diff%60000)/1000);
        countdownEl.textContent = `Sholat berikutnya: ${nextPrayer} (${h}j ${m}m ${s}d)`;
    } else {
        countdownEl.textContent = "Semua sholat selesai hari ini 🌙";
    }
}

displayPrayerTimes(); // cukup sekali

setInterval(()=>{
    safeUpdate(updateNextPrayer);
},1000);

displayPrayerTimes();
updateNextPrayer();

}

// ==========================
// MINI GAME PREVIEW
// ==========================

let previewCount = 0;

function generatePreviewGame(){

    const container = document.getElementById("previewDatesContainer");

    if(!container) return;

    container.innerHTML = "";

    previewCount = Math.floor(Math.random()*6)+5;

    for(let i=0;i<previewCount;i++){

        const kurma = document.createElement("div");

        kurma.className = "kurma";

        kurma.textContent = "🌰";

        container.appendChild(kurma);

    }

}

function checkPreviewAnswer(){

    const answer = parseInt(document.getElementById("previewAnswer").value);

    const result = document.getElementById("previewResult");

    if(answer === previewCount){

        result.textContent = "Benar! 🎉";

        result.style.color = "#00ff9d";

    }else{

        result.textContent = "Salah! jawabannya "+previewCount;

        result.style.color = "#ff5252";

    }

}

// generate saat load
generatePreviewGame();

// ==========================
// AUTH SYSTEM
// ==========================

function updateAuthUI(){

    const authArea = document.getElementById("authArea");

    if(!authArea) return;

    const user = localStorage.getItem("currentUser");

    if(user){

        authArea.innerHTML = `
            <div class="auth-user">Halo, ${user}</div>
            <button id="logoutBtn" class="auth-btn">Logout</button>
        `;

        document.getElementById("logoutBtn").onclick = function(){

            localStorage.removeItem("currentUser");

            location.reload();

        };

    }else{

        authArea.innerHTML = `
            <a href="login.html" class="auth-btn">Login</a>
            <a href="login.html" class="auth-btn">Daftar</a>
        `;

    }

}

updateAuthUI();

// ==========================
// BADGE SYSTEM
// ==========================

// unlock badge
function unlockBadge(name){

    let badges = JSON.parse(localStorage.getItem("badges") || "[]");

    if(!badges.includes(name)){

        badges.push(name);

        localStorage.setItem("badges", JSON.stringify(badges));

        showBadgeNotification(name);

        displayBadges();

    }

}

// tampilkan badge
function displayBadges(){

    const container = document.getElementById("badgeList");

    if(!container) return;

    const badges = JSON.parse(localStorage.getItem("badges") || "[]");

    container.innerHTML = "";

    badges.forEach(badge => {

        const div = document.createElement("div");

        div.className = "badge";

        div.textContent = badge;

        container.appendChild(div);

    });

}

// notif badge unlock
function showBadgeNotification(name){

    const notif = document.createElement("div");

    notif.innerText = "🏆 Badge didapat: " + name;

    notif.style.position = "fixed";
    notif.style.bottom = "20px";
    notif.style.right = "20px";
    notif.style.background = "#ffd700";
    notif.style.color = "black";
    notif.style.padding = "10px 15px";
    notif.style.borderRadius = "10px";
    notif.style.fontWeight = "bold";
    notif.style.zIndex = "999";

    document.body.appendChild(notif);

    setTimeout(()=>{
        notif.remove();
    },2000);

}

// jalankan saat load
displayBadges();

// =========================
// Tips Kesehatan Ramadan
// =========================
const tips = [
    "Tetap minum air putih yang cukup saat sahur dan berbuka.",
    "Konsumsi makanan bergizi seimbang, jangan berlebihan.",
    "Hindari makanan terlalu manis saat berbuka agar gula stabil.",
    "Tidur cukup, jangan begadang berlebihan saat sahur.",
    "Lakukan olahraga ringan setelah berbuka, misal jalan 10-15 menit.",
    "Batasi kafein agar tidak dehidrasi.",
    "Makan sahur jangan terlalu larut, beri waktu untuk pencernaan.",
    "Perbanyak konsumsi buah & sayur untuk vitamin dan serat.",
    "Jangan langsung tidur setelah berbuka, beri waktu 30-60 menit.",
    "Atur jadwal minum secara merata antara berbuka dan sahur."
];

let currentTip = 0;
const healthTipEl = document.getElementById("healthTip");
const nextTipBtn = document.getElementById("nextTip");

// tampilkan tip sesuai index
function showTip(index){
    healthTipEl.textContent = tips[index];
}

// tombol next
nextTipBtn.addEventListener("click", ()=>{
    currentTip = (currentTip + 1) % tips.length;
    showTip(currentTip);
});

// tampilkan tip pertama saat load
showTip(currentTip);

document.addEventListener("DOMContentLoaded", function() {

    const popups = ["popup1", "popup2", "popup3", "popup4"];
    let current = 0;

    function showPopup(index){
        if(index >= popups.length) return;
        const popup = document.getElementById(popups[index]);
        if(!popup) return;

        popup.classList.add("show");

        const closeBtn = popup.querySelector(".popup-close");
        if(closeBtn){
            closeBtn.addEventListener("click", () => {
                popup.classList.remove("show");
                current++;
                showPopup(current);
            }, { once: true }); // biar event cuma sekali
        }
    }

    // mulai popup pertama
    showPopup(current);

});

const chatIcon = document.getElementById('chatIcon');
const chatWindow = document.getElementById('chatWindow');
const closeChat = document.getElementById('closeChat');
const gotoCS = document.getElementById('gotoCS');

chatIcon.addEventListener('click', () => {
    chatWindow.style.display = 'flex';
});

closeChat.addEventListener('click', () => {
    chatWindow.style.display = 'none';
});

gotoCS.addEventListener('click', () => {
    window.location.href = 'cs.html';
});

// Array ayat harian khusus Ramadan
const dailyAyats = [
    { 
        text: "Bulan Ramadan adalah bulan yang di dalamnya diturunkan Al-Qur’an sebagai petunjuk bagi manusia", 
        ref: "QS. Al-Baqarah:185" 
    },
    { 
        text: "Barang siapa di antara kamu menyaksikan (bulan Ramadan), hendaklah ia berpuasa", 
        ref: "QS. Al-Baqarah:185" 
    },
    { 
        text: "Dan makan minumlah hingga terang bagimu benang putih dari benang hitam, lalu sempurnakanlah puasa sampai malam", 
        ref: "QS. Al-Baqarah:187" 
    },
    { 
        text: "Sesungguhnya orang-orang yang beriman dan mengerjakan amal saleh, Allah akan menghapus dosa-dosa mereka", 
        ref: "QS. Al-Baqarah:82" 
    },
    { 
        text: "Barang siapa yang berpuasa pada bulan Ramadan dengan iman dan mengharap pahala, diampuni dosa-dosanya yang telah lalu", 
        ref: "HR. Bukhari & Muslim" 
    },
    { 
        text: "Allah tidak membebani seseorang melainkan sesuai kesanggupannya", 
        ref: "QS. Al-Baqarah:286" 
    },
    { 
        text: "Sesungguhnya shalatku, ibadahku, hidupku dan matiku hanya untuk Allah", 
        ref: "QS. Al-An'am:162" 
    }
];

// Ambil hari sekarang (1–7 untuk contoh ini)
const today = new Date().getDate(); 
const ayatIndex = today % dailyAyats.length; // supaya looping harian

// Set ayat ke div
document.getElementById("ayatText").innerText = dailyAyats[ayatIndex].text;
document.getElementById("ayatReference").innerText = dailyAyats[ayatIndex].ref;

if(chatBody){
    requestAnimationFrame(()=>{
        chatBody.scrollTo({
            top: chatBody.scrollHeight,
            behavior:"smooth"
        });
    });
}