// ============================================
// 💖 Date Invitation — Frontend Logic
// ============================================

// --- Floating Hearts Background ---
(function spawnHearts() {
  const container = document.getElementById("hearts-bg");
  const heartChars = ["💕", "💗", "💖", "🩷", "🤍", "🌸"];

  function createHeart() {
    const heart = document.createElement("span");
    heart.classList.add("floating-heart");
    heart.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];
    heart.style.left = Math.random() * 100 + "%";
    heart.style.fontSize = (0.8 + Math.random() * 1.2) + "rem";
    heart.style.animationDuration = (6 + Math.random() * 8) + "s";
    heart.style.animationDelay = Math.random() * 2 + "s";
    container.appendChild(heart);

    // Remove after animation ends to avoid DOM bloat
    setTimeout(() => heart.remove(), 16000);
  }

  // Spawn hearts at intervals
  setInterval(createHeart, 700);
  // Initial burst
  for (let i = 0; i < 8; i++) setTimeout(createHeart, i * 200);
})();

// --- Screen Transitions ---
function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  const target = document.getElementById(id);
  // Small delay so the fade-out happens before fade-in
  setTimeout(() => target.classList.add("active"), 100);
}

// --- Envelope Click → Open → Go to Question ---
const envelope = document.getElementById("envelope");
envelope.addEventListener("click", handleEnvelopeClick);
envelope.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") handleEnvelopeClick();
});

function handleEnvelopeClick() {
  envelope.classList.add("opened");
  // Try to start music on first interaction
  tryPlayMusic();
  // Transition to question screen after letter animation
  setTimeout(() => showScreen("screen-question"), 1200);
}

// --- NO Button: Escape on hover / tap ---
const btnNo = document.getElementById("btn-no");
const noTexts = [
  "No 😢",
  "Are you sure? 🥺",
  "Think again! 💭",
  "Please? 🙏",
  "Pretty please? 🌸",
  "Don't break my heart 💔",
  "One chance? 🥹",
];
let noIndex = 0;

function escapeNoButton() {
  noIndex = Math.min(noIndex + 1, noTexts.length - 1);
  btnNo.textContent = noTexts[noIndex];

  // Move the button to a random position within its parent
  const parent = btnNo.parentElement;
  const parentRect = parent.getBoundingClientRect();
  const btnRect = btnNo.getBoundingClientRect();

  // Calculate bounds so button stays visible
  const maxX = window.innerWidth - btnRect.width - 20;
  const maxY = window.innerHeight - btnRect.height - 20;
  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;

  btnNo.style.position = "fixed";
  btnNo.style.left = randomX + "px";
  btnNo.style.top = randomY + "px";
  btnNo.style.zIndex = "10";
}

// Desktop: escape on hover
btnNo.addEventListener("mouseenter", escapeNoButton);
// Mobile: escape on touch
btnNo.addEventListener("touchstart", (e) => {
  e.preventDefault();
  escapeNoButton();
});

// --- YES Button → Show Form ---
document.getElementById("btn-yes").addEventListener("click", () => {
  // Hide the escaped NO button so it doesn't block the form
  btnNo.style.display = "none";
  showScreen("screen-form");
});

// --- Set minimum date to today ---
const dateInput = document.getElementById("pick-date");
const today = new Date().toISOString().split("T")[0];
dateInput.setAttribute("min", today);

// --- Telegram Config (sends directly from browser, no backend needed) ---
const BOT_TOKEN = "8707563999:AAH8MUG8JOtxr-3IxGmcMtaELBLqFENmWAE";
const CHAT_ID = "7437967842";
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

// --- Form Submission ---
let isSubmitting = false;

async function handleFormSubmit(e) {
  if (e) e.preventDefault();
  if (isSubmitting) return; // Prevent double-submit

  const date = document.getElementById("pick-date").value;
  const time = document.getElementById("pick-time").value;

  if (!date || !time) {
    alert("Please pick both a date and time 💕");
    return;
  }

  isSubmitting = true;
  const submitBtn = document.querySelector(".btn-submit");
  submitBtn.textContent = "Sending... 💌";
  submitBtn.disabled = true;

  const message = `💖 She said YES!\n📅 Date: ${date}\n⏰ Time: ${time}`;

  try {
    // Send directly to Telegram (no backend needed!)
    const res = await fetch(TELEGRAM_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
      }),
    });

    const data = await res.json();

    if (data.ok) {
      // Format date nicely for display
      const formatted = new Date(date + "T" + time).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      document.getElementById("success-detail").textContent =
        `📅 ${formatted} at ⏰ ${time}`;

      showScreen("screen-success");
      launchConfetti();
    } else {
      console.error("Telegram error:", data);
      submitBtn.textContent = "Try again 💖";
      submitBtn.disabled = false;
      isSubmitting = false;
    }
  } catch (err) {
    console.error("Fetch error:", err);
    submitBtn.textContent = "Try again 💖";
    submitBtn.disabled = false;
    isSubmitting = false;
  }
}

document.getElementById("date-form").addEventListener("submit", handleFormSubmit);

// --- Confetti Animation (Canvas) ---
function launchConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettiColors = [
    "#ec4899", "#f9a8d4", "#ffe4e6", "#d4a373",
    "#fbbf24", "#f472b6", "#fb7185", "#fecdd3",
  ];
  const hearts = ["💖", "💕", "🩷", "🌸", "✨", "💗"];

  const pieces = [];
  for (let i = 0; i < 150; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      vy: Math.random() * 3 + 2,
      vx: (Math.random() - 0.5) * 4,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      isHeart: Math.random() > 0.7,
      heart: hearts[Math.floor(Math.random() * hearts.length)],
    });
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    pieces.forEach((p) => {
      p.y += p.vy;
      p.x += p.vx;
      p.rotation += p.rotSpeed;

      if (p.y < canvas.height + 50) alive = true;

      if (p.isHeart) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.font = p.r * 2.5 + "px serif";
        ctx.textAlign = "center";
        ctx.fillText(p.heart, 0, 0);
        ctx.restore();
      } else {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
        ctx.restore();
      }
    });

    frame++;
    if (alive && frame < 300) {
      requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  draw();
}

// --- Background Music ---
const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-toggle");
let musicPlaying = false;

function tryPlayMusic() {
  if (!musicPlaying) {
    music.volume = 0.3;
    music.play().then(() => {
      musicPlaying = true;
      musicBtn.classList.add("playing");
    }).catch(() => {
      // Autoplay blocked — user can click the button
    });
  }
}

musicBtn.addEventListener("click", () => {
  if (musicPlaying) {
    music.pause();
    musicPlaying = false;
    musicBtn.classList.remove("playing");
  } else {
    music.volume = 0.3;
    music.play().then(() => {
      musicPlaying = true;
      musicBtn.classList.add("playing");
    }).catch(() => {});
  }
});

// --- Handle window resize for confetti canvas ---
window.addEventListener("resize", () => {
  const canvas = document.getElementById("confetti-canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
