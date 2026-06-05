const { test } = require("node:test");
const assert = require("node:assert");
const { refund } = require("../src/orders");

// Happy-path only: a refund returns ok.
test("refund returns a refunded amount", () => {
  const res = refund({ params: { id: "o1" }, body: { amount: 50 }, user: { id: "u1" } });
  assert.equal(res.status, 200);
  assert.equal(res.refunded, 50);
});
