function prng(vals) {
    let prn = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 * 137441050657);
    if (rn.qrn) {
        prn = prn * rn.qrn[rn.index % 10];
        rn.index++;
    }
    else {
        prn = prn * crypto.getRandomValues(new Uint16Array(1))[0];
    }
    if (prn === 0) {
        prn = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 * 2147483646) + 1;
    }
    prn = prn % 2147483647 * 16807 % 2147483647;
    document.getElementById("rn").innerHTML = Math.floor(prn / 2147483646 * (vals[1] - vals[0] + 1) + vals[0]);
}

function request() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://qrng.anu.edu.au/API/jsonI.php?length=15&type=uint16", true);
    xhr.onload = function() {
        rn.qrn = JSON.parse(this.responseText).data;
        document.body.style.cursor = "auto";
    };
    xhr.send();
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
        let t = min;
        min = max;
        max = t;
        document.getElementById("min").value = min;
        document.getElementById("max").value = max;
    }
    if (max - min > 65535) {
        document.getElementById("rn").innerHTML = "&#128565;";
        return;
    }
    return [min, max];
}

function setQRN() {
    document.body.style.cursor = "progress";
    let min = parseInt(document.getElementById("min").value);
    let max = parseInt(document.getElementById("max").value);
    let vals = check(min, max);
    if (vals) {
        request();
        setTimeout(function() {
            prng(vals);
        }, 700);
    }
}

let rn = new Object();
rn.index = 0;
document.getElementById("gen").onclick = setQRN;

setQRN();