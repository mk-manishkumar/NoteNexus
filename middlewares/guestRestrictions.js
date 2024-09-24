export const guestRestrictions = (req, res, next) => {
  if (req.user && req.user.role === "guest") {
    res.locals.guestMode = true; // Make guestMode available in all EJS templates
  } else {
    res.locals.guestMode = false; // Explicitly set false for non-guest users
  }
  next();
};

/*


<% if (!guestMode) { %>
  <button>Edit Profile</button>
  <button>Change Password</button>
  <button>Delete Profile</button>
<% } else { %>
  <button disabled title="Not available for guest users">Edit Profile</button>
  <button disabled title="Not available for guest users">Change Password</button>
  <button disabled title="Not available for guest users">Delete Profile</button>
<% } %>


*/
