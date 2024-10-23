const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

menuToggle.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// This script will automatically log the guest out after 10 minutes
window.onload = function () {
  const guestMode = document.body.getAttribute("data-guest-mode") === "true";

  if (guestMode) {
    setTimeout(function () {
      alert("Your session as a guest has expired. You will now be logged out.");
      window.location.href = "/";
    }, 10 * 60 * 1000);
  }
};
