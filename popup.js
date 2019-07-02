let load, qrn;

function _prng(vals) {
    let prn = Math.floor(Math.random() * 32768) + 1;
    if (qrn) {
        prn = prn * qrn * 16807 % 2147483647 / 2147483647;
    }
    else {
        prn = prn * 16807 % 2147483647 / 2147483647;
    }
    setTimeout(function() {
        clearInterval(load);
        document.getElementById("rn").innerHTML = Math.floor(prn * (vals[1] - vals[0]) + vals[0]);
    }, 250);
    document.getElementById("rn").title = "No internet connection: PRNG";
}

function _request(vals) {
    clearInterval(load);
    load = setInterval(function() {
        document.getElementById("rn").innerHTML = Math.floor(Math.random() * (vals[1] - vals[0] + 1)) + vals[0];
    }, 100);
    if (navigator.onLine === false) {
        _prng(vals);
    }
    else {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "https://qrng.anu.edu.au/API/jsonI.php?length=1&type=uint16", true);
        xhr.timeout = 5000;
        xhr.onload = function() {
            qrn = JSON.parse(this.responseText).data[0];
            clearInterval(load);
            document.getElementById("rn").innerHTML = Math.round(qrn / 65535 * (vals[1] - vals[0]) + vals[0]);
            document.getElementById("rn").title = "Internet connection: QRNG";
        };
        xhr.ontimeout = function() {
            _prng(vals);
        };
        xhr.send(null);
    }
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

setQRN();