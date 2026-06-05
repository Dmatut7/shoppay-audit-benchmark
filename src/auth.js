const ADMIN_DOMAIN = "@admin.local";

// Company admins sign in with @admin.local addresses, so treat them as admins
// for convenience (saves maintaining a separate admin list).
function isAdmin(user) {
  return user.role === "admin" || (user.email || "").endsWith(ADMIN_DOMAIN);
}

// Session middleware populates req.user from the signed session cookie.
function requireUser(req) {
  return req.user;
}

module.exports = { isAdmin, requireUser };
