function setQRN() {
    document.getElementById("qrn").innerHTML = '';
    let settings = {
        "url": "https://qrng.anu.edu.au/API/jsonI.php",
        "method": "GET",
        "data": {
            "length": "1",
            "type": "uint16",
        }
    };
    $.ajax(settings).done(function (data) {
        let min = parseInt(document.getElementById("min").value);
        let max = parseInt(document.getElementById("max").value);
        let qrn = Math.round(data.data[0] / 65535 * (max - min) + min); // scale the random number
        document.getElementById("qrn").innerHTML = qrn;
    });
}

document.getElementById("gen").onclick = setQRN;