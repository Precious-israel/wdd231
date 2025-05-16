
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("memberContainer");

  async function getMembers() {
    const response = await fetch("data/members.json");
    const members = await response.json();
    displayMembers(members);
  }

  function displayMembers(members) {
    container.innerHTML = "";

    members.forEach(member => {
      const card = document.createElement("section");
      card.innerHTML = `
        <img src="${member.image}" alt="${member.name} logo" loading="lazy" />
        <h2>${member.name}</h2>
        <p>${member.address}</p>
        <p>${member.phone}</p>
        <a href="${member.website}" target="_blank">Visit Website</a>
        <p>Membership: ${["Member", "Silver", "Gold"][member.membership - 1]}</p>
      `;
      container.appendChild(card);
    });
  }

  document.getElementById("gridView").addEventListener("click", () => {
    container.classList.add("grid");
    container.classList.remove("list");
  });

  document.getElementById("listView").addEventListener("click", () => {
    container.classList.add("list");
    container.classList.remove("grid");
  });

  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("lastModified").textContent = document.lastModified;

  getMembers();
});
