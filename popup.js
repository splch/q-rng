function prng(bounds, len) {
    let prn = window.crypto.getRandomValues(new Uint16Array(1))[0] * (rn.qrn ? rn.qrn[rn.index++ % len] : window.crypto.getRandomValues(new Uint16Array(1))[0]);
    if (prn === 0) prn = Math.floor(window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 * 2147483646) + 1;
    return Math.floor(prn % 2147483647 * 48271 % 2147483647 / 2147483647 * (bounds[1] - bounds[0] + 1) + bounds[0]);
}

function request(len) {
    document.body.style.cursor = "progress";
    let fail = function() {
        if (!rn.qrn) {
            document.getElementById("rn").title = "Error: PRNG";
            document.getElementById("rn").style.color = "#666666";
        }
        document.body.style.cursor = "auto";
    };
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://qrng.anu.edu.au/API/jsonI.php?length="+String(len)+"&type=uint16", true);
    xhr.onload = function() {
        rn.qrn = JSON.parse(this.responseText).data;
        document.body.style.cursor = "auto";
        document.getElementById("rn").title = "";
        document.getElementById("rn").style.color = "#222222";
    };
    xhr.ontimeout = fail;
    xhr.onerror = fail;
    xhr.send();
}

function check(min, max) {
    if (isNaN(min)) min = 0;
    if (isNaN(max)) max = 0;
    if (min === max) {
        document.getElementById("rn").innerHTML = min;
        return;
    }
    if (min > max) {
        [min, max] = [max, min];
        [document.getElementById("min").value, document.getElementById("max").value] = [min, max];
    }
    if (max - min > 2147483647) {
        document.getElementById("rn").innerHTML = "&#128565;";
        return;
    }
    return [min, max];
}

function setQRN() {
    let bounds = check(parseFloat(document.getElementById("min").value), parseFloat(document.getElementById("max").value));
    let len = parseInt(document.getElementById("len").value);
    if (bounds && len) {
        request(len);
        if (len > 1) {
            clearInterval(rn.interval);
            rn.interval = setInterval(function() {
                if (rn.qrn.length === len) {
                    let rn_window = window.open("", "QRNs", "width = 175px, height = 128px");
                    qrns = [];
                    for (let i = 0; i < len; i++) {
                        qrns.push(prng(bounds, len))
                    }
                    rn_window.document.write(String(qrns)+"\n\n");
                    clearInterval(rn.interval);
                }
            }, 100)
        }
        else document.getElementById("rn").innerHTML = prng(bounds, len);
    }
}

let rn = {index: 0};
document.getElementById("btn").onclick = setQRN;
setQRN();