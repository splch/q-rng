let load, qrn;

function _prng(vals) {
    let prn = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 * 8177608);
    if (qrn) {
        document.getElementById("rn").title = "Online: QRNG";
        document.getElementById("rn").index++;
        let i = document.getElementById("rn").index % 10;
        prn = prn * qrn[i];
    }
    else {
        document.getElementById("rn").title = "Offline: PRNG";
        prn = prn * crypto.getRandomValues(new Uint16Array(1))[0];
    }
    if (prn === 0) {
        prn += 2147483646;
    }
    prn = prn % 2147483647 * 16807 % 2147483647;
    setTimeout(function() {
        clearInterval(load);
        document.getElementById("rn").innerHTML = Math.round(prn / 2147483646 * (vals[1] - vals[0]) + vals[0]);
    }, 400);
}

function _request(vals) {
    clearInterval(load);
    load = setInterval(function() {
        document.getElementById("rn").innerHTML = Math.floor(Math.random() * (vals[1] - vals[0] + 1)) + vals[0];
    }, 100);
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://qrng.anu.edu.au/API/jsonI.php?length=10&type=uint16", true);
    xhr.onload = function() {
        qrn = JSON.parse(this.responseText).data;
        console.log(qrn);
    };
    xhr.send();
    _prng(vals);
}

function _check(min, max) {
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
    let vals = _check(min, max);
    if (vals) {
        _request(vals);
    }
}

document.getElementById("gen").onclick = setQRN;
document.getElementById("rn").index = 0;

setQRN();