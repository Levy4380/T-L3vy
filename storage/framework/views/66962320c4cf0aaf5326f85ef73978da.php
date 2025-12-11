<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php echo e(config('app.name', 'Laravel')); ?></title>
    <?php if(app()->environment('local')): ?>
        <?php
            $viteClient = '@vite';
        ?>
        <script>
            // Initialize React Refresh globals BEFORE any Vite scripts load
            window.$RefreshReg$ = () => {};
            window.$RefreshSig$ = () => (type) => type;
        </script>
        <script type="module" src="http://localhost:5173/<?php echo e($viteClient); ?>/client"></script>
        <script type="module" src="http://localhost:5173/resources/js/app.tsx"></script>
    <?php else: ?>
        <?php
            $manifest = json_decode(file_get_contents(public_path('build/manifest.json')), true);
            $entry = $manifest['resources/js/app.tsx'] ?? null;
        ?>
        <?php if($entry): ?>
            <link rel="stylesheet" href="<?php echo e(asset('build/' . ($entry['css'][0] ?? ''))); ?>">
            <script type="module" src="<?php echo e(asset('build/' . $entry['file'])); ?>"></script>
        <?php endif; ?>
    <?php endif; ?>
</head>
<body>
    <div id="app"></div>
</body>
</html>

<?php /**PATH /home/tomaslevy/tomas-personal/T-L3vy/resources/views/app.blade.php ENDPATH**/ ?>