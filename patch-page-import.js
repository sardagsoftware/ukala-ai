const fs = require("fs");
const p = "app/page.tsx"; let s = fs.readFileSync(p,"utf8");
if(!s.includes('import BubbleFX')){
  s = s.replace('import BackdropFX from "./components/BackdropFX";', (m)=> m + '\nimport BubbleFX from "./components/BubbleFX";');
  fs.writeFileSync(p,s);
  console.log("✓ import BubbleFX eklendi");
} else { console.log("• import zaten var"); }
