// In-memory stores + external service stubs (so the service is self-contained).
const orders = {
  o1: { id: "o1", userId: "u1", status: "paid", capturedAmount: 100, paymentId: "pay_1" },
  o2: { id: "o2", userId: "u2", status: "pending", capturedAmount: 0, paymentId: null },
};

const users = {
  u1: { id: "u1", name: "Alice", email: "alice@example.com", role: "user", balance: 100 },
  u2: { id: "u2", name: "Bob", email: "bob@example.com", role: "user", balance: 50 },
};

// External payment gateway + ledger (stubbed).
const gateway = {
  refund: (paymentId, amount) => ({ paymentId, amount, ok: true }),
};
const ledger = {
  record: async (userId, delta) => ({ userId, delta }),
};

module.exports = { orders, users, gateway, ledger };
