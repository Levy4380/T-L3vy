<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Laravel') }}</title>
    @if(app()->environment('local'))
        <script type="module" src="http://localhost:5173/@vite/client"></script>
        <script type="module" src="http://localhost:5173/resources/js/app.tsx"></script>
    @else
        @php
            $manifest = json_decode(file_get_contents(public_path('build/manifest.json')), true);
            $entry = $manifest['resources/js/app.tsx'] ?? null;
        @endphp
        @if($entry)
            <link rel="stylesheet" href="{{ asset('build/' . $entry['css'][0] ?? '') }}">
            <script type="module" src="{{ asset('build/' . $entry['file']) }}"></script>
        @endif
    @endif
</head>
<body>
    <div id="app"></div>
</body>
</html>

