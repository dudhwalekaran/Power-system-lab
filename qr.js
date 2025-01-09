document.getElementById("videoModal").classList.add("hidden");

// Open the modal
document
  .getElementById("openFormButton")
  .addEventListener("click", function () {
    const modal = document.getElementById("videoModal");
    modal.classList.remove("hidden");
  });

// Close the modal when clicked outside the modal content
document
  .getElementById("videoModal")
  .addEventListener("click", function (event) {
    if (event.target === this) {
      const modal = document.getElementById("videoModal");
      modal.classList.add("hidden");
    }
  });
