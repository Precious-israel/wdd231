// Set the current year dynamically
document.getElementById("currentYear").textContent = new Date().getFullYear();

// Set last modified date
document.querySelector(".modified").textContent = `Last Modified: ${document.lastModified}`;