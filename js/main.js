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

function fetchAveragePrice() {
    window.theData.forEach(function (value) {

        // this is super hacky and shouldn't be done :D
        if (value.symbol === 'MIOTA')
            value.symbol = 'IOT';
        else if (value.symbol === 'USDT')
            value.symbol = 'TUSD';

        sendReq('https://api.cryptonator.com/api/ticker/'+value.symbol+'-usd', function (res) {
            value['avg_price1'] = JSON.parse(res).ticker.price;
        });

        sendReq('https://min-api.cryptocompare.com/data/price?fsym='+value.symbol+'&tsyms=USD', function (res) {
            value['avg_price2'] = JSON.parse(res).USD;
        });
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
            fullDayChange: value.percent_change_24h,
            avg_price1: roundToTwo(value.avg_price1*window.exchangeRate),
            avg_price2: roundToTwo(value.avg_price2*window.exchangeRate)
        });
    });
}

function loadTable () {
    var currencyTable = document.getElementById('currencyTable');

    data.forEach(function (value) {
        var tr = document.createElement('tr');

        tr.innerHTML += '<td><img src="'+value.logo+'" class="currency-logo"/></td>';
        tr.innerHTML += "<td>"+value.name+"</td>";
        tr.innerHTML += "<td>"+value.marketCap+" USD</td>";
        tr.innerHTML += "<td>"+value.price+"</td>";
        tr.innerHTML += "<td>"+roundToTwo(computeAvg(value.price, value.avg_price1, value.avg_price2))+"</td>";
        tr.innerHTML += "<td>"+value.volume+"</td>";
        tr.innerHTML += "<td>"+value.fullDayChange+" %</td>";
        currencyTable.appendChild(tr);
    });
}

function computeAvg(p1, p2, p3) {
    if (isNaN(p2) || isNaN(p3))
        return p1;

    return ((p1 + p2 + p3) / 3);
}

function searchTable() {
    // Declare variables
    var input, filter, table, tr, td, i;
    input = document.getElementById("searchBox");
    filter = input.value.toUpperCase();
    table = document.getElementById("currencyTable");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function loadData() {
    fetchData();
    fetchAveragePrice();
    setData();
    loadTable();
}

fetchExchangeRate();
loadData();