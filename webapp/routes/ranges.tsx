import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import { useState } from "react";
import { Layout } from "../layout";

export const Route = createFileRoute("/ranges")({
  component: RangesPage,
});

// row-major, with positive going up and to the left. I.e.
//
// A3o -> row=2, col=12

type PokerRange = number[][];

const CardValues = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "J",
  "Q",
  "K",
  "A",
];

function RangesPage() {
  const [range, setRange] = useState<PokerRange>(
    [...Array(13)].map(() => [...Array(13)].map(() => 0)),
  );

  const [clickDown, setClickDown] = useState(false);

  const setRangeValue = ({
    r,
    c,
    value,
  }: {
    r?: number | null;
    c?: number | null;
    value: number;
  }) => {
    setRange((x) => {
      return x.map((row, rowIdx) =>
        row.map((prevVal, colIdx) => {
          if (rowIdx !== (r ?? rowIdx)) return prevVal;
          if (colIdx !== (c ?? colIdx)) return prevVal;

          return value;
        }),
      );
    });
  };

  const setRangeValueSquare = ({
    minR,
    maxR,
    minC,
    maxC,
    value,
  }: {
    minR: number | null;
    maxR: number | null;
    minC: number | null;
    maxC: number | null;
    value: number;
  }) => {
    setRange((x) => {
      return x.map((row, rowIdx) =>
        row.map((prevVal, colIdx) => {
          if (minR !== null && rowIdx < minR) return prevVal;
          if (colIdx !== (c ?? colIdx)) return prevVal;

          return value;
        }),
      );
    });
  };

  return (
    <Layout>
      {[...Array(13).keys()].map((rowIdxNeg) => {
        const rowIdx = 12 - rowIdxNeg;
        const row = range[rowIdx];
        const rowAllValue = row.reduce(
          (agg: number | null, left: number): number | null => {
            if (agg !== left) return null;
            return agg;
          },
          row[0],
        );

        return (
          <div key={`row-${rowIdx}`} className="flex">
            <div
              key={`cell-${rowIdx}-all`}
              className={clsx(
                "w-12 h-12 flex justify-center items-center",

                {
                  "bg-black": row.every((v) => v === 0),
                  "bg-red-500": row.every((v) => v === 1),
                  "bg-green-500": row.every((v) => v === -1),
                },
              )}
            >
              <button
                className="w-8 h-8 text-center align-middle border rounded-none"
                onClick={() => {
                  setRangeValue({
                    r: rowIdx,
                    value:
                      rowAllValue === null ? 1 : ((rowAllValue + 2) % 3) - 1,
                  });
                }}
              >
                {CardValues[rowIdx]}
              </button>
            </div>
            {[...Array(13).keys()].map((colIdxNeg) => {
              const colIdx = 12 - colIdxNeg;
              const value = row[colIdx];

              return (
                <button
                  key={`cell-${rowIdx}-${colIdx}`}
                  className={clsx(
                    "w-12 h-12 text-center align-middle border rounded-none",
                    {
                      "bg-black": value === 0,
                      "bg-red-500": value === 1,
                      "bg-green-500": value === -1,
                    },
                  )}
                  onClick={() => {
                    setRangeValue({
                      r: rowIdx,
                      c: colIdx,
                      value: ((value + 2) % 3) - 1,
                    });
                  }}
                >
                  {CardValues[Math.max(rowIdx, colIdx)]}
                  {CardValues[Math.min(rowIdx, colIdx)]}
                  {rowIdx > colIdx ? "s" : rowIdx < colIdx ? "o" : ""}
                </button>
              );
            })}{" "}
          </div>
        );
      })}
    </Layout>
  );
}
