// Bikin DB dan object store
let db;
let request = indexedDB.open("RamadanDB", 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;

    // Object store untuk badge
    let badgeStore = db.createObjectStore("badges", { keyPath: "id" });
    badgeStore.createIndex("unlocked", "unlocked", { unique: false });

    // Object store untuk score mini game
    let scoreStore = db.createObjectStore("scores", { keyPath: "level" });
};

request.onsuccess = function(event) {
    db = event.target.result;
    console.log("Database siap!");
};

request.onerror = function(event) {
    console.error("Error database:", event.target.errorCode);
};

// Tambah badge
function addBadge(id, name, unlocked=false) {
    let transaction = db.transaction("badges", "readwrite");
    let store = transaction.objectStore("badges");
    store.add({id, name, unlocked});
}

// Baca badge
function getBadge(id, callback) {
    let transaction = db.transaction("badges", "readonly");
    let store = transaction.objectStore("badges");
    let request = store.get(id);
    request.onsuccess = () => callback(request.result);
}

// Update badge
function updateBadge(id, unlocked) {
    let transaction = db.transaction("badges", "readwrite");
    let store = transaction.objectStore("badges");
    store.put({id, unlocked});
}

// Hapus badge
function deleteBadge(id) {
    let transaction = db.transaction("badges", "readwrite");
    let store = transaction.objectStore("badges");
    store.delete(id);
}