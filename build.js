const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

const handlersDir = path.resolve(__dirname, 'src/handlers');
const distDir = path.resolve(__dirname, 'dist');

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// Get all handler files
const handlerFiles = fs.readdirSync(handlersDir).filter(file => file.endsWith('.ts'));

handlerFiles.forEach(file => {
    const entryPoint = path.join(handlersDir, file);
    const outFile = path.join(distDir, file.replace('.ts', '.js'));

    esbuild.buildSync({
        entryPoints: [entryPoint],
        bundle: true,
        platform: 'node',
        target: 'node20',
        outfile: outFile,
        external: ['aws-sdk', '@muhammad-mubeen-hamid/marhaba-commons'],
    });

    console.log(`Built ${file} to ${outFile}`);
});
