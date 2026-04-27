// Standby Booth — minimal page JS.
// Copy-to-clipboard + chyron scroll-state. That's the whole show.

(function () {
  "use strict";

  // ── Copy email ───────────────────────────────────────────────────
  const copyBtn = document.getElementById("copy-email");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const email = copyBtn.dataset.email || "";
      try {
        await navigator.clipboard.writeText(email);
      } catch (_) {
        // Older Safari fallback
        const t = document.createElement("textarea");
        t.value = email;
        document.body.appendChild(t);
        t.select();
        document.execCommand("copy");
        t.remove();
      }
      copyBtn.dataset.copied = "1";
      setTimeout(() => delete copyBtn.dataset.copied, 1800);
    });
  }

  // ── Chyron contrast on scroll ────────────────────────────────────
  const chyron = document.querySelector(".chyron");
  if (chyron) {
    const onScroll = () => {
      chyron.classList.toggle("scrolled", window.scrollY > 12);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
