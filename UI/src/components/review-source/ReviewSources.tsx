import { toast } from "sonner";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import Container from "../shared/Container";
import { ResourceList } from "./ResourceList";
import type { Variants } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import type { SourceReviewItem } from "../../_services/draft.service";

type LocationState = {
  data?: {
    items: SourceReviewItem[];
    totalWords: number;
    totalWordsLabel: string;
  };
};

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

export default function ReviewSources() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const initial = state?.data;

  const [items, setItems] = useState<SourceReviewItem[]>(initial?.items ?? []);

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    (initial?.items ?? []).forEach((it) => (map[it.id] = false));
    return map;
  });

  const totals = useMemo(() => {
    const totalWords = items.reduce((sum, it) => sum + (it.wordCount ?? 0), 0);
    return {
      totalWords,
      totalWordsLabel: `~${totalWords.toLocaleString()} WORDS`,
    };
  }, [items]);

  if (!initial) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          className="w-full max-w-[560px] bg-white rounded-2xl border p-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.h1 variants={fadeUp} className="text-xl font-semibold mb-2">
            Review sources
          </motion.h1>

          <motion.p variants={fadeUp} className="text-sm text-[#616161] mb-6">
            No upload data on this page (this can happen if you refresh). Go
            back and upload your sources again.
          </motion.p>

          <motion.button
            variants={fadeUp}
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded-xl bg-black text-white"
          >
            Go back
          </motion.button>
        </motion.div>
      </main>
    );
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
    toast.success("Removed");
  };

  return (
    <Container>
      <main className="min-h-screen flex items-start justify-center sm:p-6">
        <motion.div
          className="w-full sm:max-w-[600px]"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.h1 variants={fadeUp} className="sm:text-[24px] font-medium">
            Review sources
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="sm:text-[18px] text-[14px] mb-16"
          >
            Take a quick look to be sure everything is fine before we generate
            your draft
          </motion.p>

          {/* Header */}
          <motion.div
            variants={fadeUp}
            className="flex items-center justify-between mb-4"
          >
            <h1 className="sm:text-[20px] font-medium text-[16px]">
              Source list
            </h1>
            <button
              type="button"
              className="sm:text-[18px] text-[14px] px-3 py-1.5 rounded-full border border-[#CFCFCF] bg-white hover:bg-[#F6F6F6]"
              onClick={() => navigate(-1)}
            >
              Add another file +
            </button>
          </motion.div>

          {/* files */}
          <motion.div variants={fadeUp}>
            <ResourceList
              items={items}
              setItems={setItems}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              removeItem={removeItem}
            />
          </motion.div>

          {/* Footer */}
          <motion.div
            variants={fadeUp}
            className="mt-16 flex items-center justify-between sm:text-[20px] text-[14px] text-[#6B6B6B]"
          >
            <p style={{ fontFamily: '"Geist Mono", sans-serif' }}>
              TOTAL CONTENT
            </p>
            <p style={{ fontFamily: '"Geist Mono", sans-serif' }}>
              {totals.totalWordsLabel}
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="flex items-center justify-center sm:my-16 my-10"
          >
            <button
              className="sm:text-[18px] text-[14px] px-6 py-4 disabled:bg-[#A2A2A2] disabled:cursor-not-allowed bg-black cursor-pointer text-white rounded-2xl"
              onClick={() =>
                navigate("/draft-editor", {
                  state: {
                    items,
                  },
                })
              }
            >
              {"Generate draft"}
            </button>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="text-center sm:text-[16px] mb-5 text-[14px]"
            style={{ fontFamily: '"Geist Mono", sans-serif' }}
          >
            SOURCES WITH ERRORS WILL BE SKIPPED. YOU CAN ALSO MANUALLY REORDER
            FILES
          </motion.p>
        </motion.div>
      </main>
    </Container>
  );
}
