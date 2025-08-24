import { db } from "@/server/db";
import { projects, renders } from "@/../db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const ps = await db.select().from(projects).orderBy(desc(projects.createdAt)).limit(24);
  const rs = await db.select().from(renders).orderBy(desc(renders.createdAt));
  const byProject = new Map<string, any[]>();
  for (const r of rs) {
    const arr = byProject.get(r.projectId) || [];
    arr.push(r);
    byProject.set(r.projectId, arr);
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ps.map((p) => {
            const list = byProject.get(p.id) ?? [];
            const latest = list[0];
            let preview: string | null = null;
            try {
              if (latest?.storyboardJson) {
                const data = JSON.parse(latest.storyboardJson);
                preview = Array.isArray(data) ? data[0]?.url : data.frames?.[0]?.url;
              }
            } catch {}
            return (
              <a key={p.id} href={`/p/${p.id}`} className="card block">
                {preview ? (
                  <img src={preview} alt={p.title} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-black/40 flex items-center justify-center text-xs opacity-70">No preview</div>
                )}
                <div className="p-3">
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-xs opacity-70 line-clamp-2">{p.prompt}</div>
                  <div className="mt-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-white/10 border border-white/20">{latest?.status ?? "—"}</span>
                    {latest?.videoUrl && <span className="ml-2 opacity-80">🎬 video</span>}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </main>
  );
}
