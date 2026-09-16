import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders EV Range Lab without starter metadata", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /EV Range Lab/);
  assert.match(html, /Know your real-world EV range/);
  assert.match(html, /\/brand\/ev-mark-wide\.png/);
  assert.match(html, /Not an OEM warranty range/);
  assert.doesNotMatch(html, /\/brands\//);
  assert.doesNotMatch(html, /Gas tank equivalent|GAS VS\. EV/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});
