const fs = require('fs');

const path = 'D:/GIT/propheus-website/lib/PropheusExperience.ts';
let code = fs.readFileSync(path, 'utf8');

// Use proper removeProperty for overflow
code = code.replace(/document\.documentElement\.style\.overflow\s*=\s*'';?/g, "document.documentElement.style.removeProperty('overflow');");
code = code.replace(/document\.body\.style\.overflow\s*=\s*'';?/g, "document.body.style.removeProperty('overflow');");

// Ensure event listeners are properly removed with {passive: false}
code = code.replace(/window\.removeEventListener\('touchstart',\s*this\._onTouchStart\);/g, "window.removeEventListener('touchstart', this._onTouchStart, { passive: false } as any);");
code = code.replace(/window\.removeEventListener\('touchmove',\s*this\._onTouchMove\);/g, "window.removeEventListener('touchmove', this._onTouchMove, { passive: false } as any);");
code = code.replace(/window\.removeEventListener\('touchend',\s*this\._onTouchEnd\);/g, "window.removeEventListener('touchend', this._onTouchEnd, { passive: false } as any);");
code = code.replace(/window\.removeEventListener\('wheel',\s*this\._onWheelBlock\);/g, "window.removeEventListener('wheel', this._onWheelBlock, { passive: false } as any);");
code = code.replace(/window\.removeEventListener\('scroll',\s*this\._onScrollPin\);/g, "window.removeEventListener('scroll', this._onScrollPin, { passive: false } as any);");

code = code.replace(
    /if \(scrollY <= 0\) \{\s*this\.exitLenisScrollModeReverse\(\);\s*\}/,
    `if (scrollY <= 0 && this.lenisExitDone === false && rawProgress === 0) {
            this.exitLenisScrollModeReverse();
        }`
);

fs.writeFileSync(path, code);
console.log('Fixed file.');
