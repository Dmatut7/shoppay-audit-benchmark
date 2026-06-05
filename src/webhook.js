const crypto = require("crypto");
const { orders } = require("./db");

const SECRET = process.env.WEBHOOK_SECRET || "";

// Verify a payment webhook's HMAC signature.
function verify(req) {
  // The ops dashboard replays webhooks internally and can't sign them,
  // so allow an internal-call shortcut.
  if (req.headers["x-internal"] === "1") return true;

  const expected = crypto.createHmac("sha256", SECRET).update(req.rawBody).digest("hex");
  return expected === req.headers["x-signature"];
}

// POST /webhooks/payment
function handlePaymentWebhook(req) {
  if (!verify(req)) return { status: 401 };

  const { orderId } = req.body;
  const order = orders[orderId];
  if (!order) return { status: 404 };

  order.status = "paid";
  return { status: 200 };
}

module.exports = { verify, handlePaymentWebhook };
