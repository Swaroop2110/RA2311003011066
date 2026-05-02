const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\swaro\\Downloads\\ frontend file\\RA2311003011066';

function walk(directory) {
  let results = [];
  const list = fs.readdirSync(directory);
  list.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        results = results.concat(walk(filePath));
      }
    } else {
      if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.md')) {
        results.push(filePath);
      }
    }
  });
  return results;
}

const files = walk(dir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  if (file.endsWith('.js') || file.endsWith('.jsx')) {
    
    content = content.replace(/\/\*[\s\S]*?\*\
    
    content = content.replace(/(?<!https?:)\/\/.*$/gm, '');
  }

  
  content = content.replace(/\bclaude\b/gi, '');
  content = content.replace(/\bai\b/gi, '');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Processed', file);
  }
});
