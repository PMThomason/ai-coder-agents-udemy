import type { Board, Card, Column } from "@/lib/types";

function createId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function renameColumn(
  board: Board,
  columnId: string,
  title: string,
): Board {
  return {
    columns: board.columns.map((column) =>
      column.id === columnId ? { ...column, title } : column,
    ),
  };
}

export function addCard(
  board: Board,
  columnId: string,
  title: string,
  details: string,
): Board {
  const card: Card = {
    id: createId("card"),
    title: title.trim(),
    details: details.trim(),
  };

  return {
    columns: board.columns.map((column) =>
      column.id === columnId
        ? { ...column, cards: [...column.cards, card] }
        : column,
    ),
  };
}

export function deleteCard(board: Board, cardId: string): Board {
  return {
    columns: board.columns.map((column) => ({
      ...column,
      cards: column.cards.filter((card) => card.id !== cardId),
    })),
  };
}

function findCardLocation(
  board: Board,
  cardId: string,
): { columnIndex: number; cardIndex: number } | null {
  for (let columnIndex = 0; columnIndex < board.columns.length; columnIndex++) {
    const cardIndex = board.columns[columnIndex].cards.findIndex(
      (card) => card.id === cardId,
    );
    if (cardIndex !== -1) {
      return { columnIndex, cardIndex };
    }
  }
  return null;
}

export function moveCard(
  board: Board,
  cardId: string,
  targetColumnId: string,
  targetIndex: number,
): Board {
  const source = findCardLocation(board, cardId);
  if (!source) return board;

  const columns: Column[] = board.columns.map((column) => ({
    ...column,
    cards: [...column.cards],
  }));

  const [card] = columns[source.columnIndex].cards.splice(source.cardIndex, 1);
  const targetColumnIndex = columns.findIndex(
    (column) => column.id === targetColumnId,
  );
  if (targetColumnIndex === -1) return board;

  let insertIndex = targetIndex;
  if (
    source.columnIndex === targetColumnIndex &&
    source.cardIndex < targetIndex
  ) {
    insertIndex = targetIndex - 1;
  }

  insertIndex = Math.max(
    0,
    Math.min(insertIndex, columns[targetColumnIndex].cards.length),
  );
  columns[targetColumnIndex].cards.splice(insertIndex, 0, card);

  return { columns };
}
