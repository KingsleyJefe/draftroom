import TopBar from "./TopBar";
import EDITOR from "./EDITOR";
import { motion } from "framer-motion";
import { useEditor } from "@tiptap/react";
import { useMemo, useState } from "react";
import Container from "../shared/Container";
import StarterKit from "@tiptap/starter-kit";
import { useLocation, useNavigate } from "react-router-dom";
import type { SourceReviewItem } from "../../_services/draft.service";
import { Button } from "@/components/ui/button";
import { container, fadeUp } from "@/lib/motion";

type LocationState = {
  items?: SourceReviewItem[];
};

function escapeHtml(str: string) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default function DraftEditor() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const [title, setTitle] = useState("Untitled draft");
  const [hideAllTitles, setHideAllTitles] = useState(false);
  const items = useMemo(() => state?.items ?? [], [state?.items]);

  const initialHtml = useMemo(() => {
    return items
      .map((it) => {
        const name = (it.name ?? "Untitled file").trim();
        const txt = (it.fullText ?? "").trim();

        if (!txt) {
          return `<h3>${escapeHtml(name)}</h3><p></p>`;
        }

        const body = txt
          .split(/\n{2,}/g)
          .map((p) => p.trim())
          .filter(Boolean)
          .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br/>")}</p>`)
          .join("");

        return `<h3>${escapeHtml(name)}</h3>${body}<p></p>`;
      })
      .join("");
  }, [items]);

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialHtml,
  });

  if (!items.length) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-[560px] bg-white rounded-2xl border p-6">
          <h1 className="text-xl font-semibold mb-2">Draft editor</h1>
          <p className="text-sm text-[#616161] mb-6">
            No sources found. Go back and upload sources again.
          </p>
          <Button onClick={() => navigate("/review-sources")}>Go back</Button>
        </div>
      </main>
    );
  }

  return (
    <Container>
      {/* Banner — visible when source titles are globally hidden */}
      {hideAllTitles && (
        <div className="flex justify-end pb-2 sm:pr-2">
          <p className="font-mono uppercase sm:text-[13px] text-[11px] tracking-[-1px] text-[#292d32]">
            Section titles are off.{" "}
            <button
              type="button"
              onClick={() => setHideAllTitles(false)}
              className="text-[#000faf] underline underline-offset-2 hover:opacity-80 cursor-pointer"
            >
              Turn them on
            </button>
          </p>
        </div>
      )}

      <motion.main
        className="min-h-screen bg-[#EFEFEF] sm:rounded-[12px] mb-12 sm:text-[15px] text-[13px] overflow-hidden"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fadeUp}>
          <TopBar title={title} editor={editor} setTitle={setTitle} />
        </motion.div>

        <motion.div variants={fadeUp}>
          <EDITOR
            items={items}
            editor={editor}
            hideAllTitles={hideAllTitles}
            onHideAllTitles={() => setHideAllTitles(true)}
          />
        </motion.div>
      </motion.main>
    </Container>
  );
}
