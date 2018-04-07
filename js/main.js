// for ref purposes
var currency = {
    logo: null,
    name: null,
    marketCap: null,
    price: null,
    avgPrice: {
        avg: null,
        price1: {
            name: null,
            url: null,
            price: null
        },
        price2: {
            name: null,
            url: null,
            price: null
        },
        price3: {
            name: null,
            url: null,
            price: null
        }
    },
    volume: null,
    fullDayChange: null
};

var data = [];

// https://stackoverflow.com/questions/2818648/using-two-xmlhttprequest-calls-on-a-page
function sendReq(url, callbackFunction) {
    var xmlhttp;

    if (window.ActiveXObject) {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    } else if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }

    xmlhttp.onreadystatechange = function() {
        console.log(xmlhttp.readyState + '|'+ url);
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            if (callbackFunction) callbackFunction(xmlhttp.responseText);
       }
    };

    xmlhttp.open("GET", url, false);
    xmlhttp.send();
}

// https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

function fetchData () {
    sendReq('https://api.coinmarketcap.com/v1/ticker/?limit=20', function (res) {
        window.theData = JSON.parse(res);
    });
}

function fetchExchangeRate() {
    sendReq('https://api.fixer.io/latest?base=USD', function (res) {
        window.exchangeRate = roundToTwo(JSON.parse(res).rates.ZAR);
    });
}

function setData () {
    window.theData.forEach(function (value) {
        data.push({
            logo: "https://chasing-coins.com/api/v1/std/logo/"+value.symbol,
            name: value.name,
            marketCap: value.market_cap_usd,
            price: roundToTwo((value.price_usd*window.exchangeRate)),
            volume: value['24h_volume_usd'],
            fullDayChange: value.percent_change_24h
        });
    });
}

function loadTable () {
    var currencyTable = document.getElementById('currencyTable');

    data.forEach(function (value) {
        var tr = document.createElement('tr');

        tr.innerHTML += '<td><img src="'+value.logo+'" class="currency-logo"/></td>';
        tr.innerHTML += "<td>"+value.name+"</td>";
        tr.innerHTML += "<td>"+value.market_cap+" USD</td>";
        tr.innerHTML += "<td>"+value.price+"</td>";
        tr.innerHTML += "<td>"+parseFloat('00.00')+"</td>";
        tr.innerHTML += "<td>"+value.volume+"</td>";
        tr.innerHTML += "<td>"+value.fullDayChange+" %</td>";
        currencyTable.appendChild(tr);
    });
}

fetchExchangeRate();
fetchData();
setData();

loadTable();