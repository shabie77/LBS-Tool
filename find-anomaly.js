const fs = require('fs');

const data = fs.readFileSync('../lbs_bsc_nursing (1).csv', 'utf8');
const lines = data.split('\n');

for (let i = 1; i < lines.length; i++) {
  if (lines[i].includes('Sleeva') && lines[i].includes('SM')) {
    // extract Index_Mark which is at the end of the line
    const match = lines[i].match(/,([\d.]+)$/);
    if (match) {
      const mark = parseFloat(match[1]);
      if (mark < 250) {
        console.log('Low Mark Found:', mark);
        console.log('Row:', lines[i]);
      }
    }
  }
}
