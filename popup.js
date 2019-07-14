function prng(bounds) {
    let prn = window.crypto.getRandomValues(new Uint32Array(1))[0];
    if (rn.qrn) {
        prn = prn * rn.qrn[rn.index++ % 15];
    }
    else {
        prn = prn * window.crypto.getRandomValues(new Uint16Array(1))[0];
    }
    if (prn === 0) {
        prn = Math.floor(window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 * 2147483646) + 1;
    }
    document.getElementById("rn").innerHTML = Math.floor(prn % 2147483647 * 48271 % 2147483647 / 2147483647 * (bounds[1] - bounds[0] + 1) + bounds[0]);
}

function request(web) {
    if (web) {
        document.body.style.cursor = "progress";
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "https://qrng.anu.edu.au/API/jsonI.php?length=15&type=uint16", true);
        xhr.onload = function() {
            rn.qrn = JSON.parse(this.responseText).data;
            document.body.style.cursor = "auto";
        };
        xhr.send();
    }
}

function check(min, max) {
    if (isNaN(min)) {
        min = 0;
    }
    if (isNaN(max)) {
        max = 0;
    }
    if (min === max) {
        document.getElementById("rn").innerHTML = min;
        return;
    }
    if (min > max) {
        [min, max] = [max, min];
        document.getElementById("min").value = min;
        document.getElementById("max").value = max;
    }
    if (max - min > 2147483647) {
        document.getElementById("rn").innerHTML = "&#128565;";
        return;
    }
    return [min, max];
}

function setQRN() {
    let min = parseInt(document.getElementById("min").value);
    let max = parseInt(document.getElementById("max").value);
    let bounds = check(min, max);
    if (bounds) {
        request(navigator.onLine);
        setTimeout(function() {
            prng(bounds);
        }, 500);
    }
}

let rn = {index: 0};
document.getElementById("btn").onclick = setQRN;
setQRN();