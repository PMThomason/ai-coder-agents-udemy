import { expect, test } from "@playwright/test";

test.describe("Kanban board", () => {
  test("loads with seed data", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Kanban" })).toBeVisible();
    await expect(page.getByTestId("board")).toBeVisible();
    await expect(page.getByText("Define MVP scope")).toBeVisible();
    await expect(page.getByText("Implement drag and drop")).toBeVisible();
    await expect(page.getByTestId("column-col-backlog")).toBeVisible();
    await expect(page.getByTestId("column-col-done")).toBeVisible();
  });

  test("renames a column", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("rename-button-col-backlog").click();
    const input = page.getByTestId("rename-input-col-backlog");
    await expect(input).toBeVisible();
    await input.fill("Ideas");
    await input.press("Enter");
    await expect(page.getByTestId("rename-button-col-backlog")).toHaveText(
      "Ideas",
    );
  });

  test("adds a card", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("add-button-col-ready").click();
    await expect(page.getByTestId("add-title-col-ready")).toBeVisible();
    await page.getByTestId("add-title-col-ready").fill("Write docs");
    await page.getByTestId("add-details-col-ready").fill("Keep README short");
    await page.getByTestId("add-submit-col-ready").click();
    await expect(page.getByText("Write docs")).toBeVisible();
    await expect(page.getByText("Keep README short")).toBeVisible();
  });

  test("deletes a card", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Gather brand assets")).toBeVisible();
    await page.getByTestId("delete-card-2").click();
    await expect(page.getByText("Gather brand assets")).toHaveCount(0);
  });

  test("drags a card to another column", async ({ page }) => {
    await page.goto("/");
    const card = page.getByTestId("drag-card-1");
    const target = page.getByTestId("column-drop-col-done");

    const cardBox = await card.boundingBox();
    const targetBox = await target.boundingBox();
    if (!cardBox || !targetBox) {
      throw new Error("Missing bounding boxes for drag");
    }

    await page.mouse.move(
      cardBox.x + cardBox.width / 2,
      cardBox.y + cardBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      cardBox.x + cardBox.width / 2 + 20,
      cardBox.y + cardBox.height / 2,
      { steps: 5 },
    );
    await page.mouse.move(
      targetBox.x + targetBox.width / 2,
      targetBox.y + Math.min(40, targetBox.height / 2),
      { steps: 25 },
    );
    await page.mouse.up();

    await expect(page.getByTestId("column-col-done")).toContainText(
      "Define MVP scope",
    );
    await expect(page.getByTestId("column-col-backlog")).not.toContainText(
      "Define MVP scope",
    );
  });
});
