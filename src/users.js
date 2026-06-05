const { users } = require("./db");

// PATCH /users/me — update the current user's profile.
function updateProfile(req) {
  const user = users[req.user.id];
  if (!user) return { status: 404 };
  Object.assign(user, req.body);
  return { status: 200, user };
}

module.exports = { updateProfile };
