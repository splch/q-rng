function setQRN() {
    let min = parseInt(document.getElementById("min").value);
    let max = parseInt(document.getElementById("max").value);
    document.getElementById("qrn").innerHTML = '';
    if (isNaN(min) || isNaN(max)) {
        document.getElementById("qrn").innerHTML = 0;
    }
    else if (max - min > 65536) {
        document.getElementById("qrn").innerHTML = "&#128565;";
    }
    else {
        if (min > max) {
            min = parseInt(document.getElementById("max").value);
            max = parseInt(document.getElementById("min").value);
            document.getElementById("min").value = min;
            document.getElementById("max").value = max;
        }
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
}

document.getElementById("gen").onclick = setQRN;