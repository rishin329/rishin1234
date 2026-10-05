/* script.js - the only JavaScript in this template.

   It does one thing: when you hover an element that has
   data-scramble in the HTML, its letters roll like a slot machine
   in a wave from left to right, then settle back to the real text.

   Nothing else on the page depends on this file. Delete it and
   everything still works - it just stops scrambling. */

// The characters a letter rolls through while it is unsettled.
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>[]{}#*+=-";

// Anyone who asked their system for less motion gets the plain text.
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const CHAR_STEP = 2;   // frames before the next letter joins in - the wave
const SETTLE = 10;     // frames each letter spends rolling

function scramble(element) {
  // Ignore a second hover while one run is still going.
  if (element.dataset.running === "1") return;

  // Remember the real text the first time, so we can always restore it.
  // trim() matters: the HTML is indented, and those stray line breaks would
  // otherwise be scrambled into visible characters.
  const text = element.dataset.text || element.textContent.trim();
  element.dataset.text = text;
  element.dataset.running = "1";

  let frame = 0;

  function tick() {
    let output = "";
    let settled = 0;

    for (let i = 0; i < text.length; i++) {
      const startsAt = i * CHAR_STEP;   // later letters start later: the ripple

      if (text[i] === " ") {
        output += " ";           // spaces stay put, so words keep their shape
        settled++;
      } else if (frame < startsAt) {
        output += text[i];              // the wave has not reached this letter
      } else if (frame < startsAt + SETTLE) {
        output += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      } else {
        output += text[i];              // settled back to the real letter
        settled++;
      }
    }

    element.textContent = output;
    frame++;

    if (settled === text.length) {
      element.dataset.running = "0";
      return;                           // every letter is back: stop
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

// Wire it up to every element that asked for it in the HTML.
document.querySelectorAll("[data-scramble]").forEach(function (element) {
  if (REDUCED) return;
  element.addEventListener("pointerenter", function () { scramble(element); });
  element.addEventListener("focus", function () { scramble(element); });
});