<!DOCTYPE html>
<html>
<head>
    <title>Admin Error List</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="_token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="{{ mix('css/app.css') }}">
    <link rel="stylesheet" href="{{ mix('css/admin.css') }}">
    <link rel="stylesheet" href="{{ mix('css/vendor.css') }}">
</head>
<body>
    <div id="app">
    </div>
    <script type="text/javascript" src="{{ mix('js/admin.js') }}"></script>
</body>
</html>
