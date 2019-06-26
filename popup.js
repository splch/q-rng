let load;

function _request(min, max) {
    clearInterval(load);
    load = setInterval(function() {
        document.getElementById("qrn").innerHTML = Math.floor(Math.random() * (max - min + 1) ) + min;;
    }, 100);
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let qrn = JSON.parse(this.responseText).data[0];
            clearInterval(load);
            document.getElementById("qrn").innerHTML = Math.round(qrn / 65535 * (max - min) + min); // scale the random number
        }
    };
    xhttp.open("GET", "https://qrng.anu.edu.au/API/jsonI.php?length=1&type=uint16", true);
    xhttp.send();
}

function _check(min, max) {
    if (isNaN(min)) {
        min = 0;
    }
    if (isNaN(max)) {
        max = 0;
    }
    if (min > max) {
        let t = min;
        min = max;
        max = t;
        document.getElementById("min").value = min;
        document.getElementById("max").value = max;
    }
    if (max - min > 65535) {
        document.getElementById("qrn").innerHTML = "&#128565;";
        return;
    }
    return [min, max];
}

function setQRN() {
    let min = parseInt(document.getElementById("min").value);
    let max = parseInt(document.getElementById("max").value);
    let vals = _check(min, max);
    if (vals) {
        min = vals[0];
        max = vals[1];
        _request(min, max);
    }
}

document.getElementById("gen").onclick = setQRN;

setQRN();