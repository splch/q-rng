document.getElementById("gen").onclick = function() {
    document.getElementById("qrn").innerHTML = '';
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://qrng.anu.edu.au/API/jsonI.php",
        "method": "GET",
        "headers": {
            "content-type": "application/x-www-form-urlencoded",
        },
        "data": {
            "length": "1",
            "type": "uint16",
        }
    };
    $.ajax(settings).always(function (data) {
        let min = parseInt(document.getElementById("min").value);
        let max = parseInt(document.getElementById("max").value);
        let qrn = Math.round(data.data[0] / 65535 * (max - min) + min);
        if (qrn) {
            document.getElementById("qrn").innerHTML = qrn;
        }
    });
}