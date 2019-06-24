function check(min, max) {
    if (isNaN(min)) {
        min = 0;
    }
    if (isNaN(max)) {
        max = 0;
    }
    if (max - min > 65536) {
        document.getElementById("qrn").innerHTML = "&#128565;";
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

function setQRN() {
    document.getElementById("qrn").innerHTML = '';
    let min = parseInt(document.getElementById("min").value);
    let max = parseInt(document.getElementById("max").value);
    let vals = check(min, max);
    min = vals[0];
    max = vals[1];
    const settings = {
        "url": "https://qrng.anu.edu.au/API/jsonI.php",
        "method": "GET",
        "data": {
            "length": "1",
            "type": "uint16",
        }
    };
    $.ajax(settings).done(function (data) {
        document.getElementById("qrn").innerHTML = Math.round(data.data[0] / 65535 * (max - min) + min); // scale the random number
    });
}

document.getElementById("gen").onclick = setQRN;