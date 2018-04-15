<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>CryptoLeak</title>
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    <header class="flex-grid flex-align-center">
        <div class="col">
            <h1>CryptoLeak</h1>
            <p>
                <small>
                    Crypto Currency Rates sourced from various TOP Api's.
                </small>
            </p>
        </div>
        <img class="col" src="http://via.placeholder.com/750x150" alt="CryptoLeak Logo">
    </header>
    <nav class="flex-grid">
        <a href="../index.html" class="col">Home</a>
        <a href="../practical_1.html" class="col">Assignment 1</a>
        <a href="practical_2.html" class="col">Assignment 2</a>
        <a href="../under_construction.html" class="col">Assignment 3</a>
        <a href="../under_construction.html" class="col">Assignment 4</a>
        <a href="../under_construction.html" class="col">Assignment 5</a>
    </nav>
    <section>
        <div class="flex-grid box">
            <table width="100%" class="col">
                <caption><?=$_GET['name']?> - <?=$_GET['symbol']?></caption>
                <thead>
                    <tr>
                        <th></th>
                        <th>Price</th>
                        <th>Name</th>
                        <th>URL</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td rowspan="3">
                            <img src="https://chasing-coins.com/api/v1/std/logo/<?=$_GET['symbol']?>" alt="Logo" width="100" height="100">
                        </td>
                        <td><?=$_GET['avg_name0']?></td>
                        <td><a href="<?=$_GET['avg_url0']?>" target="_blank"><?=$_GET['avg_url0']?></a></td>
                        <td><?=$_GET['avg_price0']?></td>
                    </tr>
                    <tr>
                        <td><?=$_GET['avg_name1']?></td>
                        <td><a href="<?=$_GET['avg_url1']?>" target="_blank"><?=$_GET['avg_url1']?></a></td>
                        <td><?=$_GET['avg_price1']?></td>
                    </tr>
                    <tr>
                        <td><?=$_GET['avg_name2']?></td>
                        <td><a href="<?=$_GET['avg_url2']?>" target="_blank"><?=$_GET['avg_url2']?></a></td>
                        <td><?=$_GET['avg_price2']?></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</body>
</html>