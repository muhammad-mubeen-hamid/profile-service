const esbuild = require('esbuild');
const externals = require('esbuild-node-externals');
const path = require('path');
const fs = require('fs');

const handlersDir = path.resolve(__dirname, 'src/handlers');
const distDir = path.resolve(__dirname, 'dist');

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// Get all handler files
const handlerFiles = fs.readdirSync(handlersDir).filter(file => file.endsWith('.ts'));

const buildFunctions = handlerFiles.map(async (file) => {
    const entryPoint = path.join(handlersDir, file);
    const outFile = path.join(distDir, file.replace('.ts', '.js'));

    await esbuild.build({
        entryPoints: [entryPoint],
        bundle: true,
        platform: 'node',
        target: 'node20',
        outfile: outFile,
        plugins: [externals.nodeExternalsPlugin()],
    });

    console.log(`Built ${file} to ${outFile}`);
});

Promise.all(buildFunctions)
    .then(() => console.log('Build completed!'))
    .catch(err => console.error('Build failed:', err));
