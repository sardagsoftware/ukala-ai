# ukala.ai — AI Director MVP

Prompt → storyboard → video. Vercel üzerinde çalışan Next.js (App Router) + Vercel Postgres + Vercel Blob + Drizzle mimarisi.

## Hızlı Başlangıç (Lokal)

1) Depoyu klonla ve bağımlılıkları kur:
```bash
npm i
```
2) `.env` oluştur (örn. `.env.example` içeriğini kopyala) ve doldur:
```
DATABASE_URL=...       # Vercel Postgres connection string
OPENAI_API_KEY=...     # OpenAI API key
# (Opsiyonel) VIDEO_API_URL, VIDEO_API_KEY
```
3) Şemayı veritabanına gönder:
```bash
npx drizzle-kit push
```
4) Çalıştır:
```bash
npm run dev
```

## Deploy (Vercel)

- Repo'yu GitHub'a push et.
- Vercel → New Project → Environment Variables:
  - `DATABASE_URL`
  - `OPENAI_API_KEY`
  - (opsiyonel) `VIDEO_API_URL`, `VIDEO_API_KEY`
- Build: `npm run build`

## Mimari

- **/app** — Next.js App Router.  
- **/app/api** — Route handlers: `/api/generate`, `/api/webhook`, `/api/generate-video`.  
- **/db** — Drizzle şeması.  
- **/src/lib** — Sağlayıcı adapterleri.  
- **/src/server** — Drizzle DB client.  

## Notlar

- `VIDEO_API_*` doldurulmazsa proje storyboard üretir ve çalışır; video render çağrısı stub döner.
- Vercel Blob public URL döndürür, storyboard kareleri orada saklanır.
- İleride Unity/Unreal köprüsü için `videoProvider` adapteri genişletilebilir.

## 5 Dakika Desteği
- UI üzerinden saniye cinsinden hedef süre girilir (örn. 300).
- Sunucu beat-sheet üretir ve storyboard ile birlikte döner.
- Video render sağlayıcısı bağlandığında, her beat bir sahne olarak işlenip stitch edilebilir.
# ukala-ai-extended
# ukala-ai
