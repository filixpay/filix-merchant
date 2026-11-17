const fs = require("fs");

const en = JSON.parse(
  fs.readFileSync("D:/open/filix-merchant/i18n-work/en-batches/C.json", "utf8")
);
const ko = JSON.parse(
  fs.readFileSync("D:/open/filix-merchant/messages/ko.json", "utf8")
);

function leafPaths(o, p = "") {
  if (Array.isArray(o)) {
    let keys = [];
    o.forEach((v, i) => {
      const np = p + "[" + i + "]";
      if (typeof v === "object" && v !== null) keys = keys.concat(leafPaths(v, np));
      else keys.push(np);
    });
    return keys;
  }
  if (typeof o !== "object" || o === null) return [p];
  let keys = [];
  for (const k of Object.keys(o)) {
    keys = keys.concat(leafPaths(o[k], p ? p + "." + k : k));
  }
  return keys;
}

function getAt(o, path) {
  const tokens = [];
  path.replace(/([^.\[\]]+)|\[(\d+)\]/g, (_, key, idx) => {
    tokens.push(key !== undefined ? key : Number(idx));
  });
  let cur = o;
  for (const t of tokens) {
    if (cur == null) return undefined;
    cur = cur[t];
  }
  return cur;
}

const enKeys = leafPaths(en);
const koPages = { Pages: ko.Pages };
const koKeys = leafPaths(koPages);

const enSet = new Set(enKeys);
const koSet = new Set(koKeys);
const missing = [...enSet].filter((k) => !koSet.has(k));
const extra = [...koSet].filter((k) => !enSet.has(k));

let identical = 0;
let empty = 0;
const identicalSamples = [];
for (const k of enKeys) {
  const ev = getAt(en, k);
  const kv = getAt(koPages, k);
  if (kv === undefined || kv === null || kv === "") empty++;
  else if (typeof ev === "string" && typeof kv === "string" && ev === kv) {
    identical++;
    if (identicalSamples.length < 40) identicalSamples.push(k + ": " + ev.slice(0, 80));
  }
}

console.log("en leaves", enKeys.length);
console.log("ko leaves", koKeys.length);
console.log("missing", missing.length);
console.log("extra", extra.length);
console.log("identical to en", identical);
console.log("empty", empty);
if (missing.length) console.log("missing sample", missing.slice(0, 20));
if (extra.length) console.log("extra sample", extra.slice(0, 20));
console.log("identical samples:\n" + identicalSamples.join("\n"));
console.log("sample products", JSON.stringify(ko.Pages.products, null, 2));
console.log("sample common", JSON.stringify(ko.Pages.common, null, 2));
console.log(
  "sample payment_platform.hero",
  ko.Pages.payment_platform.hero_title,
  "|",
  ko.Pages.payment_platform.hero_desc
);
