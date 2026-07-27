"use client";

import { useState } from "react";
import type { Comment } from "@/data/types";
import { useSignupPrompt } from "@/components/providers/app-providers";

// Visual only for now — no backend to persist comments against yet.
export function CommentBox({ initialComments }: { initialComments: Comment[] }) {
  const [comments, setComments] = useState(initialComments);
  const [draft, setDraft] = useState("");
  const { triggerAuthPrompt } = useSignupPrompt();

  function submitDraft() {
    if (!draft.trim()) return;
    setComments((prev) => [...prev, { name: "Tú", timeAgo: "ahora", text: draft.trim() }]);
    setDraft("");
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border p-4.5">
      {comments.map((comment, i) => (
        <div key={i} className="flex gap-3">
          <div className="grid size-10 flex-none place-items-center rounded-full bg-peach font-bold text-brand-deep">
            {comment.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-bold">
              {comment.name} <span className="font-normal text-ink-soft">· {comment.timeAgo}</span>
            </p>
            <p className="mt-1 text-sm text-[#3A332E]">{comment.text}</p>
          </div>
        </div>
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.trim()) return;
          triggerAuthPrompt("comentar", submitDraft);
        }}
        className="flex gap-2.5 border-t border-[#F2EEEA] pt-4"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Escribe un comentario…"
          className="min-w-0 flex-1 rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none"
        />
        <button type="submit" className="rounded-xl bg-ink px-4.5 py-2.5 text-sm font-bold text-white">
          Enviar
        </button>
      </form>
    </div>
  );
}
