// Update changed css and js names and in index.html with a timestamp
// Detect changes in css and js files using hash

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const htmlFile = 'index.html';
const hashFile = 'asset-hashes.json';
const timestamp = Date.now().toString().slice(-6);

function getHash(content) {
    return crypto.createHash('md5').update(content).digest('hex');
}

// load hashes
let prevHashes = {};
if (fs.existsSync(hashFile)) {
    prevHashes = JSON.parse(fs.readFileSync(hashFile, 'utf8'));
}

let newHashes = {};
let html = fs.readFileSync(htmlFile, 'utf8');

// regex to match JS and CSS tags
const assetRegex = /<(script|link)[^>]*(src|href)="([^"]+\.(js|css))"[^>]*>/g;

const processedFiles = new Set();

html.replace(assetRegex, (match, tag, attr, fileRef) => {
    const ext = path.extname(fileRef);
    const dirName = path.dirname(fileRef);
    const originalName = path.basename(fileRef);
    const baseName = originalName.replace(/-\d+(\.js|\.css)/, ext);
    const originalPath = path.join(dirName, originalName);
    const baseKey = path.join(dirName, baseName);

    if (!fs.existsSync(originalPath)) {
        console.warn(`File not found: ${originalPath}`);
        return match;
    }

    if (processedFiles.has(baseKey)) {
        return match;
    }
    processedFiles.add(baseKey);

    const content = fs.readFileSync(originalPath, 'utf8');
    const currentHash = getHash(content);
    const prevHash = prevHashes[baseKey];

    newHashes[baseKey] = currentHash;

    if (prevHash && prevHash === currentHash) {
        console.log(`No change: ${originalPath}`);
    }

    const baseNameWithoutExt = baseName.replace(ext, '');
    const newName = `${baseNameWithoutExt}-${timestamp}${ext}`;
    const newPath = path.join(dirName, newName);

    fs.renameSync(originalPath, newPath);

    console.log(`Renamed: ${originalPath} -> ${newPath}`);

    return match.replace(fileRef, path.join(dirName, newName).replace(/\\/g, '/'));
});

fs.writeFileSync(htmlFile, html, 'utf8');
fs.writeFileSync(hashFile, JSON.stringify(newHashes, null, 2), 'utf8');