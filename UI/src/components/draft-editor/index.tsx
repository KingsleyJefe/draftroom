import TopBar from "./TopBar";
import EDITOR from "./EDITOR";
import { motion } from "framer-motion";
import { useEditor } from "@tiptap/react";
import { useMemo, useState } from "react";
import Container from "../shared/Container";
import StarterKit from "@tiptap/starter-kit";
import { useLocation, useNavigate } from "react-router-dom";
import type { SourceReviewItem } from "../../_services/draft.service";
import type { Variants } from "framer-motion";
import { Button } from "@/components/ui/button";

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

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
  const items = useMemo(() => state?.items ?? [], [state?.items]);

  const initialHtml = useMemo(() => {
    return items
      .map((it) => {
        const name = (it.name ?? "Untitled file").trim();
        const txt = (it.fullText ?? "").trim();

        if (!txt) {
          return `<p><strong>${escapeHtml(name)}</strong></p><p></p>`;
        }

        // Convert the text into paragraphs (keeps user-readable spacing)
        const body = txt
          .split(/\n{2,}/g) // split by blank lines
          .map((p) => p.trim())
          .filter(Boolean)
          .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br/>")}</p>`)
          .join("");

        return `
        <p><strong>${escapeHtml(name)}</strong></p>
        ${body}
        <p></p>
      `;
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
      <motion.main
        className="min-h-screen bg-[#EFEFEF] mb-12 sm:text-[15px] text-[13px]"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Top bar */}
        <motion.div variants={fadeUp}>
          <TopBar title={title} editor={editor} setTitle={setTitle} />
        </motion.div>

        {/* Editor */}
        <motion.div variants={fadeUp}>
          <EDITOR items={items} editor={editor} />
        </motion.div>
      </motion.main>
    </Container>
  );
}
