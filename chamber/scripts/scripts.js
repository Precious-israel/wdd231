document.addEventListener("DOMContentLoaded", () => {
  setupHamburgerMenu();
  highlightCurrentNav();
  updateFooterDates();
  setupViewToggle();
  loadMembers();
  loadWeather();
});

// === Hamburger Menu ===
function setupHamburgerMenu() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const navItems = navLinks?.querySelectorAll("a");

  hamburger?.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("show");
    hamburger.innerHTML = isOpen ? "&times;" : "&#9776;";
    navLinks.classList.add(isOpen ? "animate-slide-in" : "animate-slide-out");
    navLinks.classList.remove(isOpen ? "animate-slide-out" : "animate-slide-in");

    navItems?.forEach((link, index) => {
      link.style.animation = isOpen ? `fadeInUp 0.4s ease forwards ${index * 0.15}s` : "";
    });

    if (!isOpen) {
      navLinks.addEventListener("animationend", () => {
        if (!navLinks.classList.contains("show")) {
          navLinks.classList.remove("show");
        }
      }, { once: true });
    }
  });
}

// === Navigation Wayfinding ===
function highlightCurrentNav() {
  const currentPage = location.pathname.split("/").pop();
  document.querySelectorAll(".nav-links a").forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPage || (href === "index.html" && currentPage === "")) {
      link.classList.add("active");
    }
  });
}

// === Footer Date Info ===
function updateFooterDates() {
  const yearSpan = document.getElementById("year");
  const lastModifiedSpan = document.getElementById("lastModified");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  if (lastModifiedSpan) lastModifiedSpan.textContent = document.lastModified;
}

// === Member Directory ===
async function loadMembers() {
  const container = document.getElementById("member-directory");
  try {
    const res = await fetch("data/members.json");
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const members = await res.json();
    renderMembers(container, members);
    renderSpotlights(members);
  } catch (error) {
    console.error("Failed to load members:", error);
    container.innerHTML = "<p>Error loading members data.</p>";
  }
}

function renderMembers(container, members) {
  if (!container) return;
  container.innerHTML = "";
  members.forEach(member => {
    const card = document.createElement("section");
    card.innerHTML = `
      <div class="member-info">
        <h2>${member.name}</h2>
        <img src="${member.image}" alt="${member.name} logo" loading="lazy" />
        <p><strong>Email:</strong> ${member.email}</p>
        <p><strong>Phone:</strong> ${member.phone}</p>
        <p><strong>Website:</strong> <a href="${member.website}" target="_blank">Visit Website</a></p>
        <p><strong>Membership:</strong> ${getMembershipLevel(member.membership)}</p>
      </div>`;
    container.appendChild(card);
  });
}

// === View Toggle ===
function setupViewToggle() {
  const container = document.getElementById("member-directory");
  const gridBtn = document.getElementById("grid-view");
  const listBtn = document.getElementById("list-view");

  gridBtn?.addEventListener("click", () => {
    container.classList.add("grid-view");
    container.classList.remove("list-view");
  });

  listBtn?.addEventListener("click", () => {
    container.classList.add("list-view");
    container.classList.remove("grid-view");
  });
}

// === Weather Section ===
function loadWeather() {
  const apiKey = "deeb8c3f3000b0bf5086e73cdb73247f";
  const city = "Osogbo,NG";
  const units = "metric";

  fetchWeather(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`);
  fetchForecast(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`);
}

function fetchWeather(url) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      document.getElementById("current-temp").textContent = `Temperature: ${data.main.temp} °C`;
      document.getElementById("current-desc").textContent = `Condition: ${data.weather[0].description}`;
      const icon = document.getElementById("current-icon");
      icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      icon.alt = data.weather[0].description;
    })
    .catch(err => console.error("Weather error:", err));
}

