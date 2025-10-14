// /scripts/main.js

document.addEventListener('DOMContentLoaded', () => {
  // Navbar elements
  const heartCountEl = document.getElementById('heartCount');
  const coinCountEl = document.getElementById('coinCount');

  // Call history elements
  const callHistoryList = document.getElementById('callHistoryList');
  const noHistoryMsg = document.getElementById('noHistoryMsg');

  // Select all cards
  const cards = document.querySelectorAll('.cardContainer > div'); // each direct card wrapper

  // Helper: parse integer safely from a span's text
  function parseCount(el) {
    const n = parseInt(el.textContent.replace(/\D/g, ''), 10);
    return Number.isFinite(n) ? n : 0;
  }

  // Update UI functions
  function setHeartCount(n) { heartCountEl.textContent = n; }
  function setCoinCount(n) { coinCountEl.textContent = n; }

  // Initialize counts from DOM (so HTML defaults are used)
  let heartCount = parseCount(heartCountEl);
  let coins = parseCount(coinCountEl);

  // Ensure UI matches parsed numbers
  setHeartCount(heartCount);
  setCoinCount(coins);

  // Add a history entry
  function addCallHistory(serviceName, serviceNumber) {
    // hide "no history" message if showing
    if (noHistoryMsg) noHistoryMsg.style.display = 'none';

    const li = document.createElement('li');
    li.className = 'border p-3 rounded-lg bg-gray-50';

    // small markup for name and number
    li.innerHTML = `
      <div class="font-semibold">${escapeHtml(serviceName)}</div>
      <div class="text-sm text-gray-600">${escapeHtml(serviceNumber)}</div>
    `;

    // prepend so newest is on top
    callHistoryList.prepend(li);
  }

  // simple escape to avoid injection when inserting innerHTML
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // For each card, wire up heart and call button
  cards.forEach(card => {
    // find heart image inside this card
    const heartIcon = card.querySelector('.heart-icon');
    if (heartIcon) {
      heartIcon.style.cursor = 'pointer';
      heartIcon.addEventListener('click', () => {
        heartCount += 1;
        setHeartCount(heartCount);

        // optional visual feedback: add a tiny scale animation
        heartIcon.animate(
          [{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }],
          { duration: 220, easing: 'ease-out' }
        );
      });
    }

    // find the call button
    const callBtn = card.querySelector('.call-btn');
    if (callBtn) {
      callBtn.addEventListener('click', () => {
        // extract service name and number from the card
        // service name in <h3>, number in <h2>
        const serviceNameEl = card.querySelector('h3');
        const serviceNumberEl = card.querySelector('h2');

        const serviceName = serviceNameEl ? serviceNameEl.textContent.trim() : 'Unknown Service';
        const serviceNumber = serviceNumberEl ? serviceNumberEl.textContent.trim() : 'Unknown Number';

        // check coins
        if (coins < 20) {
          alert('Not enough coins to make the call. Each call costs 20 coins.');
          return;
        }

        // confirm/show call alert message
        alert(`Calling ${serviceName} — Number: ${serviceNumber}`);

        // deduct coins
        coins -= 20;
        setCoinCount(coins);

        // add to call history
        addCallHistory(serviceName, serviceNumber);
      });
    }
  });

  // Optional: hook "Clear" button in call history (if present)
  const clearBtn = document.querySelector('aside button'); // your Clear button in aside
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      callHistoryList.innerHTML = '';
      if (noHistoryMsg) noHistoryMsg.style.display = 'block';
    });
  }
});
