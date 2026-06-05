const TAX_RATE = 0.1;

// Compute the order total: subtotal, apply coupon, add tax.
function computeTotal(items, coupon) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * TAX_RATE;
  const discount = coupon ? coupon.amount : 0;
  return subtotal - discount + tax;
}

module.exports = { computeTotal };
