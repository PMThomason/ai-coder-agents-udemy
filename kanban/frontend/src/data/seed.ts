import type { Board } from "@/lib/types";

export const seedBoard: Board = {
  columns: [
    {
      id: "col-backlog",
      title: "Backlog",
      cards: [
        {
          id: "card-1",
          title: "Define MVP scope",
          details: "Confirm must-have features for the first release.",
        },
        {
          id: "card-2",
          title: "Gather brand assets",
          details: "Collect logo, palette, and typography guidelines.",
        },
      ],
    },
    {
      id: "col-ready",
      title: "Ready",
      cards: [
        {
          id: "card-3",
          title: "Wireframe board layout",
          details: "Sketch columns, card anatomy, and empty states.",
        },
      ],
    },
    {
      id: "col-progress",
      title: "In Progress",
      cards: [
        {
          id: "card-4",
          title: "Implement drag and drop",
          details: "Move cards between columns with smooth feedback.",
        },
        {
          id: "card-5",
          title: "Polish column rename",
          details: "Inline edit with keyboard-friendly save and cancel.",
        },
      ],
    },
    {
      id: "col-review",
      title: "Review",
      cards: [
        {
          id: "card-6",
          title: "Design review pass",
          details: "Check spacing, contrast, and motion consistency.",
        },
      ],
    },
    {
      id: "col-done",
      title: "Done",
      cards: [
        {
          id: "card-7",
          title: "Project scaffolding",
          details: "Next.js app, tooling, and base styles in place.",
        },
      ],
    },
  ],
};
