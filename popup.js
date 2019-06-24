let load;

function _check(min, max) {
    if (isNaN(min)) {
        min = 0;
    }
    if (isNaN(max)) {
        max = 0;
    }
    if (max - min > 65536) {
        document.getElementById("qrn").innerHTML = "&#128565;";
        return;
    }
    else if (min > max) {
        let t = min;
        min = max;
        max = t;
        document.getElementById("min").value = min;
        document.getElementById("max").value = max;
    }
    return [min, max];
}

function _request(min, max, len) {
    clearInterval(load);
    load = setInterval(function() {
        document.getElementById("qrn").innerHTML = Math.floor(Math.random() * (max - min + 1) ) + min;;
    }, 100);
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let qrn = parseInt(this.responseText.split(/\[(.*?)\]/)[1]);
            clearInterval(load);
            document.getElementById("qrn").innerHTML = Math.round(qrn / 65535 * (max - min) + min); // scale the random number
        }
    };
    xhttp.open("GET", "https://qrng.anu.edu.au/API/jsonI.php?length="+String(len)+"&type=uint16", true);
    xhttp.send();
}

function setQRN() {
    let min = parseInt(document.getElementById("min").value);
    let max = parseInt(document.getElementById("max").value);
    let vals = _check(min, max);
    if (vals) {
        min = vals[0];
        max = vals[1];
        _request(min, max, 2);
    }
}

document.getElementById("gen").onclick = setQRN;