"use client";

import { Trash2 } from "lucide-react";
import { deleteBlogPost } from "../actions";

export function DeleteBlogButton({ id }: { id: string }) {
  const deleteAction = deleteBlogPost.bind(null, id);
  return (
    <form
      action={deleteAction}
      onSubmit={(e) => {
        if (!confirm("Artikel wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="flex items-center gap-2 font-sans text-sm text-red-600 hover:text-red-700 transition-colors"
      >
        <Trash2 size={14} />
        Artikel löschen
      </button>
    </form>
  );
}
