const { test } = require("node:test");
const assert = require("node:assert");
const path = require("node:path");

function loadFresh() {
  const srcDir = `${path.sep}src${path.sep}`;
  for (const key of Object.keys(require.cache)) {
    if (key.includes(srcDir)) delete require.cache[key];
  }

  return {
    db: require("../src/db"),
    orders: require("../src/orders"),
    pricing: require("../src/pricing"),
    usersApi: require("../src/users"),
    wallet: require("../src/wallet"),
    webhook: require("../src/webhook"),
  };
}

test("baseline exposes over-refund behavior", () => {
  const { orders } = loadFresh();

  const res = orders.refund({
    params: { id: "o1" },
    body: { amount: 150 },
    user: { id: "u1", role: "user", email: "alice@example.com" },
  });

  assert.equal(res.status, 200);
  assert.equal(res.refunded, 150);
});

test("baseline exposes refund for a pending order", () => {
  const { orders } = loadFresh();

  const res = orders.refund({
    params: { id: "o2" },
    body: { amount: 10 },
    user: { id: "u2", role: "user", email: "bob@example.com" },
  });

  assert.equal(res.status, 200);
  assert.equal(res.refunded, 10);
});

test("baseline exposes cross-user order reads", () => {
  const { orders } = loadFresh();

  const res = orders.getOrder({
    params: { id: "o2" },
    user: { id: "u1", role: "user", email: "alice@example.com" },
  });

  assert.equal(res.status, 200);
  assert.equal(res.order.userId, "u2");
});

test("baseline exposes cross-user refunds", () => {
  const { orders } = loadFresh();

  const res = orders.refund({
    params: { id: "o1" },
    body: { amount: 25 },
    user: { id: "u2", role: "user", email: "bob@example.com" },
  });

  assert.equal(res.status, 200);
  assert.equal(res.refunded, 25);
});

test("baseline exposes privileged profile field overwrite", () => {
  const { db, usersApi } = loadFresh();

  const res = usersApi.updateProfile({
    user: { id: "u1" },
    body: { id: "u2", name: "Mallory", role: "admin", balance: 9999 },
  });

  assert.equal(res.status, 200);
  assert.equal(db.users.u1.id, "u2");
  assert.equal(db.users.u1.role, "admin");
  assert.equal(db.users.u1.balance, 9999);
});

test("baseline exposes unsigned webhook bypass", () => {
  const { db, webhook } = loadFresh();

  const res = webhook.handlePaymentWebhook({
    headers: { "x-internal": "1" },
    rawBody: JSON.stringify({ orderId: "o2" }),
    body: { orderId: "o2" },
  });

  assert.equal(res.status, 200);
  assert.equal(db.orders.o2.status, "paid");
});

test("baseline exposes tax-before-discount calculation", () => {
  const { pricing } = loadFresh();

  const total = pricing.computeTotal([{ price: 100, qty: 1 }], { amount: 20 });

  assert.equal(total, 90);
  assert.notEqual(total, 88);
});

test("baseline exposes wallet double-spend under concurrent deductions", async () => {
  const { db, wallet } = loadFresh();

  const [first, second] = await Promise.all([
    wallet.deduct("u1", 80),
    wallet.deduct("u1", 80),
  ]);

  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  assert.equal(db.users.u1.balance, -60);
});
