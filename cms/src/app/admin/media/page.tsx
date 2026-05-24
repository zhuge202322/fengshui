import { prisma } from "@/lib/prisma";
import { MediaManager } from "./MediaManager";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const list = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div>
      <header className="mb-6">
        <div className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--c-primary-soft)" }}>
          Library
        </div>
        <h1 className="mt-2 text-3xl gold-text" style={{ fontFamily: "Cinzel" }}>
          Media
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--c-muted)" }}>
          Upload covers, talismans, and ritual photographs. Files are saved under /uploads.
        </p>
      </header>

      <MediaManager
        initial={(list as Array<{
          id: string;
          filename: string;
          mimeType: string;
          size: number;
          url: string;
          alt: string | null;
          createdAt: Date;
        }>).map((m) => ({
          id: m.id,
          filename: m.filename,
          mimeType: m.mimeType,
          size: m.size,
          url: m.url,
          alt: m.alt,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
