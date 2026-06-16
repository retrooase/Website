"use client";

import { Trash2 } from "lucide-react";
import { deleteProduct } from "../actions";

export function DeleteButton({ id }: { id: string }) {
  const deleteAction = deleteProduct.bind(null, id);
  return (
    <form
      action={deleteAction}
      onSubmit={(e) => {
        if (!confirm("Produkt wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="w-full flex items-center gap-2 px-3 py-2.5 font-sans text-sm border border-border text-red-600 hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-900/20 transition-colors"
      >
        <Trash2 size={14} />
        Produkt löschen
      </button>
    </form>
  );
}
