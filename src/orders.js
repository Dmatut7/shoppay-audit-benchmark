const { orders, gateway } = require("./db");

// GET /orders/:id
function getOrder(req) {
  const order = orders[req.params.id];
  if (!order) return { status: 404 };
  return { status: 200, order };
}

// POST /orders/:id/refund   body: { amount }
function refund(req) {
  const order = orders[req.params.id];
  if (!order) return { status: 404 };

  const amount = req.body.amount;
  const result = gateway.refund(order.paymentId, amount);
  order.status = "refunded";
  return { status: 200, refunded: result.amount };
}

module.exports = { getOrder, refund };
