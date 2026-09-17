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
  const normalizedHtml = html.replaceAll("<!-- -->", "");
  assert.match(html, /EV Range Lab/);
  assert.match(html, /Explore, compare, and find the EV that fits your life/);
  assert.match(html, /Find the EV that <em>fits your life\.<\/em>/);
  assert.match(html, /Your EV decision laboratory/);
  assert.match(html, /Learn · Compare · Choose/);
  assert.match(html, /\/brand\/ev-mark-wide\.png/);
  assert.match(html, /\/icons\/favicon-32-v6\.png/);
  assert.match(html, /\/brands\/tesla\.svg/);
  assert.match(html, /Stated range/);
  assert.doesNotMatch(html, /Stops needed/);
  assert.match(normalizedHtml, /2026 Tesla Model 3 Long Range AWD — 346 mi stated/);
  assert.match(html, /Your conditions/);
  assert.match(html, /not an OEM warranty range/);
  assert.match(html, /Landscape/);
  assert.doesNotMatch(html, /Home charging|Net elevation|id="terrain"/);
  assert.doesNotMatch(html, /Gas tank equivalent|GAS VS\. EV/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});
