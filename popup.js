function prng(bounds, len) {
    let prn = window.crypto.getRandomValues(new Uint16Array(1))[0] * ((rn.qrn && rn.qrn.length === len) ? rn.qrn[rn.index++ % len] : window.crypto.getRandomValues(new Uint16Array(1))[0]);
    if (prn === 0) prn = Math.floor(window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 * 2147483646) + 1;
    return Math.floor(prn % 2147483647 * 48271 % 2147483647 / 2147483647 * (bounds[1] - bounds[0] + 1) + bounds[0]);
}

function request(bounds, len) {
    document.body.style.cursor = "progress";
    let fail = function() {
        rn.web = false;
        if (!rn.qrn) {
            document.getElementById("rn").title = "Error: PRNG";
            document.getElementById("rn").style.color = "#666666";
        }
        document.body.style.cursor = "auto";
    };
    let load = function() {
        if (len === 1) {
            document.getElementById("rn").innerHTML = prng(bounds, len);
            return;
        }
        if (rn.win) rn.win.close();
        qrns = [];
        for (let i = 0; i < len; i++) qrns.push(prng(bounds, len));
        rn.win = window.open("", "_blank", "width=175,height=128", true);
        rn.win.document.write(rn.web ? qrns : "<p style='word-break: break-all; color: #666666;' title='Error: PRNG'>"+qrns+"</p>");
    };
    let xhr = new XMLHttpRequest();
    xhr.timeout = 10000;
    xhr.open("GET", "https://qrng.anu.edu.au/API/jsonI.php?length="+len+"&type=uint16", true);
    xhr.onload = function() {
        rn.qrn = JSON.parse(this.responseText).data;
        rn.web = true;
        document.body.style.cursor = "auto";
        document.getElementById("rn").title = "";
        document.getElementById("rn").style.color = "#222222";
        load();
    };
    xhr.ontimeout = function() {
        fail();
        load();
    };
    xhr.onerror = function() {
        fail();
        load();
    };
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
    if (len <= 0) {
        document.getElementById("rn").innerHTML = "";
        return;
    }
    if (bounds && len) {
        request(bounds, len);
    }
}

let rn = {index: 0};
document.getElementById("btn").onclick = setQRN;
setQRN();