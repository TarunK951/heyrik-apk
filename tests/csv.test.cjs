const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const context = { exports: {} };
vm.runInNewContext(
  ts.transpileModule(fs.readFileSync("src/csv.ts", "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText,
  context,
);
const parse = (text) =>
  JSON.parse(JSON.stringify(context.exports.parseCSV(text)));
test("imports Windows line endings and trims header whitespace", () =>
  assert.deepEqual(
    parse("name, email,phone\r\nJamie,j@example.com,+919999999999"),
    [{ name: "Jamie", email: "j@example.com", phone: "+919999999999" }],
  ));
test("keeps quoted commas, escaped quotes, and multiline values", () =>
  assert.deepEqual(
    parse('name,email,phone\n"Jamie, ""Jay""","first\nlast@example.com",123'),
    [{ name: 'Jamie, "Jay"', email: "first\nlast@example.com", phone: "123" }],
  ));
test("rejects a missing name header and unclosed quotes", () => {
  assert.throws(() => parse("email\na@example.com"));
  assert.throws(() => parse('name\n"Jamie'));
});
test("drops blank rows and unnamed contacts without losing named rows", () =>
  assert.deepEqual(parse("name,email\n\n,empty@example.com\nJamie,"), [
    { name: "Jamie", email: "" },
  ]));
