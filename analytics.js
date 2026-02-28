// ==========================
// DYNAMIC ANALYTICS CLEAN
// ==========================

// Ambil elemen
const ctx = document.getElementById('activityChart').getContext('2d');
const filterSelect = document.getElementById('activityFilter');
const activityListEl = document.getElementById('activityList');

let activityChart;

// Ambil data semua aktivitas dari localStorage
function getActivities() {
    const miniGameHistory = JSON.parse(localStorage.getItem("gameHistory") || "[]");
    const badgeHistory = JSON.parse(localStorage.getItem("badgeHistory") || "[]");
    const loginHistory = JSON.parse(localStorage.getItem("loginHistory") || "[]");

    return [
        ...miniGameHistory.map(a => ({...a, type:"miniGame"})),
        ...badgeHistory.map(a => ({...a, type:"badge"})),
        ...loginHistory.map(a => ({...a, type:"login"}))
    ];
}

// Render list aktivitas
function renderActivityList(filtered) {
    activityListEl.innerHTML = "";
    filtered.slice(-20).reverse().forEach(a => {
        const div = document.createElement("div");
        div.className = "activity-item";
        div.textContent = `[${a.timestamp || a.time}] ${a.user || "Guest"} - ${a.type}` + 
            (a.badge ? ` - Badge: ${a.badge}` : "") +
            (a.score ? ` - Score: ${a.score}` : "");
        activityListEl.appendChild(div);
    });
}

// Hitung data untuk chart per hari
function getChartData(filtered) {
    const labels = [...new Set(filtered.map(a => (a.timestamp || a.time).split("T")[0]))].sort();
    const dataset = labels.map(date => {
        return filtered.filter(a => (a.timestamp || a.time).startsWith(date)).length;
    });
    return { labels, dataset };
}

// Render chart
function renderChart(filter="all") {
    const allActivities = getActivities();
    const filtered = filter === "all" ? allActivities : allActivities.filter(a => a.type === filter);

    renderActivityList(filtered);

    const { labels, dataset } = getChartData(filtered);

    const bgColors = filtered.map(a => {
        if(a.type === "login") return "#00ff7f";
        if(a.type === "badge") return "#ffd700";
        if(a.type === "miniGame") return "#00bfff";
        return "#ccc";
    });

    if(activityChart) activityChart.destroy();

    activityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.length ? labels : ["No Data"],
            datasets: [{
                label: "Aktivitas",
                data: dataset.length ? dataset : [0],
                backgroundColor: bgColors.length ? bgColors : ["#ccc"]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true }
            },
            scales: {
                y: { beginAtZero: true, ticks:{ stepSize: 1 } }
            },
            animation: { duration: 600, easing: 'easeOutQuart' }
        }
    });
}

// Event filter
filterSelect.addEventListener("change", e => renderChart(e.target.value));

// Update otomatis tiap 5 detik (cukup realtime & aman)
setInterval(() => renderChart(filterSelect.value), 5000);

// Render awal
renderChart();