const fs = require('fs');

const path = 'D:/GIT/propheus-website/lib/PropheusExperience.ts';
let code = fs.readFileSync(path, 'utf8');

// Replace dynamic 100vh with fixed displayHeight calculations
code = code.replace(
    /\`calc\\(100vh \+ \$\\{this\.LENIS_SCROLL_DISTANCE \+ this\.LENIS_POST_BUFFER\\}px\\)\`/g,
    "`${this.displayHeight + this.LENIS_SCROLL_DISTANCE + this.LENIS_POST_BUFFER}px`"
);

code = code.replace(
    /this\.heroEl\.style\.height = '100vh';/g,
    "this.heroEl.style.height = `${this.displayHeight}px`;"
);

fs.writeFileSync(path, code);
console.log('Fixed 100vh issues.');
