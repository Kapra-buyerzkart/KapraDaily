const fs = require('fs');
const file = 'src/screens/AddLocationScreen.js';
const lines = fs.readFileSync(file, 'utf-8').split('\n');

// Find start and end of the autocomplete block
const startIdx = lines.findIndex(l => l.includes('<View style={{ zIndex: 1, elevation: 5 }}>'));
// Find the end of this block by counting tags or just finding the specific end line.
// We know it ends with ") : null}" followed by "</View>"
let endIdx = -1;
for (let i = startIdx; i < lines.length; i++) {
    if (lines[i].includes(') : null}')) {
        endIdx = i + 1; // The next line is </View>
        break;
    }
}

if (startIdx !== -1 && endIdx !== -1) {
    const block = lines.splice(startIdx, endIdx - startIdx + 1);
    
    // Find where to insert it (after KeyboardAvoidingView)
    const insertIdx = lines.findIndex(l => l.includes('</KeyboardAvoidingView>'));
    
    if (insertIdx !== -1) {
        lines.splice(insertIdx + 1, 0, ...block);
        fs.writeFileSync(file, lines.join('\n'));
        console.log('Successfully moved autocomplete block');
    } else {
        console.log('Could not find </KeyboardAvoidingView>');
    }
} else {
    console.log('Could not find autocomplete block bounds');
}
