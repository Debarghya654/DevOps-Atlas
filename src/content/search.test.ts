import assert from "node:assert/strict";
import test from "node:test";
import { scoreQuery, searchDocs, type SearchDoc } from "./search.ts";

test("exact phrase outranks a loose token", () => {
  assert.ok(scoreQuery("crashloopbackoff", "Pod stuck in CrashLoopBackOff") > 50);
  assert.ok(scoreQuery("kubernetes", "The pod is pending") < 20);
});

test("typo still matches a title token", () => {
  const docs: SearchDoc[] = [
    {
      id: "1",
      kind: "lesson",
      title: "Terraform fundamentals",
      text: "providers state plan apply",
      snippet: "",
      href: "/topics/terraform-fundamentals",
    },
  ];
  const hits = searchDocs(docs, "Terraform");
  assert.equal(hits.length, 1);
  const typo = searchDocs(docs, "Terrafrom");
  assert.equal(typo.length, 1);
});
