const fs = require('fs');
const path = require('path');

function searchDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            searchDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            
            // Exclude common occurrences in string interpolation like ${
            const withoutInterpolation = content.replace(/\$\{/g, '');
            
            // Look for isolated $ or $ followed by numbers/price/amount
            if (/\$[0-9]|\$ \{|\$price|\$amount/i.test(withoutInterpolation)) {
                console.log('Found $ in:', fullPath);
            }
            // Check for explicit "price" usage to catch formatters
            if (/price/i.test(content) && !fullPath.includes('search_currency')) {
                console.log('Mentions price:', fullPath);
            }
        }
    }
}

searchDir(path.join(__dirname, 'components'));
searchDir(path.join(__dirname, 'app'));
searchDir(path.join(__dirname, 'lib'));
