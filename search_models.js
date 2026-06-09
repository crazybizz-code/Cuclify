const fs = require('fs');
const path = require('path');

function searchModel(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            searchModel(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            if (content.includes('gemini')) {
                console.log('Gemini model ref in:', fullPath);
                // Print lines with gemini
                const lines = content.split('\n');
                lines.forEach((line, i) => {
                    if (line.includes('gemini')) {
                        console.log(`  Line ${i+1}: ${line.trim()}`);
                    }
                });
            }
        }
    }
}

searchModel(path.join(__dirname, 'app'));
