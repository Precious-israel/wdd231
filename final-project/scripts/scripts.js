document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initFooterInfo();
  initModal();
  initThankYouPage();
  initSubscriptionForm();
  loadLagosSites();       // Load only once
  loadBranches();
  loadWeather();
  loadMembers();
  loadSpotlights();
});

// === Responsive Navigation ===
function initNavigation() {
  const hamburger = document.getElementById('hamburger') || document.querySelector('.hamburger');
  const navLinks = document.getElementById('navLinks') || document.querySelector('.nav-links');
  const menuToggle = document.getElementById('menu-toggle');
  const navbar = document.getElementById('navbar');

  hamburger?.addEventListener('click', () => {
    navLinks?.classList.toggle('active');
    navLinks?.classList.toggle('show');
  });

  menuToggle?.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !expanded);
    navbar?.classList.toggle('show');
  });
}

// === Footer Info (Year & Last Modified) ===
function initFooterInfo() {
  const yearSpan = document.getElementById('year');
  const lastModifiedSpan = document.getElementById('lastModified');

  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  if (lastModifiedSpan) lastModifiedSpan.textContent = document.lastModified;
}

// === Complaint Modal ===
function initModal() {
  const openModalBtn = document.getElementById("openModalBtn");
  const complaintModal = document.getElementById("complaintModal");
  const closeModalBtn = document.getElementById("closeModalBtn");

  if (openModalBtn && complaintModal && closeModalBtn) {
    openModalBtn.addEventListener("click", () => complaintModal.style.display = "block");
    closeModalBtn.addEventListener("click", () => complaintModal.style.display = "none");
    window.addEventListener("click", e => {
      if (e.target === complaintModal) complaintModal.style.display = "none";
    });
  }
}

// === Thank You Page Handler ===
function initThankYouPage() {
  const thankYouMessage = document.getElementById("thankyou-message");
  if (!thankYouMessage) return;

  const params = new URLSearchParams(window.location.search);
  const name = decodeURIComponent(params.get("name") || "Valued Customer");
  const email = decodeURIComponent(params.get("email") || "your email");
  const time = new Date().toLocaleString();

  const records = JSON.parse(localStorage.getItem("subscriptionRecords")) || [];
  records.push({ name, email, time });
  localStorage.setItem("subscriptionRecords", JSON.stringify(records));

  thankYouMessage.innerHTML = `
    <h2>Thank You, ${name}!</h2>
    <p>We've received your subscription with the email:</p>
    <p><strong>${email}</strong></p>
    <p>Subscription time:</p>
    <p><strong>${time}</strong></p>
    <p>We appreciate your interest in Edsarah Confectionary & Supermart.</p>
    <a href="index.html">Return to Home</a>
  `;
  thankYouMessage.focus();
}

// === Subscription Form ===
function initSubscriptionForm() {
  const form = document.getElementById('subscribe-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!name || !email) {
      alert('Please fill in both your name and email.');
      return;
    }

    const records = JSON.parse(localStorage.getItem('subscribers')) || [];
    if (!records.some(entry => entry.email === email)) {
      records.push({ name, email });
      localStorage.setItem('subscribers', JSON.stringify(records));
    }

    alert(`Thank you, ${name}! You've been subscribed with the email: ${email}`);
    form.reset();
  });
}

// === Load Lagos Sites ===
function loadLagosSites() {
  const locationGrid = document.getElementById("locationGrid");
  if (!locationGrid) return;

  // Clear any previously loaded content to avoid duplicates
  locationGrid.innerHTML = "";

  fetch("scripts/lagos-sites.json")
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch Lagos sites.");
      return res.json();
    })
    .then(locations => {
      locations.forEach(site => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <img src="${site.image}" alt="${site.name}">
          <div class="card-body">
            <h3>${site.name}</h3>
            <p><strong>Location:</strong> ${site.location}</p>
            <p>${site.description}</p>
          </div>`;
        locationGrid.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Error loading locations:", err);
      locationGrid.innerHTML = `<p>Unable to load beautiful sites. Please try again later.</p>`;
    });
}

// === Load Branches ===
function loadBranches() {
  const container = document.getElementById('branches-container');
  if (!container) return;

  fetch('data/branches.json')
    .then(res => res.json())
    .then(data => {
      data.forEach(branch => {
        const branchEl = document.createElement('section');
        branchEl.className = 'branch';
        branchEl.innerHTML = `<h2>${branch.name}</h2><p>${branch.address}</p>`;
        container.appendChild(branchEl);
      });
    })
    .catch(() => {
      container.innerHTML = `<p>Unable to load branches at the moment.</p>`;
    });
}

// === Load Weather Info ===
function loadWeather() {
  const apiKey = "dee629b7caae56879f8e7d4eb7c8ffaa"; // For dev only
  const city = "Lagos,NG";
  const units = "metric";

  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`;

  fetchWeather(currentUrl);
  fetchForecast(forecastUrl);
}

function fetchWeather(url) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const tempEl = document.getElementById("current-temp");
      const descEl = document.getElementById("current-desc");
      const iconEl = document.getElementById("current-icon");

      if (tempEl && descEl && iconEl) {
        tempEl.textContent = `Temperature: ${data.main.temp} °C`;
        descEl.textContent = `Condition: ${data.weather[0].description}`;
        iconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        iconEl.alt = data.weather[0].description;
      }
    })
    .catch(err => {
      console.error("Weather error:", err);
      const tempEl = document.getElementById("current-temp");
      if (tempEl) tempEl.textContent = "Unable to load weather data.";
    });
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
        li.innerHTML = `
          <span>${date}: ${entry.main.temp} °C</span>
          <img src="${iconUrl}" alt="${entry.weather[0].description}" />
        `;
        forecastEl.appendChild(li);
      });
    })
    .catch(err => {
      console.error("Forecast error:", err);
      const forecastEl = document.getElementById("forecast");
      if (forecastEl) forecastEl.innerHTML = "<li>Unable to load forecast.</li>";
    });
}

// === Load Member Directory ===
async function loadMembers() {
  const container = document.getElementById("member-directory");
  if (!container) return;

  try {
    const res = await fetch("data/members.json");
    const members = await res.json();
    renderMembers(container, members);
  } catch (error) {
    console.error("Failed to load members:", error);
    container.innerHTML = "<p>Error loading members data.</p>";
  }
}

function renderMembers(container, members) {
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

function getMembershipLevel(level) {
  return level.charAt(0).toUpperCase() + level.slice(1) + " Member";
}

// === Spotlight Members ===
function loadSpotlights() {
  const container = document.getElementById("spotlightContainer");
  if (!container) return;

  fetch("data/members.json")
    .then(res => res.json())
    .then(data => {
      data.forEach(member => {
        const card = document.createElement("div");
        card.className = "spotlight-card";
        card.innerHTML = `
          <img src="${member.image}" alt="${member.name}">
          <h3>${member.name}</h3>
          <h4>${member.position}</h4>
          <p>${member.bio}</p>`;
        container.appendChild(card);
      });
    })
    .catch(error => {
      console.error("Error fetching spotlight members:", error);
      container.innerHTML = "<p>Could not load members.</p>";
    });
}
