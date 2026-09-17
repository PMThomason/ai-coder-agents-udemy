import { describe, expect, it } from "vitest";
import {
  addCard,
  deleteCard,
  moveCard,
  renameColumn,
} from "@/lib/board-state";
import type { Board } from "@/lib/types";

const sampleBoard: Board = {
  columns: [
    {
      id: "col-a",
      title: "A",
      cards: [
        { id: "c1", title: "One", details: "first" },
        { id: "c2", title: "Two", details: "second" },
      ],
    },
    {
      id: "col-b",
      title: "B",
      cards: [{ id: "c3", title: "Three", details: "third" }],
    },
    { id: "col-c", title: "C", cards: [] },
    { id: "col-d", title: "D", cards: [] },
    { id: "col-e", title: "E", cards: [] },
  ],
};

describe("board-state", () => {
  it("renames a column", () => {
    const next = renameColumn(sampleBoard, "col-a", "Backlog");
    expect(next.columns[0].title).toBe("Backlog");
    expect(next.columns).toHaveLength(5);
  });

  it("adds a card to a column", () => {
    const next = addCard(sampleBoard, "col-c", "New card", "Details here");
    expect(next.columns[2].cards).toHaveLength(1);
    expect(next.columns[2].cards[0].title).toBe("New card");
    expect(next.columns[2].cards[0].details).toBe("Details here");
  });

  it("deletes a card", () => {
    const next = deleteCard(sampleBoard, "c2");
    expect(next.columns[0].cards.map((card) => card.id)).toEqual(["c1"]);
  });

  it("moves a card between columns", () => {
    const next = moveCard(sampleBoard, "c1", "col-b", 0);
    expect(next.columns[0].cards.map((card) => card.id)).toEqual(["c2"]);
    expect(next.columns[1].cards.map((card) => card.id)).toEqual([
      "c1",
      "c3",
    ]);
  });

  it("reorders a card within a column", () => {
    const next = moveCard(sampleBoard, "c1", "col-a", 2);
    expect(next.columns[0].cards.map((card) => card.id)).toEqual([
      "c2",
      "c1",
    ]);
  });

  it("moves a card into an empty column", () => {
    const next = moveCard(sampleBoard, "c3", "col-c", 0);
    expect(next.columns[1].cards).toHaveLength(0);
    expect(next.columns[2].cards.map((card) => card.id)).toEqual(["c3"]);
  });
});
