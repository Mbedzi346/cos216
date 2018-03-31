!(function () {
    var xhttp = new XMLHttpRequest(),
        currencyTable = document.getElementById('currencyTable'),
        logo_url = "https://chasing-coins.com/api/v1/std/logo/";

    xhttp.open('GET','https://api.coinmarketcap.com/v1/ticker/?convert=ZAR&limit=20',true);

    xhttp.onload = function () {
        if (this.readyState === 4 && this.status === 200) {
            var res = JSON.parse(this.responseText);

            for (var x = 0; x < res.length; x++) {
                var tr = document.createElement('tr');

                tr.innerHTML += '<td><img src="'+logo_url+res[x].symbol+'" class="currency-logo"/></td>';
                tr.innerHTML += "<td>"+res[x].name+"</td>";
                tr.innerHTML += "<td>"+res[x].market_cap_zar+"</td>";
                tr.innerHTML += "<td>"+res[x].price_zar+"</td>";
                tr.innerHTML += "<td>"+res[x].name+"</td>";
                tr.innerHTML += "<td>"+res[x].name+"</td>";
                tr.innerHTML += "<td>"+res[x].name+"</td>";
                currencyTable.appendChild(tr);
            }

            // currencyTable.appendChild()
        }
    };

    xhttp.send();
})();
