const fs = require("fs");
const p = "app/page.tsx";
let s = fs.readFileSync(p, "utf8");

// import satırını sil
s = s.replace(/^\s*import\s+BubbleFX\s+from\s+".*?BubbleFX";?\s*$/m, "");

// JSX kullanımını sil (<BubbleFX/> veya <BubbleFX />)
s = s.replace(/<BubbleFX\s*\/>\s*\n?/g, "");

// Dosyayı yaz
fs.writeFileSync(p, s);
console.log("✓ BubbleFX import ve JSX kaldırıldı:", p);
