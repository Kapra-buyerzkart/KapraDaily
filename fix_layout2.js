const fs = require('fs');
const file = 'src/screens/AddLocationScreen.js';
const lines = fs.readFileSync(file, 'utf-8').split('\n');

// Find the autocomplete block
const startIdx = lines.findIndex(l => l.includes('<View style={{ position: \'absolute\''));
let endIdx = -1;
for (let i = startIdx; i < lines.length; i++) {
    if (lines[i].includes(') : null}')) {
        endIdx = i + 1; // </View>
        break;
    }
}

if (startIdx !== -1 && endIdx !== -1) {
    const block = lines.splice(startIdx, endIdx - startIdx + 1);
    
    // Clean up the parent wrapper style back to original
    block[0] = block[0].replace(
        "style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1, elevation: 5 }}",
        "style={{ zIndex: 1, elevation: 5 }}"
    );
    
    // Find mapContainer end to insert AFTER it
    let mapEndIdx = -1;
    const mapStartIdx = lines.findIndex(l => l.includes('<View style={styles.mapContainer}>'));
    if (mapStartIdx !== -1) {
        let nestedDivs = 0;
        for (let i = mapStartIdx; i < lines.length; i++) {
            if (lines[i].includes('<View')) nestedDivs++;
            if (lines[i].includes('</View>')) {
                nestedDivs--;
                if (nestedDivs === 0) {
                    mapEndIdx = i;
                    break;
                }
            }
        }
    }
    
    if (mapEndIdx !== -1) {
        lines.splice(mapEndIdx + 1, 0, ...block);
        
        // Also fix styles.searchAbsoluteContainer to remove position absolute
        const styleIdx = lines.findIndex(l => l.includes('searchAbsoluteContainer: {'));
        if (styleIdx !== -1) {
            for (let i = styleIdx; i < styleIdx + 10; i++) {
                if (lines[i].includes("position: 'absolute'")) {
                    lines.splice(i, 1);
                    i--; // adjust index
                }
                if (lines[i].includes("top: hp('1.5%')")) {
                    lines[i] = lines[i].replace("top: hp('1.5%')", "marginTop: hp('1.5%')");
                }
            }
        }
        
        fs.writeFileSync(file, lines.join('\n'));
        console.log('Successfully moved autocomplete block back to top');
    } else {
        console.log('Could not find mapContainer end');
    }
} else {
    console.log('Could not find autocomplete block bounds');
}
