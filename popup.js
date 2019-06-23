document.getElementById("gen").onclick = function() {
    let min = parseInt(document.getElementById("min").value);
    let max = parseInt(document.getElementById("max").value);
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
        console.log(data);
        qrn = Math.round(data.data[0] / 65535 * (max - min) + min);
        document.getElementById("qrn").innerHTML = qrn;
    });
}