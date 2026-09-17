"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card as CardType } from "@/lib/types";

type CardProps = {
  card: CardType;
  onDelete: (cardId: string) => void;
};

export function Card({ card, onDelete }: CardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      data-testid={`card-${card.id}`}
      className={`group rounded-lg border border-white/70 bg-white p-3 shadow-sm transition-shadow duration-200 ${
        isDragging
          ? "z-10 scale-[1.02] opacity-90 shadow-lg ring-2 ring-[var(--accent-yellow)]"
          : "hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          className="min-w-0 flex-1 cursor-grab text-left active:cursor-grabbing"
          aria-label={`Drag ${card.title}`}
          data-testid={`drag-${card.id}`}
          {...attributes}
          {...listeners}
        >
          <h3 className="font-[family-name:var(--font-heading)] text-sm font-semibold text-[var(--dark-navy)]">
            {card.title}
          </h3>
          {card.details ? (
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--gray-text)]">
              {card.details}
            </p>
          ) : null}
        </button>
        <button
          type="button"
          aria-label={`Delete ${card.title}`}
          data-testid={`delete-${card.id}`}
          className="shrink-0 rounded px-1.5 py-0.5 text-xs text-[var(--gray-text)] transition-colors hover:bg-red-50 hover:text-red-600"
          onClick={() => onDelete(card.id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
