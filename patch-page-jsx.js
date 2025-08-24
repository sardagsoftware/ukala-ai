const fs = require("fs");
const p = "app/page.tsx"; let s = fs.readFileSync(p,"utf8");
if(!s.includes("<BubbleFX />")){
  s = s.replace(/(<BackdropFX\s*\/>)/, '<BubbleFX />\n        $1');
  fs.writeFileSync(p,s); console.log("✓ <BubbleFX/> eklendi");
} else { console.log("• <BubbleFX/> zaten var"); }