function fetchForecast(url) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const forecastEl = document.getElementById("forecast");
      if (!forecastEl) return;
      forecastEl.innerHTML = "";

      const daily = {};
      data.list.forEach(entry => {
        const [date, time] = entry.dt_txt.split(" ");
        if (time === "12:00:00" && !daily[date]) {
          daily[date] = entry;
        }
      });

      Object.entries(daily).slice(0, 3).forEach(([date, entry]) => {
        const iconUrl = `https://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`;
        const li = document.createElement("li");
        li.innerHTML = `${date}: ${entry.main.temp} °C <img src="${iconUrl}" alt="${entry.weather[0].description}" />`;
        forecastEl.appendChild(li);
      });
    })
    .catch(err => console.error("Forecast error:", err));
}

// === Spotlights ===
function renderSpotlights(members) {
  const eligible = members.filter(m => m.membership === 2 || m.membership === 3);
  const spotlightCount = Math.floor(Math.random() * 2) + 2;
  const selected = shuffle(eligible).slice(0, spotlightCount);
  const container = document.getElementById("spotlightContainer") || document.getElementById("spotlight");
  if (!container) return;

  container.innerHTML = "";
  selected.forEach(member => {
    const card = document.createElement("div");
    card.className = "spotlight-card";
    card.innerHTML = `
      <img src="${member.logo || member.image}" alt="${member.name} logo" loading="lazy" />
      <h3>${member.name}</h3>
      <p><strong>Phone:</strong> ${member.phone}</p>
      <p><strong>Address:</strong> ${member.address || ""}</p>
      <p><a href="${member.website}" target="_blank">Visit Website</a></p>
      <p class="level">${getMembershipLevel(member.membership)} Member</p>
    `;
    container.appendChild(card);
  });
}

// === Helpers ===
function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getMembershipLevel(num) {
  return num === 3 ? "Gold" : num === 2 ? "Silver" : "Member";
}

// === Modal Logic ===
function showModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'flex';
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'none';
}

window.addEventListener("click", (e) => {
  document.querySelectorAll(".modal").forEach(modal => {
    if (e.target === modal) modal.style.display = "none";
  });
});

// === Form Auto-Fill and Display ===
window.onload = () => {
  const timestamp = document.getElementById("timestamp");
  if (timestamp) timestamp.value = new Date().toISOString();
  displayFormData();
};

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    firstName: params.get("firstName") || '',
    lastName: params.get("lastName") || '',
    email: params.get("email") || '',
    phone: params.get("phone") || '',
    organization: params.get("organization") || '',
    timestamp: params.get("timestamp") || ''
  };
}

function displayFormData() {
  const data = getQueryParams();
  const display = document.getElementById("formDataDisplay");
  if (!display) return;

  const formattedTime = data.timestamp && !isNaN(new Date(data.timestamp))
    ? new Date(data.timestamp).toLocaleString()
    : 'Not provided';

  display.innerHTML = `
    <p><strong>First Name:</strong> ${data.firstName}</p>
    <p><strong>Last Name:</strong> ${data.lastName}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Mobile Number:</strong> ${data.phone}</p>
    <p><strong>Organization Name:</strong> ${data.organization}</p>
    <p><strong>Timestamp:</strong> ${formattedTime}</p>
  `;
}
//  directory
document.addEventListener("DOMContentLoaded", () => {
  // Visit message logic
  const sidebar = document.getElementById("visit-message");
  const lastVisit = localStorage.getItem("lastVisit");
  const now = Date.now();

  if (!lastVisit) {
    sidebar.textContent = "Welcome! Let us know if you have any questions.";
  } else {
    const difference = now - parseInt(lastVisit);
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    sidebar.textContent = days < 1
      ? "Back so soon! Awesome!"
      : `You last visited ${days} ${days === 1 ? "day" : "days"} ago.`;
  }

  localStorage.setItem("lastVisit", now);

  // Load discover cards
  fetch("data/discover.json")
    .then(res => res.json())
    .then(data => {
      const section = document.querySelector(".discover-grid");
      data.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
          <h2>${item.title}</h2>
          <figure><img src="${item.image}" alt="${item.title}" loading="lazy" /></figure>
          <address>${item.address}</address>
          <p>${item.description}</p>
          <button>Learn More</button>
        `;
        section.appendChild(card);
      });
    })
    .catch(error => console.error("Error loading discover.json:", error));
});



