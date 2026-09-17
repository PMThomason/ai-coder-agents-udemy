"use client";

import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useState,
} from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card } from "@/components/Card";
import type { Column as ColumnType } from "@/lib/types";

type ColumnProps = {
  column: ColumnType;
  onRename: (columnId: string, title: string) => void;
  onAddCard: (columnId: string, title: string, details: string) => void;
  onDeleteCard: (cardId: string) => void;
};

export function Column({
  column,
  onRename,
  onAddCard,
  onDeleteCard,
}: ColumnProps) {
  const [editing, setEditing] = useState(false);
  const [titleDraft, setTitleDraft] = useState(column.title);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDetails, setNewDetails] = useState("");

  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  useEffect(() => {
    setTitleDraft(column.title);
  }, [column.title]);

  function commitRename() {
    const next = titleDraft.trim() || column.title;
    setTitleDraft(next);
    setEditing(false);
    if (next !== column.title) {
      onRename(column.id, next);
    }
  }

  function handleTitleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      commitRename();
    }
    if (event.key === "Escape") {
      setTitleDraft(column.title);
      setEditing(false);
    }
  }

  function handleAddSubmit(event: FormEvent) {
    event.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    onAddCard(column.id, title, newDetails);
    setNewTitle("");
    setNewDetails("");
    setAdding(false);
  }

  return (
    <section
      data-testid={`column-${column.id}`}
      className={`flex min-h-[28rem] w-72 shrink-0 flex-col rounded-xl border bg-white/55 p-3 backdrop-blur-sm transition-colors duration-200 ${
        isOver
          ? "border-[var(--blue-primary)] bg-[var(--blue-primary)]/5"
          : "border-white/80"
      }`}
    >
      <header className="mb-3 border-b border-[var(--accent-yellow)]/40 pb-2">
        {editing ? (
          <input
            autoFocus
            value={titleDraft}
            aria-label="Column title"
            data-testid={`rename-input-${column.id}`}
            className="w-full rounded border border-[var(--blue-primary)] bg-white px-2 py-1 font-[family-name:var(--font-heading)] text-sm font-semibold text-[var(--dark-navy)] outline-none"
            onChange={(event) => setTitleDraft(event.target.value)}
            onBlur={commitRename}
            onKeyDown={handleTitleKeyDown}
          />
        ) : (
          <button
            type="button"
            data-testid={`rename-button-${column.id}`}
            className="w-full text-left font-[family-name:var(--font-heading)] text-sm font-semibold tracking-wide text-[var(--dark-navy)] transition-colors hover:text-[var(--blue-primary)]"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setEditing(true)}
          >
            {column.title}
          </button>
        )}
        <p className="mt-1 text-xs text-[var(--gray-text)]">
          {column.cards.length} {column.cards.length === 1 ? "card" : "cards"}
        </p>
      </header>

      <div
        ref={setNodeRef}
        data-testid={`column-drop-${column.id}`}
        className="flex flex-1 flex-col gap-2 overflow-y-auto pr-0.5"
      >
        <SortableContext
          items={column.cards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.cards.map((card) => (
            <Card key={card.id} card={card} onDelete={onDeleteCard} />
          ))}
        </SortableContext>
      </div>

      <div className="mt-3">
        {adding ? (
          <form
            onSubmit={handleAddSubmit}
            data-testid={`add-form-${column.id}`}
            className="animate-[fadeIn_180ms_ease-out] space-y-2 rounded-lg border border-[var(--blue-primary)]/20 bg-white p-2"
          >
            <input
              required
              autoFocus
              value={newTitle}
              placeholder="Card title"
              aria-label="Card title"
              data-testid={`add-title-${column.id}`}
              className="w-full rounded border border-slate-200 px-2 py-1.5 text-sm text-[var(--dark-navy)] outline-none focus:border-[var(--blue-primary)]"
              onChange={(event) => setNewTitle(event.target.value)}
            />
            <textarea
              value={newDetails}
              placeholder="Details"
              aria-label="Card details"
              data-testid={`add-details-${column.id}`}
              rows={2}
              className="w-full resize-none rounded border border-slate-200 px-2 py-1.5 text-sm text-[var(--dark-navy)] outline-none focus:border-[var(--blue-primary)]"
              onChange={(event) => setNewDetails(event.target.value)}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                data-testid={`add-submit-${column.id}`}
                className="rounded-md bg-[var(--purple-secondary)] px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
              >
                Add card
              </button>
              <button
                type="button"
                className="rounded-md px-3 py-1.5 text-xs text-[var(--gray-text)] hover:bg-slate-100"
                onClick={() => {
                  setAdding(false);
                  setNewTitle("");
                  setNewDetails("");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            data-testid={`add-button-${column.id}`}
            className="w-full rounded-md border border-dashed border-[var(--blue-primary)]/40 px-3 py-2 text-left text-sm text-[var(--blue-primary)] transition-colors hover:border-[var(--blue-primary)] hover:bg-[var(--blue-primary)]/5"
            onClick={() => setAdding(true)}
          >
            + Add a card
          </button>
        )}
      </div>
    </section>
  );
}
