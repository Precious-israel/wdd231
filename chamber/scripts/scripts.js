document.addEventListener("DOMContentLoaded", () => {
  // ========== HAMBURGER MENU ==========
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const navItems = navLinks.querySelectorAll("a");

  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("show");

    if (isOpen) {
      hamburger.innerHTML = "&times;"; // X icon
      navLinks.classList.add("animate-slide-in");
      navLinks.classList.remove("animate-slide-out");

      // Staggered fade-in animation for each nav item
      navItems.forEach((link, index) => {
        link.style.animation = `fadeInUp 0.4s ease forwards ${index * 0.15}s`;
      });
    } else {
      hamburger.innerHTML = "&#9776;"; // hamburger icon
      navLinks.classList.add("animate-slide-out");
      navLinks.classList.remove("animate-slide-in");

      // Remove individual animations on close
      navItems.forEach((link) => {
        link.style.animation = "";
      });

      // After slide-out animation ends, hide the menu
      navLinks.addEventListener(
        "animationend",
        () => {
          if (!navLinks.classList.contains("show")) {
            navLinks.classList.remove("show");
          }
        },
        { once: true }
      );
    }
  });

  // ========== WAYFINDING ==========
  const currentPage = location.pathname.split("/").pop();
  const navLinksItems = document.querySelectorAll(".nav-links a");

  navLinksItems.forEach((link) => {
    const linkHref = link.getAttribute("href");
    if (linkHref === currentPage || (linkHref === "index.html" && currentPage === "")) {
      link.classList.add("active");
    }
  });

  // ========== FOOTER DATES ==========
  const yearSpan = document.getElementById("year");
  const lastModifiedSpan = document.getElementById("lastModified");

  if (yearSpan && lastModifiedSpan) {
    yearSpan.textContent = new Date().getFullYear();
    lastModifiedSpan.textContent = document.lastModified;
  }

  // ========== MEMBER DIRECTORY ==========
  const container = document.getElementById("member-directory");

  async function getMembers() {
    try {
      const response = await fetch("data/members.json");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const members = await response.json();
      displayMembers(members);
      renderSpotlights(members);
    } catch (error) {
      console.error("Failed to load members:", error);
      if (container) container.innerHTML = "<p>Error loading members data.</p>";
    }
  }

  function displayMembers(members) {
    if (!container) return;
    container.innerHTML = "";

    members.forEach((member) => {
      const card = document.createElement("section");
      card.innerHTML = `
        <div class="member-info">
          <h2>${member.name}</h2>
          <img src="${member.image}" alt="${member.name} logo" loading="lazy" />
          <p><strong>Email:</strong> ${member.email}</p>
          <p><strong>Phone:</strong> ${member.phone}</p>
          <p><strong>Website:</strong> <a href="${member.website}" target="_blank" rel="noopener noreferrer">Visit Website</a></p>
          <p><strong>Membership:</strong> ${getMembershipLevel(member.membership)}</p>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // ========== VIEW TOGGLE ==========
  const gridViewBtn = document.getElementById("grid-view");
  const listViewBtn = document.getElementById("list-view");

  if (gridViewBtn && listViewBtn) {
    gridViewBtn.addEventListener("click", () => {
      container.classList.add("grid-view");
      container.classList.remove("list-view");
    });

    listViewBtn.addEventListener("click", () => {
      container.classList.add("list-view");
      container.classList.remove("grid-view");
    });
  }

  // Load members on page load
  getMembers();

  // ========== WEATHER SECTION ==========
  const apiKey = "deeb8c3f3000b0bf5086e73cdb73247f";
  const city = "Osogbo,NG";
  const units = "metric";

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`;

  // Fetch current weather
  fetch(currentWeatherUrl)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      if (!data || !data.main || !data.weather) throw new Error("Malformed weather data");

      const tempEl = document.getElementById("current-temp");
      const descEl = document.getElementById("current-desc");
      const iconEl = document.getElementById("current-icon");

      if (tempEl) tempEl.textContent = `Temperature: ${data.main.temp} °C`;
      if (descEl) descEl.textContent = `Condition: ${data.weather[0].description}`;
      if (iconEl) {
        const iconCode = data.weather[0].icon;
        iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        iconEl.alt = data.weather[0].description || "Weather Icon";
      }
    })
    .catch((err) => console.error("Error fetching current weather:", err));

  // Fetch 3-day forecast at 12:00 PM each day
  fetch(forecastUrl)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      const forecastEl = document.getElementById("forecast");
      if (!forecastEl) return;

      forecastEl.innerHTML = ""; // Clear old forecast

      const daily = {};

      data.list.forEach((entry) => {
        const [date, time] = entry.dt_txt.split(" ");
        if (time === "12:00:00" && !daily[date]) {
          daily[date] = entry;
        }
      });

      const forecastDays = Object.entries(daily).slice(0, 3);
      forecastDays.forEach(([date, entry]) => {
        const li = document.createElement("li");
        const iconCode = entry.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        li.innerHTML = `${date}: ${entry.main.temp} °C <img src="${iconUrl}" alt="${entry.weather[0].description}" style="vertical-align:middle;" />`;
        forecastEl.appendChild(li);
      });
    })
    .catch((err) => console.error("Error fetching forecast:", err));
});

// ========== SPOTLIGHTS ==========
function renderSpotlights(members) {
  const eligibleMembers = members.filter((m) => m.membership === 2 || m.membership === 3);
  const spotlightCount = Math.floor(Math.random() * 2) + 2; // 2 or 3 spotlights
  const selected = shuffle(eligibleMembers).slice(0, spotlightCount);

  const container = document.getElementById("spotlightContainer") || document.getElementById("spotlight");
  if (!container) return;
  container.innerHTML = ""; // clear previous

  selected.forEach((member) => {
    const card = document.createElement("div");
    card.className = "spotlight-card";
    card.innerHTML = `
      <img src="${member.logo || member.image}" alt="${member.name} logo" loading="lazy" />
      <h3>${member.name}</h3>
      <p><strong>Phone:</strong> ${member.phone}</p>
      <p><strong>Address:</strong> ${member.address || ""}</p>
      <p><a href="${member.website}" target="_blank" rel="noopener noreferrer">Visit Website</a></p>
      <p class="level">${getMembershipLevel(member.membership)} Member</p>
    `;
    container.appendChild(card);
  });
}

// Helper: Shuffle array (Fisher-Yates)
function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Map numeric membership to readable form
function getMembershipLevel(num) {
  return num === 3 ? "Gold" : num === 2 ? "Silver" : "Member";
}
