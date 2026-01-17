// replace-colors.cjs - CommonJS script to replace indigo with primary
const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('indigo')) {
            const newContent = content.replace(/indigo/g, 'primary');
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log('Updated: ' + path.basename(filePath));
            return true;
        }
        return false;
    } catch (err) {
        console.error('Error processing ' + filePath + ': ' + err.message);
        return false;
    }
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    let count = 0;

    files.forEach(function (file) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            count += processDirectory(filePath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            if (replaceInFile(filePath)) count++;
        }
    });

    return count;
}

const pagesDir = './pages';
const componentsDir = './components';

console.log('Replacing indigo with primary...\n');

let total = 0;
total += processDirectory(pagesDir);
total += processDirectory(componentsDir);

console.log('\nDone! Updated ' + total + ' files.');
