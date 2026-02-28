// Ambil elemen
const buttons = document.querySelectorAll(".emoji-buttons button");
const ctx = document.getElementById("moodChart").getContext("2d");

// Ambil data mood dari localStorage
let moodData = JSON.parse(localStorage.getItem("moodTracker") || "{}");

// Simpan mood hari ini
function setMood(mood){
    const today = new Date().toISOString().split("T")[0];
    moodData[today] = mood;
    localStorage.setItem("moodTracker", JSON.stringify(moodData));
    renderChart();
}

// Konversi mood ke angka supaya bisa di chart
const moodMap = {
    "Senang": 4,
    "Biasa": 3,
    "Sedih": 2,
    "Lelah": 1
};

function getChartData(){
    const labels = Object.keys(moodData).sort();
    const data = labels.map(d => moodMap[moodData[d]]);
    return {labels, data};
}

// Chart.js instance
let moodChart;

function renderChart(){
    const {labels, data} = getChartData();

    if(moodChart) moodChart.destroy();

    moodChart = new Chart(ctx,{
        type: 'line',
        data:{
            labels: labels,
            datasets:[{
                label: "Mood (1=Lelah → 4=Senang)",
                data: data,
                fill: true,
                backgroundColor: 'rgba(0,191,255,0.2)',
                borderColor: 'rgba(0,191,255,1)',
                tension: 0.3,
                pointRadius: 6
            }]
        },
        options:{
            responsive:true,
            scales:{
                y:{
                    min:1,
                    max:4,
                    ticks:{
                        stepSize:1,
                        callback: v => {
                            return Object.keys(moodMap).find(key => moodMap[key]===v);
                        }
                    }
                }
            },
            plugins:{
                legend:{ display:false }
            }
        }
    });
}

// Event klik tombol emoji
buttons.forEach(btn=>{
    btn.addEventListener("click", ()=>{
        setMood(btn.dataset.mood);
    });
});

// render chart awal
renderChart();