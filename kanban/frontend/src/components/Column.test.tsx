import { DndContext } from "@dnd-kit/core";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { Column } from "@/components/Column";
import type { Column as ColumnType } from "@/lib/types";

const column: ColumnType = {
  id: "col-ready",
  title: "Ready",
  cards: [
    {
      id: "card-1",
      title: "Ship UI",
      details: "Polish the board",
    },
  ],
};

function renderWithDnd(ui: ReactNode) {
  return render(<DndContext>{ui}</DndContext>);
}

describe("Column", () => {
  it("renames a column on blur", async () => {
    const user = userEvent.setup();
    const onRename = vi.fn();

    renderWithDnd(
      <Column
        column={column}
        onRename={onRename}
        onAddCard={vi.fn()}
        onDeleteCard={vi.fn()}
      />,
    );

    await user.click(screen.getByTestId("rename-button-col-ready"));
    const input = screen.getByTestId("rename-input-col-ready");
    await user.clear(input);
    await user.type(input, "Up Next");
    await user.tab();

    expect(onRename).toHaveBeenCalledWith("col-ready", "Up Next");
  });

  it("adds a card", async () => {
    const user = userEvent.setup();
    const onAddCard = vi.fn();

    renderWithDnd(
      <Column
        column={column}
        onRename={vi.fn()}
        onAddCard={onAddCard}
        onDeleteCard={vi.fn()}
      />,
    );

    await user.click(screen.getByTestId("add-button-col-ready"));
    await user.type(screen.getByTestId("add-title-col-ready"), "New task");
    await user.type(
      screen.getByTestId("add-details-col-ready"),
      "More detail",
    );
    await user.click(screen.getByTestId("add-submit-col-ready"));

    expect(onAddCard).toHaveBeenCalledWith(
      "col-ready",
      "New task",
      "More detail",
    );
  });

  it("deletes a card", async () => {
    const user = userEvent.setup();
    const onDeleteCard = vi.fn();

    renderWithDnd(
      <Column
        column={column}
        onRename={vi.fn()}
        onAddCard={vi.fn()}
        onDeleteCard={onDeleteCard}
      />,
    );

    await user.click(screen.getByTestId("delete-card-1"));
    expect(onDeleteCard).toHaveBeenCalledWith("card-1");
  });
});
