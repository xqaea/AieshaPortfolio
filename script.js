const DISCORD_ID = "1007850745615372329";

const root        = document.documentElement;
const toggleBtn   = document.getElementById('themeToggle');
const STORAGE_KEY = 'aiesha-theme';

function getInitialTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  toggleBtn.textContent = theme === 'dark' ? '☼' : '☾';
  localStorage.setItem(STORAGE_KEY, theme);
}

applyTheme(getInitialTheme());

toggleBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    applyTheme(e.matches ? 'dark' : 'light');
  }
});
const cursorDot  = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursorDot.style.left = mx + 'px';
  cursorDot.style.top  = my + 'px';
});

(function animateRing() {
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(animateRing);
})();

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a, button, .pill, .proj-card, .social-btn, .avatar').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.style.width   = '6px';
      cursorDot.style.height  = '6px';
      cursorRing.style.width  = '48px';
      cursorRing.style.height = '48px';
      cursorRing.style.opacity = '1';
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.style.width   = '10px';
      cursorDot.style.height  = '10px';
      cursorRing.style.width  = '32px';
      cursorRing.style.height = '32px';
      cursorRing.style.opacity = '0.6';
    });
  });
});

window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 900);
});

async function fetchSpotify() {
  const statusEl = document.getElementById('spotify-status');
  const dotEl    = document.querySelector('.np-dot');
  if (!statusEl || !dotEl) return;

  try {
    const res  = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
    const data = await res.json();

    if (data.success && data.data.spotify) {
      const { song, artist } = data.data.spotify;
      statusEl.textContent = `now listening: ${song} — ${artist}`;
      dotEl.style.background = 'var(--pink-deep)';
      dotEl.style.animationPlayState = 'running';
    } else {
      statusEl.textContent = 'not listening to anything ♡';
      dotEl.style.background = 'var(--border)';
      dotEl.style.animationPlayState = 'paused';
    }
  } catch (err) {
    console.warn('Lanyard fetch failed:', err);
    statusEl.textContent = 'music status unavailable';
  }
}

fetchSpotify();
setInterval(fetchSpotify, 10_000);
document.addEventListener('DOMContentLoaded', () => {
  const pills = document.querySelectorAll('.pill');
  const tabs  = document.querySelectorAll('.tab-content');

  function switchTab(targetId) {
    tabs.forEach(tab => tab.classList.remove('active'));
    pills.forEach(p => p.classList.remove('active'));
    const targetTab = document.getElementById(targetId);
    if (targetTab) targetTab.classList.add('active');
    pills.forEach(p => {
      if (p.getAttribute('href') === `#${targetId}`) p.classList.add('active');
    });
  }

  pills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = pill.getAttribute('href').replace('#', '');
      switchTab(targetId);
    });
  });

  const typingEl   = document.getElementById('typingHandle');
  const fullText   = '@aieshayuwein';
  let   charIndex  = 0;

  function type() {
    if (!typingEl) return;
    if (charIndex < fullText.length) {
      typingEl.textContent += fullText[charIndex];
      charIndex++;
      setTimeout(type, 80);
    }
  }
  setTimeout(type, 1100);

  const CORRECT_PIN  = '147369';
  let   pinEntry     = '';
  const pinDots      = document.querySelectorAll('.pin-dot');
  const pinError     = document.getElementById('pinError');
  const pinPrompt    = document.getElementById('pin-prompt');
  const pinUnlocked  = document.getElementById('pin-unlocked');
  const pinLockBtn   = document.getElementById('pinLockBtn');

  function updateDots() {
    pinDots.forEach((dot, i) => {
      dot.classList.toggle('filled', i < pinEntry.length);
    });
  }

  function resetPin(msg = '') {
    pinEntry = '';
    updateDots();
    if (msg) {
      pinError.textContent = msg;
      pinError.classList.remove('shake');
      void pinError.offsetWidth;
      pinError.classList.add('shake');
    } else {
      pinError.textContent = '';
    }
  }

  function lockSecret() {
    pinPrompt.style.display  = '';
    pinUnlocked.style.display = 'none';
    resetPin();
  }

  document.querySelectorAll('.pin-key').forEach(key => {
    key.addEventListener('click', () => {
      const val = key.getAttribute('data-val');
      if (val === 'clear') { resetPin(); return; }
      if (val === 'del')   { pinEntry = pinEntry.slice(0, -1); updateDots(); return; }
      if (pinEntry.length >= CORRECT_PIN.length) return;

      pinEntry += val;
      updateDots();

      if (pinEntry.length === CORRECT_PIN.length) {
        if (pinEntry === CORRECT_PIN) {
          setTimeout(() => {
            pinPrompt.style.display   = 'none';
            pinUnlocked.style.display = '';
            resetPin();
          }, 200);
        } else {
          setTimeout(() => resetPin('wrong passcode ✕'), 200);
        }
      }
    });
  });

  if (pinLockBtn) pinLockBtn.addEventListener('click', lockSecret);

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const target = pill.getAttribute('href').replace('#', '');
      if (target !== 'secret') lockSecret();
    });
  });
  const yandereEl  = document.getElementById('yandere');
  const yandereMsg = document.getElementById('yandere-msg');

  const tabMessages = [
    "where do you think you're going..?",
    "you were just here. come back.",
    "i saw that. don't leave me.",
    "..you left. i noticed.",
    "you belong here. not there.",
  ];
  const idleMessages = [
    "still there..? i'm waiting.",
    "you've been quiet for a while.",
    "i haven't forgotten about you.",
    "don't make me come find you..",
    "..are you ignoring me?",
  ];

  let yandereTimeout = null;
  let idleTimeout    = null;
  let isShowing      = false;
  const IDLE_DELAY   = 60_000;

  function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function showYandere(msg) {
    if (isShowing) return;
    isShowing = true;
    yandereMsg.textContent = msg;
    yandereMsg.setAttribute('data-text', msg);
    yandereEl.classList.add('active');

    yandereTimeout = setTimeout(() => {
      yandereEl.classList.remove('active');
      yandereEl.classList.add('leaving');
      setTimeout(() => {
        yandereEl.classList.remove('leaving');
        isShowing = false;
      }, 800);
    }, 3200);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) showYandere(getRandom(tabMessages));
  });

  function resetIdle() {
    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(() => {
      showYandere(getRandom(idleMessages));
    }, IDLE_DELAY);
  }

  ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'].forEach(evt => {
    document.addEventListener(evt, resetIdle, { passive: true });
  });
  resetIdle();
});