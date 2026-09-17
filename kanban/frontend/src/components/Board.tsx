"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState } from "react";
import { Column } from "@/components/Column";
import { useBoardState } from "@/hooks/useBoardState";
import type { Card as CardType } from "@/lib/types";

export function Board() {
  const { board, renameColumn, addCard, deleteCard, moveCard } =
    useBoardState();
  const [activeCard, setActiveCard] = useState<CardType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function findCard(cardId: string): CardType | undefined {
    for (const column of board.columns) {
      const card = column.cards.find((item) => item.id === cardId);
      if (card) return card;
    }
    return undefined;
  }

  function findColumnId(itemId: string): string | undefined {
    const asColumn = board.columns.find((column) => column.id === itemId);
    if (asColumn) return asColumn.id;

    for (const column of board.columns) {
      if (column.cards.some((card) => card.id === itemId)) {
        return column.id;
      }
    }
    return undefined;
  }

  function handleDragStart(event: DragStartEvent) {
    const card = findCard(String(event.active.id));
    setActiveCard(card ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveCard(null);
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    const sourceColumnId = findColumnId(activeId);
    const targetColumnId = findColumnId(overId);
    if (!sourceColumnId || !targetColumnId) return;

    const targetColumn = board.columns.find(
      (column) => column.id === targetColumnId,
    );
    if (!targetColumn) return;

    let targetIndex = targetColumn.cards.findIndex(
      (card) => card.id === overId,
    );
    if (targetIndex === -1) {
      targetIndex = targetColumn.cards.length;
    }

    moveCard(activeId, targetColumnId, targetIndex);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="mb-6">
        <p className="text-sm font-medium tracking-[0.18em] text-[var(--blue-primary)] uppercase">
          Project board
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-[var(--dark-navy)] sm:text-4xl">
          Kanban
        </h1>
        <div className="mt-3 h-1 w-24 rounded-full bg-[var(--accent-yellow)]" />
        <p className="mt-3 max-w-xl text-sm text-[var(--gray-text)] sm:text-base">
          One board. Five columns. Move work forward.
        </p>
      </header>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div
          data-testid="board"
          className="flex min-h-0 flex-1 gap-4 overflow-x-auto pb-4"
        >
          {board.columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              onRename={renameColumn}
              onAddCard={addCard}
              onDeleteCard={deleteCard}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCard ? (
            <article className="w-72 rounded-lg border border-[var(--accent-yellow)] bg-white p-3 shadow-xl">
              <h3 className="font-[family-name:var(--font-heading)] text-sm font-semibold text-[var(--dark-navy)]">
                {activeCard.title}
              </h3>
              {activeCard.details ? (
                <p className="mt-1.5 text-sm text-[var(--gray-text)]">
                  {activeCard.details}
                </p>
              ) : null}
            </article>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
