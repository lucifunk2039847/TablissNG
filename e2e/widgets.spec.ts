import { expect, test } from "@playwright/test";

import {
  addWidget,
  closeSettings,
  expandWidgetSettings,
  widgetSettingsFieldset,
} from "./helpers";

test.describe("Widgets", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders the default time and greeting widgets", async ({ page }) => {
    // .Time matches both the wrapper and the inner .Time.Digital clock.
    await expect(page.locator(".Time").first()).toBeVisible();
    await expect(page.locator(".Greeting")).toBeVisible();
  });

  test("adds a tally counter widget and increments the count", async ({
    page,
  }) => {
    await addWidget(page, "widget/tallyCounter");
    await closeSettings(page);

    const counter = page.locator(".TallyCounter");
    await expect(counter).toBeVisible();

    const count = counter.locator(".count");
    await expect(count).toHaveText("0");

    // The last control button is the increment button.
    await counter.locator(".control-btn").last().click();
    await expect(count).toHaveText("1");
  });

  test("adds a stopwatch widget and starts, stops and resets it", async ({
    page,
  }) => {
    await addWidget(page, "widget/stopwatch");
    await closeSettings(page);

    const stopwatch = page.locator(".Stopwatch");
    const toggle = stopwatch.locator(".toggle");
    const elapsed = stopwatch.locator(".elapsed");

    // Starts collapsed with no time shown until the stopwatch is used
    await expect(elapsed).toHaveCount(0);
    await expect(toggle.locator(".time")).toHaveCount(0);
    await toggle.click();
    await expect(elapsed).toHaveText("00:00:00");

    await stopwatch.locator('button[title="Start"]').click();
    await expect(elapsed).not.toHaveText("00:00:00", { timeout: 3000 });

    await stopwatch.locator('button[title="Stop"]').click();
    const stopped = await elapsed.textContent();
    await page.waitForTimeout(1500);
    await expect(elapsed).toHaveText(stopped ?? "");

    // Collapsing keeps the elapsed time visible on the toggle
    await toggle.click();
    await expect(elapsed).toHaveCount(0);
    await expect(toggle.locator(".time")).toHaveText(stopped ?? "");

    await toggle.click();
    await stopwatch.locator('button[title="Reset"]').click();
    await expect(elapsed).toHaveText("00:00:00");
  });

  test("calculator computes results and records history", async ({ page }) => {
    await addWidget(page, "widget/calculator");
    await closeSettings(page);

    const calculator = page.locator(".Calculator");
    await expect(calculator.locator(".keys")).toHaveCount(0);
    await calculator.locator(".toggle").click();

    const key = (label: string) =>
      calculator.locator(".keys button", { hasText: label }).first();

    await key("7").click();
    await key("×").click();
    await key("6").click();
    await key("=").click();
    await expect(calculator.locator(".display")).toHaveText("42");
    await expect(calculator.locator(".history .entry")).toHaveText([
      "7 × 6 = 42",
    ]);

    // Keyboard input works while focused
    await calculator.locator(".body").focus();
    await page.keyboard.type("9/3");
    await page.keyboard.press("Enter");
    await expect(calculator.locator(".display")).toHaveText("3");
    await expect(calculator.locator(".history .entry")).toHaveCount(2);

    await calculator.locator(".toggle").click();
    await expect(calculator.locator(".keys")).toHaveCount(0);
  });

  test("timer counts down, pauses and shows the finished message", async ({
    page,
  }) => {
    await addWidget(page, "widget/timer");
    await closeSettings(page);

    const timer = page.locator(".Timer");
    await timer.locator(".toggle").click();

    await timer.getByTitle("Hours").fill("0");
    await timer.getByTitle("Minutes").fill("0");
    await timer.getByTitle("Seconds").fill("3");
    await timer.locator('button[title="Start"]').click();

    const remaining = timer.locator(".remaining");
    await expect(remaining).toHaveText(/^00:0[123]$/);

    await timer.locator('button[title="Pause"]').click();
    const paused = await remaining.textContent();
    await page.waitForTimeout(1500);
    await expect(remaining).toHaveText(paused ?? "");

    await timer.locator('button[title="Start"]').click();
    await expect(timer.locator(".message")).toHaveText("Time's up!", {
      timeout: 5000,
    });

    // The message stays until reset, which restores the entered duration
    await timer.locator('button[title="Reset"]').click();
    await expect(timer.locator(".message")).toHaveCount(0);
    await expect(timer.getByTitle("Seconds")).toHaveValue("3");
  });

  test("removes a widget from settings", async ({ page }) => {
    await addWidget(page, "widget/tallyCounter");
    const fieldset = widgetSettingsFieldset(page, "Tally Counter");
    await expect(fieldset).toHaveCount(1);

    await fieldset.locator('button[title="Remove widget"]').click();
    await expect(fieldset).toHaveCount(0);
  });

  test("notes widget stores typed text", async ({ page }) => {
    await addWidget(page, "widget/notes");
    await closeSettings(page);

    const notes = page.locator(".Notes");
    await expect(notes).toBeVisible();

    await notes.click();
    const editor = page.locator(".Notes [contenteditable]");
    await expect(editor).toBeVisible();
    await editor.click();
    await page.keyboard.type("Hello e2e");
    await page.keyboard.press("Escape");

    await expect(notes).toContainText("Hello e2e");
  });

  test("todo widget adds an item", async ({ page }) => {
    await addWidget(page, "widget/todo");
    await closeSettings(page);

    const todo = page.locator(".Todo");
    await expect(todo).toBeVisible();

    // The bottom control row's first link adds a new item.
    await todo.locator("> div").nth(1).locator("a").first().click();
    await expect(page.locator(".TodoItem")).toHaveCount(1);
    // The empty editable span has zero size (reported hidden) — focus directly.
    await page.locator(".TodoItem [contenteditable]").focus();
    await page.keyboard.type("Buy milk");
    await page.keyboard.press("Enter");

    await expect(page.locator(".TodoItem")).toContainText("Buy milk");
  });

  test("custom text widget shows the configured text", async ({ page }) => {
    await addWidget(page, "widget/customText");
    await expandWidgetSettings(page, "Custom Text");
    await widgetSettingsFieldset(page, "Custom Text")
      .locator("textarea")
      .fill("Hello e2e");
    await closeSettings(page);

    await expect(page.locator(".CustomText h3")).toHaveText("Hello e2e");
  });

  test("search widget renders a search input", async ({ page }) => {
    await addWidget(page, "widget/search");
    await closeSettings(page);

    await expect(page.locator('.Search input[type="text"]')).toBeVisible();
  });

  test("reorders widgets in settings", async ({ page }) => {
    await addWidget(page, "widget/tallyCounter");
    await addWidget(page, "widget/notes");

    const order = () =>
      page
        .locator("fieldset.Widget h4")
        .allTextContents()
        .then((texts) => texts.map((t) => t.trim()));

    // The default time/greeting widgets also appear in the list.
    let names = await order();
    expect(names.indexOf("Tally Counter")).toBeLessThan(names.indexOf("Notes"));

    await widgetSettingsFieldset(page, "Tally Counter")
      .locator('button[title="Move widget down"]')
      .click();

    names = await order();
    expect(names.indexOf("Tally Counter")).toBeGreaterThan(
      names.indexOf("Notes"),
    );
  });
});
