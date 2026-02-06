const quickForm = document.getElementById("quickForm");
const nudgeForm = document.getElementById("nudgeForm");
const recommendations = document.getElementById("recommendations");
const resultsSummary = document.getElementById("resultsSummary");
const radiusValue = document.getElementById("radiusValue");
const ideaCount = document.getElementById("ideaCount");
const chatForm = document.getElementById("chatForm");
const chatLog = document.getElementById("chatLog");
const startNow = document.getElementById("startNow");
const seeIdeas = document.getElementById("seeIdeas");

const baseIdeas = [
  {
    title: "Ceramics studio pop-up",
    type: "Creative",
    vibe: "cozy",
    budget: "mid",
    summary: "Try a wheel-throwing workshop with warm tea and soft music.",
    link: "https://www.yelp.com/search?find_desc=ceramics+class",
  },
  {
    title: "Indie bookstore + journaling nook",
    type: "Solo ritual",
    vibe: "cozy",
    budget: "free",
    summary: "Pick a new book and journal in a sunny corner for 30 minutes.",
    link: "https://www.google.com/maps/search/indie+bookstore",
  },
  {
    title: "Evening jazz lounge",
    type: "Date night",
    vibe: "social",
    budget: "high",
    summary: "Live music, candlelight, and a cozy mocktail flight.",
    link: "https://www.yelp.com/search?find_desc=jazz+club",
  },
  {
    title: "Park picnic with strawberries",
    type: "Chill Saturday",
    vibe: "cozy",
    budget: "free",
    summary: "Bring a blanket, strawberries, and a playlist for a soft reset.",
    link: "https://www.google.com/maps/search/parks",
  },
  {
    title: "Women-led founders pop-up market",
    type: "Community",
    vibe: "social",
    budget: "low",
    summary: "Browse handmade goods and chat with local makers.",
    link: "https://www.eventbrite.com/",
  },
  {
    title: "Sunset yoga + mocktails",
    type: "Wellness",
    vibe: "active",
    budget: "mid",
    summary: "Stretch out with a flow class followed by a cozy lounge.",
    link: "https://www.yelp.com/search?find_desc=yoga+studio",
  },
  {
    title: "Botanical watercolor workshop",
    type: "Creative",
    vibe: "creative",
    budget: "mid",
    summary: "Paint florals with a guided artist and take home your piece.",
    link: "https://www.eventbrite.com/",
  },
  {
    title: "Neighborhood café + pastry crawl",
    type: "Foodie",
    vibe: "social",
    budget: "low",
    summary: "Hop between two cafés for cappuccinos and something sweet.",
    link: "https://www.google.com/maps/search/cafe",
  },
];

const chatReplies = [
  "That sounds dreamy. Want me to mix a cozy ritual with one social stop?",
  "I can build a two-hour plan or a full-day flow. Which feels better?",
  "If you want to feel grounded, I’d start with a slow morning café + journaling.",
  "We can keep it low spend: picnic + free gallery + sunset walk. 🌿",
];

const updateRadiusLabel = (value) => {
  radiusValue.textContent = `${value} miles`;
};

const personalizeIdeas = (answers) => {
  const interestText = `${answers.interests} ${answers.hobbies} ${answers.newHobbies}`.toLowerCase();
  const budget = answers.budget;
  const vibe = answers.vibe;

  let ideas = baseIdeas.filter((idea) => {
    const matchesBudget =
      budget === "high" || idea.budget === budget || (budget === "mid" && idea.budget !== "high");
    const matchesVibe = vibe ? idea.vibe === vibe || idea.vibe === "cozy" : true;
    return matchesBudget && matchesVibe;
  });

  if (interestText.includes("ceramic") || interestText.includes("pottery")) {
    ideas = [baseIdeas[0], ...ideas];
  }
  if (interestText.includes("book") || interestText.includes("journal")) {
    ideas = [baseIdeas[1], ...ideas];
  }
  if (interestText.includes("yoga") || interestText.includes("wellness")) {
    ideas = [baseIdeas[5], ...ideas];
  }

  const uniqueIdeas = Array.from(new Map(ideas.map((idea) => [idea.title, idea])).values());
  return uniqueIdeas.slice(0, 6);
};

const renderIdeas = (ideas) => {
  recommendations.innerHTML = "";
  ideas.forEach((idea) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <span class="tag">${idea.type}</span>
      <h3>${idea.title}</h3>
      <p>${idea.summary}</p>
      <a href="${idea.link}" target="_blank" rel="noreferrer">Open details</a>
    `;
    recommendations.appendChild(card);
  });
  ideaCount.textContent = `${ideas.length} ready`;
};

quickForm.addEventListener("input", (event) => {
  if (event.target.name === "radius") {
    updateRadiusLabel(event.target.value);
  }
});

quickForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(quickForm);
  const answers = {
    city: formData.get("city"),
    radius: formData.get("radius"),
    vibe: formData.get("vibe"),
  };
  updateRadiusLabel(answers.radius);
  resultsSummary.textContent = `Searching ${answers.radius} miles around ${answers.city} for ${
    answers.vibe
  } ideas.`;
  const ideas = personalizeIdeas({ interests: "", hobbies: "", newHobbies: "", ...answers });
  renderIdeas(ideas);
});

nudgeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(nudgeForm);
  const answers = Object.fromEntries(formData.entries());
  answers.vibe = document.querySelector("select[name='vibe']").value;

  const ideas = personalizeIdeas(answers);
  renderIdeas(ideas);

  resultsSummary.textContent = `Customized for ${answers.interests} within your ${
    answers.budget
  } budget. Gentle ideas + local gems ready.`;
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(chatForm);
  const message = formData.get("message");
  if (!message) return;

  const userMessage = document.createElement("div");
  userMessage.className = "message user";
  userMessage.textContent = message;
  chatLog.appendChild(userMessage);

  const aiMessage = document.createElement("div");
  aiMessage.className = "message ai";
  aiMessage.textContent = chatReplies[Math.floor(Math.random() * chatReplies.length)];
  chatLog.appendChild(aiMessage);

  chatLog.scrollTop = chatLog.scrollHeight;
  chatForm.reset();
});

startNow.addEventListener("click", () => {
  document.getElementById("questionnaire").scrollIntoView({ behavior: "smooth" });
});

seeIdeas.addEventListener("click", () => {
  renderIdeas(baseIdeas.slice(0, 4));
});

renderIdeas(baseIdeas.slice(0, 3));
