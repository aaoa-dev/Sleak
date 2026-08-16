/* Interactive rule demos. Each initializer runs only if its root element exists.
   Roots are injected per page by scripts/build_rules.py as <div class="demo" id="demo-<slug>">. */
(function () {
  "use strict";
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  var DEMOS = {

    /* 01, Concentric radius: parent radius + padding drive the child radius. */
    "concentric-radius": function (root) {
      var parent = $("#cc-parent", root), child = $("#cc-child", root),
          rP = $("#cc-r", root), rPad = $("#cc-p", root),
          same = $("#cc-same", root),
          oR = $("#cc-ro", root), oP = $("#cc-po", root), live = $(".live", root),
          note = $("#cc-note", root);
      function render() {
        var R = +rP.value, P = +rPad.value;
        var kids = same.getAttribute("aria-pressed") === "true";
        var childR = kids ? R : Math.max(0, R - P);
        parent.style.borderRadius = R + "px";
        parent.style.padding = P + "px";
        child.style.borderRadius = childR + "px";
        oR.textContent = R + " px"; oP.textContent = P + " px";
        live.textContent = "child = " + (kids ? R + " (forced)" : R + " − " + P + " = " + childR) + " px";
        var ok = !kids;
        note.innerHTML = ok
          ? 'Concentric, the inner curve runs parallel to the outer. <b>' + R + ' − ' + P + ' = ' + childR + '</b>.'
          : 'Broken, same radius on both layers. The inner corner crowds the outer; the gap looks pinched.';
        note.className = "demo-note";
      }
      rP.addEventListener("input", render);
      rPad.addEventListener("input", render);
      same.addEventListener("click", function () {
        same.setAttribute("aria-pressed", same.getAttribute("aria-pressed") === "true" ? "false" : "true");
        render();
      });
      render();
    },

    /* 02, Section eyebrows: stack N sections, toggle eyebrows on/off. */
    "section-eyebrows": function (root) {
      var stage = $("#se-stage", root), count = $("#se-count", root),
          eye = $("#se-eye", root), oC = $("#se-co", root), live = $(".live", root),
          note = $("#se-note", root);
      var titles = ["Features", "How it works", "Pricing", "Testimonials", "FAQ"];
      function render() {
        var n = +count.value, on = eye.getAttribute("aria-pressed") === "true";
        oC.textContent = n;
        stage.innerHTML = "";
        for (var i = 0; i < n; i++) {
          var s = document.createElement("div");
          s.className = "se-sec";
          s.innerHTML =
            (on ? '<div class="se-eyebrow">' + titles[i % titles.length] + '</div>' : '') +
            '<div class="se-h">A clear section heading</div>' +
            '<div class="se-b">One line of supporting copy under the heading.</div>';
          stage.appendChild(s);
        }
        var eyebrows = on ? n : 0;
        live.textContent = eyebrows + " eyebrow" + (eyebrows === 1 ? "" : "s") + " / page";
        note.innerHTML = eyebrows > 1
          ? 'Every section wears the same kicker, that repetition <b>reads as template chrome</b>. Aim for ≤ 1 per page.'
          : (eyebrows === 1
            ? 'One eyebrow, carrying info the heading can’t. That’s the ceiling.'
            : 'No eyebrows, the headings alone carry the hierarchy. Cleanest default.');
      }
      count.addEventListener("input", render);
      eye.addEventListener("click", function () {
        eye.setAttribute("aria-pressed", eye.getAttribute("aria-pressed") === "true" ? "false" : "true");
        render();
      });
      render();
    },

    /* 03, Intentional accent: scatter accent everywhere vs one focal point. */
    "intentional-accent": function (root) {
      var stage = root, live = $(".live", root), note = $("#ia-note", root),
          segBtns = root.querySelectorAll("[data-mode]");
      function setMode(mode) {
        stage.setAttribute("data-mode", mode);
        segBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.mode === mode ? "true" : "false"); });
        var focal = mode === "scatter" ? 7 : 1;
        live.textContent = focal + " accent focal point" + (focal === 1 ? "" : "s");
        note.innerHTML = mode === "scatter"
          ? 'Accent on every element, <b>nothing wins</b>. The eye has no primary target and the brand color stops meaning "act here".'
          : 'One full-chroma accent on the primary action. Everything else recedes; the CTA <b>pulls the eye</b>.';
      }
      segBtns.forEach(function (b) { b.addEventListener("click", function () { setMode(b.dataset.mode); }); });
      setMode("focus");
    },

    /* 04, Accent-hue blacks: the hue slider re-themes the WHOLE page via --accent-h. */
    "accent-hue-blacks": function (root) {
      var hue = $("#ah-hue", root), oH = $("#ah-ho", root), live = $(".live", root),
          note = $("#ah-note", root), reset = $("#ah-reset", root), docEl = document.documentElement;
      function render() {
        var h = +hue.value;
        docEl.style.setProperty("--accent-h", h);
        oH.textContent = h + "°";
        live.textContent = "--accent-h: " + h + "°";
        note.innerHTML = 'The accent <b>and</b> every neutral read from <span class="kbd">--accent-h</span>. Drag the hue and the whole page shifts together, the darks stay tinted toward the accent, so nothing clashes.';
      }
      hue.addEventListener("input", render);
      if (reset) reset.addEventListener("click", function () { hue.value = 340; render(); });
      render();
    },

    /* 06, Typography: measure (line length) slider with a readable-range target. */
    "typography": function (root) {
      var para = $("#ty-para", root), ch = $("#ty-ch", root), oC = $("#ty-co", root),
          live = $(".live", root), note = $("#ty-note", root);
      function render() {
        var c = +ch.value;
        para.style.maxWidth = c + "ch";
        oC.textContent = c + "ch";
        live.textContent = c + "ch measure";
        var inRange = c >= 45 && c <= 75;
        note.innerHTML = inRange
          ? 'In the <b>45–75ch</b> sweet spot, the eye finds the next line without effort.'
          : (c < 45
            ? 'Too narrow, the eye snaps back too often and rhythm breaks. Widen toward 45–75ch.'
            : 'Too wide, the return sweep loses the line. Tighten toward 45–75ch.');
      }
      ch.addEventListener("input", render);
      render();
    },

    /* 07, Layout & spacing: landing-page SECTION dividers, full-bleed rule vs space. */
    "layout-spacing": function (root) {
      var stage = $("#ls-stage", root), gap = $("#ls-gap", root), oG = $("#ls-go", root),
          live = $(".live", root), note = $("#ls-note", root),
          segBtns = root.querySelectorAll("[data-sep]"), mode = "space";
      function render() {
        stage.setAttribute("data-sep", mode);
        stage.style.setProperty("--ls-gap", gap.value + "px");
        oG.textContent = gap.value + " px";
        segBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.sep === mode ? "true" : "false"); });
        live.textContent = mode === "rules" ? "full-bleed section rules" : "space + surface tiers";
        note.innerHTML = mode === "rules"
          ? 'Full-bleed rules chop a landing page into <b>stacked strips</b>, busy, and every section reads the same flat weight. This is the section-level divider to avoid.'
          : 'Whitespace and a subtle surface tier separate the sections, <b>0 dividers</b>, and the page breathes. (A hairline inside a dense list or table is fine; this rule is about section dividers.)';
      }
      gap.addEventListener("input", render);
      segBtns.forEach(function (b) { b.addEventListener("click", function () { mode = b.dataset.sep; render(); }); });
      render();
    },

    /* 08, Cards & buttons: icon position drives which side gets the ½ inset. */
    "components": function (root) {
      var btn = $("#cp-btn", root), guide = $("#cp-guide", root), live = $(".live", root),
          note = $("#cp-note", root), segBtns = root.querySelectorAll("[data-icon]"),
          mode = "right", TEXT = 24, HALF = 12;
      var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>';
      function render() {
        var lbl = '<span>Get the skill</span>';
        if (mode === "left") {
          btn.innerHTML = ICON + lbl;
          btn.style.paddingLeft = HALF + "px"; btn.style.paddingRight = TEXT + "px";
          live.textContent = "L " + HALF + " · R " + TEXT;
          guide.textContent = "left = icon side (½) · right = text side";
        } else if (mode === "right") {
          btn.innerHTML = lbl + ICON;
          btn.style.paddingLeft = TEXT + "px"; btn.style.paddingRight = HALF + "px";
          live.textContent = "L " + TEXT + " · R " + HALF;
          guide.textContent = "left = text side · right = icon side (½)";
        } else {
          btn.innerHTML = lbl;
          btn.style.paddingLeft = TEXT + "px"; btn.style.paddingRight = TEXT + "px";
          live.textContent = "L " + TEXT + " · R " + TEXT;
          guide.textContent = "no icon · symmetric padding";
        }
        segBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.icon === mode ? "true" : "false"); });
        note.innerHTML = mode === "none"
          ? 'No icon → padding is <b>symmetric</b> and the label sits centered.'
          : 'The icon side is inset about <b>half</b> the text side (' + HALF + ' ≈ ½ · ' + TEXT + '), so the icon sits in a visual square instead of drifting to the edge.';
      }
      segBtns.forEach(function (b) { b.addEventListener("click", function () { mode = b.dataset.icon; render(); }); });
      render();
    },

    /* 09, Motion budget: duration + easing, play to preview, budget flag. */
    "motion": function (root) {
      var box = $("#mo-box", root), dur = $("#mo-dur", root), ease = $("#mo-ease", root),
          play = $("#mo-play", root), oD = $("#mo-do", root), live = $(".live", root),
          note = $("#mo-note", root), on = false;
      function render() {
        var d = +dur.value;
        oD.textContent = d + " ms";
        live.textContent = d + "ms · " + ease.options[ease.selectedIndex].text;
        var over = d > 150;
        note.innerHTML = reduced
          ? 'Your system requests <b>reduced motion</b>, a real build would cut this animation entirely.'
          : (over
            ? 'Over the <b>150ms</b> budget, UI motion this long starts to feel sluggish. Trim it.'
            : 'Within the <b>≤150ms</b> budget, quick enough to feel responsive, not decorative.');
      }
      function animate() {
        if (reduced) return;
        var d = +dur.value;
        box.style.transition = "none";
        box.style.transform = "translateX(0)";
        // force reflow, then move
        void box.offsetWidth;
        box.style.transition = "transform " + d + "ms " + ease.value;
        box.style.transform = "translateX(180px)";
        setTimeout(function () {
          box.style.transition = "transform " + d + "ms " + ease.value;
          box.style.transform = "translateX(0)";
        }, d + 120);
      }
      dur.addEventListener("input", render);
      ease.addEventListener("change", render);
      play.addEventListener("click", animate);
      render();
    },

    /* 10, Content & copy: fluff vs verb + object, toggle the same UI's labels. */
    "content-copy": function (root) {
      var els = root.querySelectorAll("[data-fluff]"), live = $(".live", root),
          note = $("#co-note", root), segBtns = root.querySelectorAll("[data-copy]"), mode = "sharp";
      function render() {
        els.forEach(function (el) { el.textContent = mode === "sharp" ? el.dataset.sharp : el.dataset.fluff; });
        segBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.copy === mode ? "true" : "false"); });
        live.textContent = mode === "sharp" ? "verb + object" : "vague + padded";
        note.innerHTML = mode === "sharp"
          ? 'Each label <b>leads with a verb</b> and names its object. The user knows exactly what the control does.'
          : 'Padded, hedged, abstract, the reader has to <b>guess the action</b>. Cut to verb + object.';
      }
      segBtns.forEach(function (b) { b.addEventListener("click", function () { mode = b.dataset.copy; render(); }); });
      render();
    }
  };

  Object.keys(DEMOS).forEach(function (slug) {
    var root = document.getElementById("demo-" + slug);
    if (root) DEMOS[slug](root);
  });
})();
