const fs = require('fs');
const path = require('path');

function searchLocalization(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            searchLocalization(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            if (content.includes('locale') || content.includes('language') || content.includes('useTranslation')) {
                console.log('Localization reference in:', fullPath);
            }
        }
    }
}

console.log('Searching for translation setup files:');
const rootFiles = fs.readdirSync(__dirname);
console.log(rootFiles.filter(f => f.includes('i18n') || f.includes('next') || f.includes('middleware')));

searchLocalization(path.join(__dirname, 'components'));
searchLocalization(path.join(__dirname, 'app'));
searchLocalization(path.join(__dirname, 'contexts'));
