// https://stackoverflow.com/questions/2818648/using-two-xmlhttprequest-calls-on-a-page
function sendReq(url, callbackFunction) {
    var xmlhttp;

    if (window.ActiveXObject) {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    } else if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }

    xmlhttp.onreadystatechange = function() {
       if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            if (callbackFunction) callbackFunction(xmlhttp.responseText);
       }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

// https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

function loadTable () {
    sendReq('https://api.coinmarketcap.com/v1/ticker/?convert=ZAR&limit=20', function (res) {
        var logo_url = "https://chasing-coins.com/api/v1/std/logo/",
            currencyTable = document.getElementById('currencyTable');

        res = JSON.parse(res);
        res.forEach(function (value, index) {
            var tr = document.createElement('tr');

            tr.innerHTML += '<td><img src="'+logo_url+res[index].symbol+'" class="currency-logo"/></td>';
            tr.innerHTML += "<td>"+res[index].name+"</td>";
            tr.innerHTML += "<td>"+roundToTwo(res[index].market_cap_usd)+" USD</td>";
            tr.innerHTML += "<td>"+roundToTwo(res[index].price_usd)+" USD | R "+roundToTwo((res[index].price_usd*window.exchangeRate))+"</td>";
            tr.innerHTML += "<td>"+res[index].name+"</td>";
            tr.innerHTML += "<td>"+res[index].name+"</td>";
            tr.innerHTML += "<td>"+res[index].name+"</td>";
            currencyTable.appendChild(tr);
        });
    })
}

function setExchangeRate() {
    sendReq('https://api.fixer.io/latest?base=USD', function (res) {
        window.exchangeRate = roundToTwo(JSON.parse(res).rates.ZAR);
        loadTable();
    });
}

setExchangeRate();