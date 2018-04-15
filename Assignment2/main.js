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
            value['avg_name1'] = 'cryptonator.com';
            value['agv_url1'] = 'https://api.cryptonator.com/api/ticker/'+value.symbol+'-usd';
        });

        sendReq('https://min-api.cryptocompare.com/data/price?fsym='+value.symbol+'&tsyms=USD', function (res) {
            value['avg_price2'] = JSON.parse(res).USD;
            value['avg_name2'] = 'cryptocompare.com';
            value['avg_url2'] = 'https://min-api.cryptocompare.com/data/price?fsym='+value.symbol+'&tsyms=USD';
        });

        value['avg_price0'] = value.price_usd;
        value['avg_name0'] = 'coinmarketcap.com';
        value['avg_url0'] = 'https://api.coinmarketcap.com/v1/ticker/'+value.id;
    });
}

function showAvgDetails(symbol) {

    window.theData.forEach(function (value) {
        if (symbol === value.symbol) {

            window.open(
                window.location.origin+'/Assignment2/info.php' +
                '?symbol=' + value.symbol +
                '&name=' + value.name +

                '&avg_name0=' + value.avg_name0 +
                '&avg_url0='+ value.avg_url0 +
                '&avg_price0=' + value.avg_price0 +

                '&avg_name1=' + value.avg_name1 +
                '&avg_url1='+ value.agv_url1 +
                '&avg_price1=' + value.avg_price1 +


                '&avg_name2=' + value.avg_name2 +
                '&avg_url2=' + value.avg_url2 +
                '&avg_price2=' + value.avg_price2,
                '_blank'
            );

        }
    });
}

function setData () {
    data = [];
    window.theData.forEach(function (value) {
        data.push({
            symbol: value.symbol,
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
    currencyTable.innerHTML = '';

    data.forEach(function (value) {
        var tr = document.createElement('tr');

        tr.innerHTML += '<td><img src="'+value.logo+'" class="currency-logo"/></td>';
        tr.innerHTML += "<td>"+value.name+"</td>";
        tr.innerHTML += "<td>"+value.marketCap+" USD</td>";
        tr.innerHTML += '<td><a href="javascript:void(0)" onclick="showAvgDetails("'+value.symbol+'")">'+value.price+'</a></td>';
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
                setStatistics();
            } else {
                tr[i].style.display = "none";
                setStatistics();
            }
        }
    }
}

function setStatistics () {
    var sum = 0,
        avg,
        med,
        tempPrice = [],
        tempDayChange = [],
        posCng,
        negCng,
        tableTr = document.getElementById('currencyTable').getElementsByTagName('tr'),
        tr = document.createElement('tr');

    for (var i = 0; i < tableTr.length; i++) {
        if (tableTr[i].style.display !== 'none') {
            sum += parseFloat(tableTr[i].getElementsByTagName('td')[3].innerText);
            tempPrice.push(parseFloat(tableTr[i].getElementsByTagName('td')[3].innerText));
            tempDayChange.push(parseFloat(tableTr[i].getElementsByTagName('td')[6].innerText));
        }
    }

    avg = (sum / 20) ? sum / 20 : 0;
    med = (median(tempPrice)) ? median(tempPrice) : 0;
    posCng = (isFinite(Math.max.apply(null, tempDayChange))) ? Math.max.apply(null, tempDayChange) : 0;
    negCng = (isFinite(Math.min.apply(null, tempDayChange))) ? Math.min.apply(null, tempDayChange) : 0;

    tr.innerHTML += "<td>"+ roundToTwo(sum) +"</td>";
    tr.innerHTML += "<td>"+ roundToTwo(avg) +"</td>";
    tr.innerHTML += "<td>"+ roundToTwo(med) +"</td>";
    tr.innerHTML += "<td>"+ negCng +"</td>";
    tr.innerHTML += "<td>"+ posCng +"</td>";

    if (document.getElementById('currencyStatistics').children.length > 0)
        document.getElementById('currencyStatistics').innerHTML = "";

    document.getElementById('currencyStatistics').appendChild(tr);
}

function median(values) {

    values.sort( function(a,b) {return a - b;} );

    var half = Math.floor(values.length/2);

    if(values.length % 2)
        return values[half];
    else
        return (values[half-1] + values[half]) / 2.0;
}

function loadData() {
    document.getElementById('loader').style.visibility = 'visible';
    document.getElementById('loader').style.display = 'block';

    setTimeout(function () {
        fetchData();
        fetchAveragePrice();
        setData();
        loadTable();
        setStatistics();
        document.getElementById('loader').style.visibility = 'hidden';
    }, 1000);
}

fetchExchangeRate();