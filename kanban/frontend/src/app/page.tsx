"use client";

import dynamic from "next/dynamic";

const Board = dynamic(
  () => import("@/components/Board").then((mod) => mod.Board),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[20rem] items-center justify-center text-[var(--gray-text)]">
        Loading board...
      </div>
    ),
  },
);

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[90rem] flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
      <Board />
    </main>
  );
}
