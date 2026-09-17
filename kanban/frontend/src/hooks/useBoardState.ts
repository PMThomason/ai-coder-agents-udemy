"use client";

import { useState } from "react";
import { seedBoard } from "@/data/seed";
import {
  addCard,
  deleteCard,
  moveCard,
  renameColumn,
} from "@/lib/board-state";
import type { Board } from "@/lib/types";

export function useBoardState(initialBoard: Board = seedBoard) {
  const [board, setBoard] = useState<Board>(initialBoard);

  return {
    board,
    renameColumn: (columnId: string, title: string) => {
      setBoard((current) => renameColumn(current, columnId, title));
    },
    addCard: (columnId: string, title: string, details: string) => {
      setBoard((current) => addCard(current, columnId, title, details));
    },
    deleteCard: (cardId: string) => {
      setBoard((current) => deleteCard(current, cardId));
    },
    moveCard: (cardId: string, targetColumnId: string, targetIndex: number) => {
      setBoard((current) =>
        moveCard(current, cardId, targetColumnId, targetIndex),
      );
    },
  };
}
