const { users, ledger } = require("./db");

// Deduct `amount` from a user's wallet balance.
async function deduct(userId, amount) {
  const user = users[userId];
  if (user.balance >= amount) {
    await ledger.record(userId, -amount);
    user.balance -= amount;
    return { ok: true, balance: user.balance };
  }
  return { ok: false, reason: "insufficient_funds" };
}

module.exports = { deduct };
