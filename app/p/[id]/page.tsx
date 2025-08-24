import { db } from "@/server/db";
import { projects, renders } from "@/../db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function PublicProject({ params }: { params: { id: string } }) {
  const pid = params.id;
  const [proj] = await db.select().from(projects).where(eq(projects.id, pid)).limit(1);
  const rs = await db.select().from(renders).where(eq(renders.projectId, pid));
  if (!proj) return <div className="p-6">Proje bulunamadı</div>;

  return (
    <main className="min-h-screen p-6 space-y-6">
      <h1 className="text-2xl font-bold">{proj.title}</h1>
      <p className="opacity-80">{proj.prompt}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rs.map(r=>(
          <div key={r.id} className="rounded-xl bg-black/30 border border-white/10 p-3">
            <div className="text-sm mb-2">Status: {r.status}</div>
            {r.storyboardJson && <pre className="text-xs whitespace-pre-wrap opacity-70">{r.storyboardJson.slice(0,180)}...</pre>}
            {r.videoUrl && <video controls src={r.videoUrl} className="w-full mt-2 rounded"/>}
          </div>
        ))}
      </div>
    </main>
  );
}
