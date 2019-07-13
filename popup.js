function prng(vals) {
    let prn = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 * 8177608);
    if (rn.qrn) {
        document.getElementById("rn").title = "QRNG";
        rn.index++;
        prn = prn * rn.qrn[rn.index % 10];
    }
    else {
        document.getElementById("rn").title = "PRNG";
        prn = prn * crypto.getRandomValues(new Uint16Array(1))[0];
    }
    if (prn === 0) {
        prn += Math.ceil((crypto.getRandomValues(new Uint32Array(1))[0] + 1) / 4294967296 * 2147483646);
    }
    prn = prn % 2147483647 * 16807 % 2147483647;
    clearInterval(rn.interval);
    document.getElementById("rn").innerHTML = Math.round(prn / 2147483646 * (vals[1] - vals[0]) + vals[0]);
}

function request(vals) {
    clearInterval(rn.interval);
    rn.interval = setInterval(function() {
        document.getElementById("rn").innerHTML = Math.floor(Math.random() * (vals[1] - vals[0] + 1)) + vals[0];
    }, 100);
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://qrng.anu.edu.au/API/jsonI.php?length=15&type=uint16", true);
    xhr.onload = function() {
        rn.qrn = JSON.parse(this.responseText).data;
    };
    xhr.send();
    setTimeout(function() {
        prng(vals);
    }, 700)
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
    let min = parseInt(document.getElementById("min").value);
    let max = parseInt(document.getElementById("max").value);
    let vals = check(min, max);
    if (vals) {
        request(vals);
    }
}

let rn = new Object();
rn.index = 0;
document.getElementById("gen").onclick = setQRN;

setQRN();