
document.getElementById("scanButton").addEventListener("click", function() {
    if (window.Android) {
        window.Android.startQRScan();
    } else {
        alert("Android interface not available.");
    }
});
