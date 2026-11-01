import type { Block } from "@/content/types";
import { slugifyHeading } from "@/lib/utils";
import { CodeBlock } from "./code-block";
import { Diagram } from "./diagrams";

const toneClass = {
  info: "border-accent/40 bg-accent/8",
  tip: "border-accent-2/40 bg-accent-2/8",
  warn: "border-warn/50 bg-warn/8",
  danger: "border-danger/50 bg-danger/8",
} as const;

export function headingIds(blocks: Block[]): { id: string; text: string }[] {
  return blocks.filter((block): block is { type: "h2"; text: string } => block.type === "h2").map((block) => ({
    id: slugifyHeading(block.text),
    text: block.text,
  }));
}

export function LessonBody({ blocks }: { blocks: Block[] }) {
  return (
    <div>
      {blocks.map((block, index) => {
        if (block.type === "h2") {
          const id = slugifyHeading(block.text);
          return (
            <h2 id={id} key={index} className="mt-10 scroll-mt-24 text-xl font-semibold tracking-tight text-fg">
              {block.text}
            </h2>
          );
        }
        if (block.type === "h3") {
          return (
            <h3 key={index} className="mt-6 text-base font-semibold text-fg">
              {block.text}
            </h3>
          );
        }
        if (block.type === "p") {
          return (
            <p key={index} className="mt-3 text-pretty text-base leading-7 text-fg">
              {block.text}
            </p>
          );
        }
        if (block.type === "ul" || block.type === "ol") {
          const List = block.type === "ul" ? "ul" : "ol";
          return (
            <List
              key={index}
              className={`mt-3 space-y-1.5 pl-5 text-base leading-7 text-fg ${block.type === "ul" ? "list-disc" : "list-decimal"}`}
            >
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </List>
          );
        }
        if (block.type === "callout") {
          return (
            <aside key={index} className={`mt-4 rounded-xl border px-4 py-3 ${toneClass[block.tone]}`}>
              <p className="text-sm font-semibold text-fg">{block.title}</p>
              <p className="mt-1 text-sm leading-6 text-fg">{block.text}</p>
            </aside>
          );
        }
        if (block.type === "code") {
          return <CodeBlock key={index} code={block.code} lang={block.lang} title={block.title} note={block.note} />;
        }
        if (block.type === "table") {
          return (
            <div key={index} className="mt-4 overflow-x-auto rounded-xl border border-border">
              {block.caption ? <p className="border-b border-border px-3 py-2 text-xs text-muted">{block.caption}</p> : null}
              <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
                <thead className="bg-surface-2 text-fg">
                  <tr>
                    {block.headers.map((header) => (
                      <th key={header} className="px-3 py-2 font-semibold">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-t border-border">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-3 py-2 align-top text-fg">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (block.type === "diagram") return <Diagram key={index} id={block.id} />;
        return null;
      })}
    </div>
  );
}
