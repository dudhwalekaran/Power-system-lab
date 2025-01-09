const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");
const body = document.body;
const themeToggle = document.getElementById("theme-toggle");
const navbar = document.querySelector(".navbar");
const navLinks = document.querySelectorAll(".nav-links a");
const hamburgerLines = document.querySelectorAll(".hamburger .line");

// Toggle Sidebar
hamburger.addEventListener("click", (e) => {
  sidebar.classList.toggle("open"); // Open or close the sidebar
  hamburger.classList.toggle("active"); // Animate the hamburger icon
  e.stopPropagation(); // Prevent click from propagating to the body
});

// Close Sidebar on Clicking Anywhere Outside
body.addEventListener("click", (event) => {
  const clickedInsideSidebar = sidebar.contains(event.target);
  const clickedHamburger = hamburger.contains(event.target);
  if (!clickedInsideSidebar && !clickedHamburger) {
    sidebar.classList.remove("open"); // Close the sidebar
    hamburger.classList.remove("active"); // Reset hamburger icon
  }
});

// Close Sidebar When Clicking on Any Menu Item
sidebar.addEventListener("click", () => {
  sidebar.classList.remove("open");
  hamburger.classList.remove("active");
});

// Close Sidebar When Scrolling
window.addEventListener('scroll', () => {
  if (sidebar.classList.contains('open')) {
    sidebar.classList.remove("open"); // Close the sidebar
    hamburger.classList.remove("active"); // Reset hamburger icon
  }
});

// Get the theme toggle button and body element

// Check if dark mode is saved in localStorage
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  navbar.classList.add("dark-mode");
  navLinks.forEach(link => link.classList.add("dark-mode"));
  themeToggle.classList.add("dark-mode");
  themeToggle.innerHTML = '<img src="/public/light.png" alt="Light Mode Icon" class="theme-icon">'; // Change icon to sun
} else {
  themeToggle.innerHTML = '<img src="/public/dark.png" alt="Dark Mode Icon" class="theme-icon">'; // Change icon to moon
}

// Add click event listener to the theme toggle button
themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  navbar.classList.toggle("dark-mode");
  navLinks.forEach(link => link.classList.toggle("dark-mode"));
  themeToggle.classList.toggle("dark-mode");

  // Toggle the theme icon (moon/sun)
  if (body.classList.contains("dark-mode")) {
    themeToggle.innerHTML = '<img src="/public/light.png" alt="Light Mode Icon" class="theme-icon">';
    localStorage.setItem("theme", "dark"); // Save dark mode preference
  } else {
    themeToggle.innerHTML = '<img src="/public/dark.png" alt="Dark Mode Icon" class="theme-icon">';
    localStorage.setItem("theme", "light"); // Save light mode preference
  }
  
    // Toggle the hamburger color dynamically
    // if (body.classList.contains("dark")) {
    //   hamburgerLines.forEach(line => {
    //     line.style.backgroundColor = "white"; // Dark mode: Hamburger lines black
    //   });
    // } else {
    //   hamburgerLines.forEach(line => {
    //     line.style.backgroundColor = "black"; // Light mode: Hamburger lines white
    //   });
    // }
});

