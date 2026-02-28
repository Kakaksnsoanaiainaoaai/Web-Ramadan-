// SWITCH FORM
document.getElementById("toLogin").addEventListener("click", () => {

    document.getElementById("registerCard").style.display = "none";
    document.getElementById("loginCard").style.display = "block";

});

document.getElementById("toRegister").addEventListener("click", () => {

    document.getElementById("loginCard").style.display = "none";
    document.getElementById("registerCard").style.display = "block";

    document.getElementById("loginError").textContent = "";

});


// ==========================
// DAFTAR AKUN
// ==========================

document.getElementById("registerBtn").addEventListener("click", () => {

    const username = document.getElementById("regUsername").value.trim();
    const password = document.getElementById("regPassword").value.trim();

    if(!username || !password){

        alert("Isi username dan password!");
        return;

    }

    const users = JSON.parse(localStorage.getItem("users") || "{}");

    if(users[username]){

        alert("Username sudah terdaftar!");
        return;

    }

    users[username] = password;

    localStorage.setItem("users", JSON.stringify(users));

    alert("Akun berhasil dibuat, silakan login.");

    document.getElementById("regUsername").value = "";
    document.getElementById("regPassword").value = "";

    // pindah ke login
    document.getElementById("registerCard").style.display = "none";
    document.getElementById("loginCard").style.display = "block";

});


// ==========================
// LOGIN
// ==========================

document.getElementById("loginBtn").addEventListener("click", () => {

    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    const users = JSON.parse(localStorage.getItem("users") || "{}");

    if(users[username] && users[username] === password){

        // SIMPAN USER LOGIN
        localStorage.setItem("currentUser", username);


        // UNLOCK BADGE PERTAMA
        let badges = JSON.parse(localStorage.getItem("badges") || "[]");

        if(!badges.includes("Pemula Ramadan 🌙")){

            badges.push("Pemula Ramadan 🌙");

            localStorage.setItem("badges", JSON.stringify(badges));

        }


        // tampilkan loading
        document.querySelector(".auth-container").style.display = "none";

        document.getElementById("loading").style.display = "flex";


        // redirect ke dashboard
        setTimeout(() => {

            window.location.href = "dashboard.html";

        }, 1500);

    }

    else{

        document.getElementById("loginError").textContent =
        "Username atau password salah!";

    }

});