/* Interactive rule demos. Each initializer runs only if its root element exists.
   Roots are hand-authored in each page under docs/rules/ as
   <div class="demo" id="demo-<key>">, one stage per rule *and sub-rule*,
   placed inline at the section it illustrates. Keep keys/ids in sync here. */
(function () {
  "use strict";
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- shared colour math (WCAG + APCA reference algorithm, apca-w3 constants) ---- */
  function lin(c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function lum(rgb) { return 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]); }
  function wcag(fg, bg) { var a = lum(fg), b = lum(bg); return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); }
  function rgb(s) { var m = String(s).match(/\d+/g); return m ? m.slice(0, 3).map(Number) : [0, 0, 0]; }
  function hslToRgb(h, s, l) {
    s /= 100; l /= 100; var c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2, o = [0, 0, 0];
    if (h < 60) o = [c, x, 0]; else if (h < 120) o = [x, c, 0]; else if (h < 180) o = [0, c, x];
    else if (h < 240) o = [0, x, c]; else if (h < 300) o = [x, 0, c]; else o = [c, 0, x];
    return o.map(function (v) { return Math.round((v + m) * 255); });
  }
  var mainTRC = 2.4, sRco = 0.2126729, sGco = 0.7151522, sBco = 0.0721750,
      normBG = 0.56, normTXT = 0.57, revTXT = 0.62, revBG = 0.65,
      blkThrs = 0.022, blkClmp = 1.414, scaleBoW = 1.14, scaleWoB = 1.14,
      loBoWoffset = 0.027, loWoBoffset = 0.027, loClip = 0.1, deltaYmin = 0.0005;
  /* APCA uses a plain 2.4 power curve per channel (not the piecewise sRGB). */
  function sRGBtoY(rgb) {
    return sRco * Math.pow(rgb[0] / 255, mainTRC) + sGco * Math.pow(rgb[1] / 255, mainTRC) + sBco * Math.pow(rgb[2] / 255, mainTRC);
  }
  /* APCA-W3 0.1.9 reference. normTXT/normBG/revTXT/revBG are EXPONENTS; the
     black levels get a soft clamp; the low end is clipped then offset. Returns
     signed Lc (negative = light-on-dark); callers take the absolute value. */
  function apcaLc(txt, bg) {
    var Ytxt = sRGBtoY(txt), Ybg = sRGBtoY(bg);
    Ytxt = Ytxt > blkThrs ? Ytxt : Ytxt + Math.pow(blkThrs - Ytxt, blkClmp);
    Ybg = Ybg > blkThrs ? Ybg : Ybg + Math.pow(blkThrs - Ybg, blkClmp);
    if (Math.abs(Ybg - Ytxt) < deltaYmin) return 0;
    var SAPC, Lc;
    if (Ybg > Ytxt) {                                  // dark text on light bg
      SAPC = (Math.pow(Ybg, normBG) - Math.pow(Ytxt, normTXT)) * scaleBoW;
      Lc = SAPC < loClip ? 0 : SAPC - loBoWoffset;
    } else {                                           // light text on dark bg
      SAPC = (Math.pow(Ybg, revBG) - Math.pow(Ytxt, revTXT)) * scaleWoB;
      Lc = SAPC > -loClip ? 0 : SAPC + loWoBoffset;
    }
    return Lc * 100;
  }

  var DEMOS = {

    /* 01 / concentric radius: parent radius + padding drive the child radius. */
    "concentric-radius": function (root) {
      var parent = $("#cc-parent", root), child = $("#cc-child", root),
          rP = $("#cc-r", root), rPad = $("#cc-p", root),
          segBtns = root.querySelectorAll("[data-cc]"),
          oR = $("#cc-ro", root), oP = $("#cc-po", root), live = $(".live", root),
          note = $("#cc-note", root), forced = false;
      function render() {
        var R = +rP.value, P = +rPad.value;
        var kids = forced;
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
      segBtns.forEach(function (b) {
        b.addEventListener("click", function () {
          forced = b.dataset.cc === "equal";
          segBtns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
          render();
        });
      });
      render();
    },

    /* 01b / concentric radius: the last baseline sits at the corner arc centre (R, R). */
    "concentric-radius-text": function (root) {
      var card = $("#crt-card", root), title = $("#crt-title", root), sub = $("#crt-sub", root),
          guides = $("#crt-guides", root), circle = $("#crt-circle", root), dot = $("#crt-dot", root),
          rh = $("#crt-rh", root), rv = $("#crt-rv", root),
          r = $("#crt-r", root), oR = $("#crt-ro", root), live = $(".live", root),
          note = $("#crt-note", root), btns = root.querySelectorAll("[data-anchor]");
      var L = 16, BOTTOM = 132, anchor = "conc";
      function render() {
        var R = +r.value, off = anchor === "off" ? 6 : 0;
        var ti = Math.max(R, 10);                 // inset = R (or R + 6 when off)
        var tx = L + ti + off, ty = BOTTOM - ti - off;
        var ccx = L + R, ccy = BOTTOM - R;
        card.setAttribute("rx", R);
        title.setAttribute("x", tx); title.setAttribute("y", ty - 24);
        sub.setAttribute("x", tx); sub.setAttribute("y", ty);
        circle.setAttribute("cx", ccx); circle.setAttribute("cy", ccy); circle.setAttribute("r", R);
        dot.setAttribute("cx", tx); dot.setAttribute("cy", ty);
        guides.setAttribute("d", "M" + L + " " + ccy + " H" + ccx + " M" + ccx + " " + ccy + " V" + BOTTOM);
        rh.setAttribute("x", L + R / 2 - 4); rh.setAttribute("y", ccy - 5);
        rv.setAttribute("x", ccx + 5); rv.setAttribute("y", ccy + R / 2 + 4);
        oR.textContent = R + " px";
        live.textContent = anchor === "conc"
          ? "baseline starts at (R, R)"
          : "baseline drifted +6px from the corner centre";
        note.innerHTML = anchor === "conc"
          ? 'The last line’s start sits on the <b>corner circle centre</b>: <b>R</b> from the side and <b>R</b> from the bottom. The text is concentric with the rounding.'
          : 'Inset too far: the baseline no longer lands on the corner centre, the text floats or crowds off the <b>single curve axis</b>.';
        note.className = "demo-note";
      }
      r.addEventListener("input", render);
      btns.forEach(function (b) {
        b.addEventListener("click", function () {
          anchor = b.dataset.anchor;
          btns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
          render();
        });
      });
      render();
    },

    /* 02 / section eyebrows: stack N sections, toggle eyebrows on/off. */
    "section-eyebrows": function (root) {
      var stage = $("#se-stage", root), count = $("#se-count", root),
          segBtns = root.querySelectorAll("[data-eye]"), oC = $("#se-co", root), live = $(".live", root),
          note = $("#se-note", root), eyeOn = true;
      var titles = ["Features", "How it works", "Pricing", "Testimonials", "FAQ"];
      function render() {
        var n = +count.value, on = eyeOn;
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
      segBtns.forEach(function (b) {
        b.addEventListener("click", function () {
          eyeOn = b.dataset.eye === "on";
          segBtns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
          render();
        });
      });
      render();
    },

    /* 02b / section eyebrows: the hero gets a badge, not an eyebrow. */
    "section-eyebrows-hero": function (root) {
      var hero = $("#seh-hero", root), eyebrow = $("#seh-eyebrow", root), badge = $("#seh-badge", root),
          live = $(".live", root), note = $("#seh-note", root), btns = root.querySelectorAll("[data-hero]");
      function render(mode) {
        hero.setAttribute("data-hero", mode);
        btns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.hero === mode ? "true" : "false"); });
        live.textContent = mode === "eyebrow" ? "eyebrow above the H1" : "badge on the announcement";
        note.innerHTML = mode === "eyebrow"
          ? 'An eyebrow above the hero title says nothing the headline can’t, <b>template chrome</b>. The hero headline is the hook.'
          : 'A compact <b>badge on the announcement itself</b> carries the only hero fact that earns one (“v2.0 out now”). No standalone kicker.';
      }
      btns.forEach(function (b) { b.addEventListener("click", function () { render(b.dataset.hero); }); });
      render("eyebrow");
    },

    /* 03 / intentional accent: scatter accent everywhere vs one focal point. */
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

    /* 03b / intentional accent: tints support the active row, they don't stack. */
    "intentional-accent-tints": function (root) {
      var ui = $("#iat-ui", root), live = $(".live", root), note = $("#iat-note", root),
          segBtns = root.querySelectorAll("[data-mode]");
      function render(mode) {
        ui.setAttribute("data-mode", mode);
        segBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.mode === mode ? "true" : "false"); });
        live.textContent = mode === "stack" ? "tint on every section" : "tint on the active row only";
        note.innerHTML = mode === "stack"
          ? 'A tint on every section background recreates <b>“accent everywhere” at lower saturation</b>, the eye has nothing to anchor on.'
          : 'One tint on the <b>active/selected row</b>, one full accent on the action. Tints reinforce the primary path; they don’t decorate sections.';
      }
      segBtns.forEach(function (b) { b.addEventListener("click", function () { render(b.dataset.mode); }); });
      render("focal");
    },

    /* 04 / accent-hue blacks: the hue slider re-themes the WHOLE page via --accent-h. */
    "accent-hue-blacks": function (root) {
      var hue = $("#ah-hue", root), oH = $("#ah-ho", root), live = $(".live", root),
          note = $("#ah-note", root), reset = $("#ah-reset", root), docEl = document.documentElement;
      function render() {
        var h = +hue.value;
        docEl.style.setProperty("--accent-h", h);
        oH.textContent = h + "°";
        live.textContent = "--accent-h: " + h + "°";
        note.innerHTML = 'The accent <b>and</b> every neutral read from <span class="kbd">--accent-h</span>. The accent is authored in <b>OKLCH</b> with fixed lightness, so as the hue rotates the white-on-accent contrast <b>holds</b>. In HSL the same drag would swing luminance and break it (dark blue, washed-out yellow). The whole page shifts together and the darks stay tinted toward the accent.';
      }
      hue.addEventListener("input", render);
      if (reset) reset.addEventListener("click", function () { hue.value = 340; render(); });
      render();
    },

    /* 04b / accent-hue blacks: a tinted dark must carry the accent hue, not a library gray. */
    "accent-hue-blacks-pair": function (root) {
      var dark = $("#ahp-dark", root), hue = $("#ahp-hue", root), oH = $("#ahp-ho", root),
          live = $(".live", root), note = $("#ahp-note", root), reset = $("#ahp-reset", root);
      var ACCENT = 220;
      function render() {
        var h = +hue.value, diff = Math.abs(h - ACCENT) % 360;
        var clash = Math.min(diff, 360 - diff) > 25;
        dark.style.background = "hsl(" + h + " 14% 11%)";
        dark.style.color = "hsl(" + h + " 10% 88%)";
        dark.style.borderColor = "hsl(" + h + " 12% 30%)";
        oH.textContent = h + "°";
        live.textContent = "dark hue " + h + "° vs accent 220°";
        note.innerHTML = clash
          ? 'Warm/gray dark under a blue accent: the surface carries a <b>conflicting hue</b>. Saturation &gt; 0 means hue must equal the accent, <b>220°</b>.'
          : 'The tinted dark now matches the accent’s hue, <b>h = 220°</b>. It pairs with the blue accent instead of clashing. (True s:0 grays are the only exemption.)';
      }
      hue.addEventListener("input", render);
      reset.addEventListener("click", function () { hue.value = ACCENT; render(); });
      render();
    },

    /* 05 / contrast: text lightness on white → live WCAG ratio + AA pass/fail by size. */
    "contrast": function (root) {
      var sample = $("#ct-sample", root), L = $("#ct-l", root), oL = $("#ct-lo", root),
          live = $(".live", root), note = $("#ct-note", root),
          segBtns = root.querySelectorAll("[data-size]"), size = "body";
      function render() {
        var l = +L.value, g = Math.round(255 * l / 100);
        sample.style.color = "rgb(" + g + "," + g + "," + g + ")";
        sample.style.fontSize = size === "large" ? "1.6rem" : "1rem";
        sample.style.fontWeight = size === "large" ? "700" : "400";
        oL.textContent = l + "%";
        var Lg = lin(g), ratio = (1 + 0.05) / (Lg + 0.05); // bg = white
        var min = size === "large" ? 3 : 4.5, pass = ratio >= min;
        segBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.size === size ? "true" : "false"); });
        live.textContent = ratio.toFixed(2) + ":1 · " + (pass ? "AA pass" : "AA fail");
        note.innerHTML = pass
          ? 'Clears the <b>' + min + ':1</b> WCAG AA floor for ' + size + ' text. Readable for low-vision users.'
          : 'Below <b>' + min + ':1</b>, fails WCAG AA for ' + size + ' text. Darken the text (or enlarge / bolden it).';
      }
      L.addEventListener("input", render);
      segBtns.forEach(function (b) { b.addEventListener("click", function () { size = b.dataset.size; render(); }); });
      render();
    },

    /* 05b / contrast: WCAG + APCA agree, check both. */
    "contrast-dual": function (root) {
      var card = $("#ctd-card", root), t = $("#ctd-t", root),
          hue = $("#ctd-hue", root), L = $("#ctd-l", root),
          oH = $("#ctd-ho", root), oL = $("#ctd-lo", root),
          live = $(".live", root), note = $("#ctd-note", root),
          segBtns = root.querySelectorAll("[data-pol]"), pol = "light";
      function render() {
        var h = +hue.value, l = +L.value, bg = hslToRgb(h, 90, l);
        var fg = pol === "light" ? [255, 255, 255] : [28, 28, 30];
        card.style.background = "hsl(" + h + " 90% " + l + "%)";
        card.style.color = "rgb(" + fg.join(",") + ")";
        oH.textContent = h + "°"; oL.textContent = l + "%";
        segBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.pol === pol ? "true" : "false"); });
        var w = wcag(fg, bg), lcAbs = Math.abs(apcaLc(fg, bg)), lcR = Math.round(lcAbs);
        var passW = w >= 4.5, passA = lcR >= 75;
        var agree = passW === passA;
        live.textContent = "WCAG " + w.toFixed(1) + ":1 · APCA Lc " + lcR
          + " · " + (agree ? "agree" : "disagree");
        note.innerHTML = agree
          ? (passW
            ? 'Both methods pass: <b>WCAG ' + w.toFixed(1) + ':1</b> ≥ 4.5 and <b>APCA Lc ' + lcR + '</b> ≥ 75 for body text.'
            : 'Both fail. Darken / lighten the background or resize the text to clear both floors.')
          : 'They <b>disagree</b>, WCAG says ' + (passW ? '<b>pass</b>' : '<b>fail</b>') + ', APCA says ' + (passA ? '<b>pass</b>' : '<b>fail</b>')
            + '. This is exactly why Sleak requires <b>both</b>: WCAG is the legal floor, APCA is whether a human can actually read it.';
      }
      hue.addEventListener("input", render);
      L.addEventListener("input", render);
      segBtns.forEach(function (b) { b.addEventListener("click", function () { pol = b.dataset.pol; render(); }); });
      render();
    },

    /* 05c / contrast: the rendered pixel overrides the token you measured. */
    "contrast-render": function (root) {
      var btn = $("#ctr-btn", root), meter = $("#ctr-meter", root), live = $(".live", root),
          note = $("#ctr-note", root), segBtns = root.querySelectorAll("[data-src]");
      function render(mode) {
        segBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.src === mode ? "true" : "false"); });
        if (mode === "render") btn.classList.add("override");
        else btn.classList.remove("override");
        var bg = rgb(getComputedStyle(btn).backgroundColor);
        var fg = rgb(getComputedStyle(btn).color);
        var ratio = wcag(fg, bg), pass = ratio >= 4.5;
        live.textContent = (mode === "token" ? "token pair" : "rendered pixel") + " · " + ratio.toFixed(2) + ":1";
        meter.innerHTML = (mode === "token" ? 'as-designed: <b>' + ratio.toFixed(2) + ':1</b> ✓' : 'sampled from render: <b>' + ratio.toFixed(2) + ':1</b> ' + (pass ? '✓' : '✗ fails AA'));
        meter.className = "ctr-meter " + (pass ? "ok" : "bad");
        note.innerHTML = mode === "token"
          ? 'Reading the CSS token, white-on-accent computes fine. But that’s <b>intent</b>, not contrast, a more specific selector can still paint something else.'
          : 'A cascade override (e.g. <span class="kbd">.nav-links a</span>) beat the button’s white text, so the render is <b>dark on accent</b>, ' + ratio.toFixed(2) + ':1, a hard fail. <b>Sample the rendered pixel, not the token.</b>';
      }
      segBtns.forEach(function (b) { b.addEventListener("click", function () { render(b.dataset.src); }); });
      render("token");
    },

    /* 06 / typography: measure (line length) slider with a readable-range target. */
    "typography": function (root) {
      var para = $("#ty-para", root), ch = $("#ty-ch", root), oC = $("#ty-co", root),
          live = $(".live", root), note = $("#ty-note", root);
      function render() {
        var c = +ch.value;
        para.style.maxWidth = "min(" + c + "ch, 100%)";
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

    /* 06b / typography: center only short lines, and constrain their width. */
    "typography-center": function (root) {
      var block = $("#tyc-block", root), h = $("#tyc-h", root), b = $("#tyc-b", root),
          live = $(".live", root), note = $("#tyc-note", root), segBtns = root.querySelectorAll("[data-mode]");
      var LONG = "Feature descriptions that run on and on can quickly wrap past three centered lines, and when they do the reading becomes a hunt across ragged line starts. This is the kind of paragraph that should never be centered.";
      function render(mode) {
        block.setAttribute("data-mode", mode);
        segBtns.forEach(function (x) { x.setAttribute("aria-pressed", x.dataset.mode === mode ? "true" : "false"); });
        b.textContent = mode === "hero" ? "One short hero line under the title." : LONG;
        live.textContent = mode === "hero" ? "≤ 3 lines · ~½ column" : (mode === "center" ? "6+ lines centered" : "start-aligned prose");
        note.innerHTML = mode === "hero"
          ? 'A <b>short, ceremonial line</b>: ≤ 3 lines, width capped near half the column. Centered type is fine here.'
          : (mode === "center"
            ? 'A <b>paragraph centered</b> wraps past three lines; the ragged start-point fights the eye. Split it, shorten it, or start-align it.'
            : 'Longer content → <b>left/start-aligned</b> at normal paragraph width (7–12 words per line). The F-pattern anchor wins.');
      }
      segBtns.forEach(function (b) { b.addEventListener("click", function () { render(b.dataset.mode); }); });
      render("hero");
    },

    /* 06c / typography: one base × a fixed ratio builds the whole scale. */
    "typography-scale": function (root) {
      var scale = $("#tys-scale", root), r = $("#tys-r", root), base = $("#tys-b", root),
          oR = $("#tys-ro", root), oB = $("#tys-bo", root), live = $(".live", root),
          note = $("#tys-note", root);
      var NAMES = ["H1", "H2", "H3", "H4", "Body", "Caption"];
      function render() {
        var ratio = +r.value, b = +base.value;
        var steps = [b * Math.pow(ratio, 4), b * Math.pow(ratio, 3), b * Math.pow(ratio, 2), b * Math.pow(ratio, 1), b, Math.round(b * 0.82)];
        oR.textContent = ratio.toFixed(3); oB.textContent = b + "px";
        scale.innerHTML = "";
        for (var i = 0; i < NAMES.length; i++) {
          var px = Math.round(steps[i] * 10) / 10;
          var row = document.createElement("div");
          row.className = "tys-row";
          row.innerHTML = '<span class="tys-tag">' + NAMES[i] + '</span>'
            + '<span class="tys-px">' + px + 'px</span>'
            + '<span class="tys-sample" style="font-size:' + px + 'px">Aa</span>';
          scale.appendChild(row);
        }
        var feel = ratio <= 1.15 ? "tight, dense tools" : (ratio <= 1.3 ? "balanced default" : "large, marketing");
        live.textContent = ratio.toFixed(3) + " × " + b + "px · " + feel;
        note.innerHTML = 'Every step is <b>base × ratio<sup>n</sup></b>, never hand-picked. ≤1.2 for dense tools, ~<b>1.25 Major Third</b> as a default, ≥1.4 for marketing.';
      }
      r.addEventListener("input", render);
      base.addEventListener("input", render);
      render();
    },

    /* 06d / typography: size follows viewing distance — now a static three-up
       comparison authored directly in typography.html (no JS state needed). */

    /* 07 / layout spacing: full-bleed section rules vs space + surface tier. */
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

    /* 07b / layout spacing: every gap derives from a 4px base. */
    "layout-spacing-scale": function (root) {
      var row = $("#lss-row", root), read = $("#lss-read", root), gap = $("#lss-gap", root),
          oG = $("#lss-go", root), live = $(".live", root), note = $("#lss-note", root),
          snapBtn = $("#lss-snap", root), freeBtn = $("#lss-free", root), snap = true;
      function render() {
        var raw = +gap.value, val = snap ? Math.round(raw / 4) * 4 : raw;
        row.style.setProperty("--lss-gap", val + "px");
        oG.textContent = raw + " px";
        snapBtn.setAttribute("aria-pressed", snap ? "true" : "false");
        freeBtn.setAttribute("aria-pressed", snap ? "false" : "true");
        var onScale = val % 4 === 0;
        live.textContent = (snap ? "snapped " : "free ") + val + " px";
        read.innerHTML = snap
          ? (raw % 4 === 0 ? '<b>' + val + 'px</b>, already on the 4× scale ✓' : 'raw <b>' + raw + 'px</b> → snapped to <b>' + val + 'px</b> ✓')
          : (onScale ? '<b>' + val + 'px</b> ✓ on the scale' : '<b>' + val + 'px</b> ✗ off-scale, why is this 33 and not 32?');
        note.innerHTML = 'Every margin, padding, and gap derives from <b>4, 8, 12, 16, 24, 32, 48…</b>. Things line up and <b>fit</b> without pixel-nudging. Off-scale values are the tell of hand-picked spacing.';
      }
      gap.addEventListener("input", render);
      snapBtn.addEventListener("click", function () { snap = true; render(); });
      freeBtn.addEventListener("click", function () { snap = false; render(); });
      render();
    },

    /* 07c / layout spacing: proximity groups related elements. */
    "layout-spacing-group": function (root) {
      var form = $("#lsg-form", root), live = $(".live", root), note = $("#lsg-note", root),
          segBtns = root.querySelectorAll("[data-model]");
      function render(mode) {
        form.setAttribute("data-model", mode);
        segBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.model === mode ? "true" : "false"); });
        live.textContent = mode === "prox" ? "label→field tight · fields apart" : "everything equidistant";
        note.innerHTML = mode === "prox"
          ? 'Each label sits <b>close to its own field</b>, and unrelated fields sit further apart, grouping by proximity, no boxes needed. Prefer spacing over containers.'
          : 'Even spacing everywhere: the label drifts toward the neighbouring field and the <b>grouping reads wrong</b>. Proximity is the lightest grouping cue, use it.';
      }
      segBtns.forEach(function (b) { b.addEventListener("click", function () { render(b.dataset.model); }); });
      render("prox");
    },

    /* 08a / components, clickable cards: whole card is the hit target. */
    "components-cards": function (root) {
      var card = $("#cpc-card", root), btn = $("#cpc-btn", root), meter = $("#cpc-meter", root),
          live = $(".live", root), note = $("#cpc-note", root), segBtns = root.querySelectorAll("[data-mode]"),
          mode = "card", total = 0, land = 0;
      function render() {
        card.setAttribute("data-mode", mode);
        segBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.mode === mode ? "true" : "false"); });
        live.textContent = mode === "card" ? "whole card = one link" : "button is the only hit target";
        note.innerHTML = mode === "card"
          ? 'The <b>whole card is the link</b>: one tab stop, pointer + hover on the shell, clicks on the padding count. Try clicking the empty space.'
          : 'Only the small button navigates; the padding around it is a <b>dead zone</b>. Click anywhere off the button, nothing happens.';
      }
      card.addEventListener("click", function (e) {
        var isBtn = !!e.target.closest("#cpc-btn");
        total++;
        if (mode === "card" || isBtn) {
          land++;
          card.classList.add("cpc-flash"); setTimeout(function () { card.classList.remove("cpc-flash"); }, 260);
          meter.classList.remove("dead");
        } else {
          meter.classList.add("dead");
        }
        meter.innerHTML = '<b>' + land + '</b> / ' + total + ' clicks land' + (mode === "card" || isBtn ? "" : " · dead zone");
      });
      segBtns.forEach(function (b) { b.addEventListener("click", function () { mode = b.dataset.mode; render(); }); });
      render();
    },

    /* 08b / components, buttons: uneven icon-side padding is a HUGGING trick.
       Toggle icon side (left/right/none) × width (hug/fill). Fill spans the
       container, so its padding is symmetric — the ½-inset only applies to hug. */
    "components-button": function (root) {
      var btn = $("#cp-btn", root), guide = $("#cp-guide", root), live = $(".live", root),
          note = $("#cp-note", root), iconBtns = root.querySelectorAll("[data-icon]"),
          widthBtns = root.querySelectorAll("[data-width]"),
          icon = "right", width = "hug", TEXT = 24, HALF = 12;
      var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>';
      function render() {
        var lbl = '<span>Get the skill</span>';
        var fill = width === "fill";
        btn.classList.toggle("fill", fill);
        btn.innerHTML = icon === "left" ? ICON + lbl : (icon === "right" ? lbl + ICON : lbl);
        if (fill) {
          // Container-width button: padding is symmetric, content centers.
          btn.style.paddingLeft = TEXT + "px"; btn.style.paddingRight = TEXT + "px";
          live.textContent = "fill · L " + TEXT + " · R " + TEXT;
          guide.textContent = icon === "none"
            ? "fill · symmetric padding, label centered"
            : "fill · full width · padding symmetric, content centered";
        } else if (icon === "left") {
          btn.style.paddingLeft = HALF + "px"; btn.style.paddingRight = TEXT + "px";
          live.textContent = "hug · L " + HALF + " · R " + TEXT;
          guide.textContent = "hug · left = icon side (½) · right = text side";
        } else if (icon === "right") {
          btn.style.paddingLeft = TEXT + "px"; btn.style.paddingRight = HALF + "px";
          live.textContent = "hug · L " + TEXT + " · R " + HALF;
          guide.textContent = "hug · left = text side · right = icon side (½)";
        } else {
          btn.style.paddingLeft = TEXT + "px"; btn.style.paddingRight = TEXT + "px";
          live.textContent = "hug · L " + TEXT + " · R " + TEXT;
          guide.textContent = "hug · no icon · symmetric padding";
        }
        iconBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.icon === icon ? "true" : "false"); });
        widthBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.width === width ? "true" : "false"); });
        note.innerHTML = fill
          ? 'A <b>fill</b> button takes the container’s full width, so its padding is <b>symmetric</b> and the label (with any icon) sits centered. The uneven icon-side inset is a <b>hugging-button</b> trick, it doesn’t apply here.'
          : (icon === "none"
            ? 'No icon → padding is <b>symmetric</b> and the label sits centered.'
            : 'On a <b>hugging</b> button the icon side is inset about <b>half</b> the text side (' + HALF + ' ≈ ½ · ' + TEXT + '), so the icon sits in a visual square instead of drifting to the edge.');
      }
      iconBtns.forEach(function (b) { b.addEventListener("click", function () { icon = b.dataset.icon; render(); }); });
      widthBtns.forEach(function (b) { b.addEventListener("click", function () { width = b.dataset.width; render(); }); });
      render();
    },

    /* 08c / components: three button weights, hierarchy beyond colour. */
    "components-weights": function (root) {
      var row = $("#cpw-row", root), live = $(".live", root), note = $("#cpw-note", root),
          segBtns = root.querySelectorAll("[data-sec]");
      function render(mode) {
        row.setAttribute("data-sec", mode);
        segBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.sec === mode ? "true" : "false"); });
        live.textContent = mode === "outline" ? "primary · outline · text" : "primary · grey fill · text";
        note.innerHTML = mode === "outline"
          ? 'Primary (solid accent), secondary (outline + accent text), tertiary (text). Three weights told apart <b>without hue alone</b>, colour-blind safe.'
          : 'A light-grey secondary fill <b>reads as disabled</b>, it looks dead even though it works. Use an outline instead; the hierarchy must survive at a glance.';
      }
      segBtns.forEach(function (b) { b.addEventListener("click", function () { render(b.dataset.sec); }); });
      render("outline");
    },

    /* 09 / motion budget: hover or click the track for a full-span sweep with
       the chosen duration + easing; the slider/select retune the recipe live
       and flag when it blows the 150ms budget. */
    "motion": function (root) {
      var track = $("#mo-track", root), dot = $("#mo-box", root), live = $(".live", root),
          dur = $("#mo-dur", root), ease = $("#mo-ease", root), oD = $("#mo-do", root);
      if (reduced) root.setAttribute("data-reduced", "true");
      function render() {
        var d = +dur.value;
        oD.textContent = d + " ms";
        live.textContent = d + "ms · " + ease.options[ease.selectedIndex].text + (d > 150 ? " · over budget" : "");
        track.classList.toggle("over", d > 150);
        track.style.setProperty("--mo-dur", d + "ms");
        track.style.setProperty("--mo-ease", ease.value);
      }
      function setTravel() {
        track.style.setProperty("--travel", Math.max(0, track.offsetWidth - dot.offsetWidth - 16) + "px");
      }
      dur.addEventListener("input", render);
      ease.addEventListener("change", render);
      track.addEventListener("click", function () { track.classList.toggle("is-on"); });
      window.addEventListener("resize", setTravel);
      render();
      setTravel();
    },

    /* 09b / motion: frequency gate, three tiers as three tracks. The dot only
       moves (or not) with the budget its tier allows, on hover or click. */
    "motion-frequency": function (root) {
      var rows = root.querySelectorAll(".mt"), live = $(".live", root);
      if (reduced) root.setAttribute("data-reduced", "true");
      function setTravel() {
        rows.forEach(function (t) {
          var d = t.querySelector(".mt-dot");
          t.style.setProperty("--travel", Math.max(0, t.offsetWidth - d.offsetWidth - 16) + "px");
        });
      }
      live.textContent = "hover or click a track to preview its budget";
      rows.forEach(function (t) { t.addEventListener("click", function () { t.classList.toggle("is-on"); }); });
      window.addEventListener("resize", setTravel);
      setTravel();
    },

    /* 09d / motion: animate transform + opacity only, never width/left.
       Same start and end, different property: transform glides, width
       stretches by recomputing layout every frame. */
    "motion-props": function (root) {
      var wrap = $(".mop", root), live = $(".live", root);
      if (reduced) root.setAttribute("data-reduced", "true");
      function setTravel() {
        wrap.querySelectorAll(".mt").forEach(function (t) {
          var d = t.querySelector(".mt-dot");
          t.style.setProperty("--travel", Math.max(0, t.offsetWidth - d.offsetWidth - 16) + "px");
        });
      }
      live.textContent = "transform glides · width reflows layout each frame";
      wrap.addEventListener("click", function () { wrap.classList.toggle("is-on"); });
      window.addEventListener("resize", setTravel);
      setTravel();
    },

    /* 10 / content & copy: fluff vs verb + object, toggle the same UI's labels. */
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
    },

    /* 10b / content & copy: errors state fact + fix, not apology. */
    "content-copy-error": function (root) {
      var msg = $("#coe-msg", root), live = $(".live", root), note = $("#coe-note", root),
          segBtns = root.querySelectorAll("[data-mode]");
      function render(mode) {
        msg.setAttribute("data-mode", mode);
        segBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.mode === mode ? "true" : "false"); });
        msg.innerHTML = mode === "fact"
          ? '<div class="coe-ico">!</div><div class="coe-t">Payment failed: Card declined.</div><div class="coe-d">Try another card, or contact your bank.</div>'
          : '<div class="coe-ico">?</div><div class="coe-t">Oops! Something went wrong.</div><div class="coe-d">We’re sorry for the inconvenience. Please try again later.</div>';
        live.textContent = mode === "fact" ? "what failed + what to do" : "apology + mystery";
        note.innerHTML = mode === "fact"
          ? 'The error says <b>what failed</b> (card declined) and <b>what to do</b> (try another card). No fluff, no false sympathy.'
          : '“Oops! Something went wrong” tells the user <b>nothing</b>. State the cause and the fix, then stop.';
      }
      segBtns.forEach(function (b) { b.addEventListener("click", function () { render(b.dataset.mode); }); });
      render("fact");
    },

    /* 10c / content & copy: cap visible lists at five, split the rest. */
    "content-copy-list": function (root) {
      var list = $("#col-list", root), live = $(".live", root), note = $("#col-note", root),
          segBtns = root.querySelectorAll("[data-mode]");
      var SEVEN = ["Unlimited projects", "Unlimited members", "Version history", "Real-time collaboration", "Priority support", "Custom branding", "API access"];
      var NOW = ["Unlimited projects", "Version history", "Real-time collaboration", "Priority support", "API access"];
      var LATER = ["Custom branding", "Usage analytics"];
      function li(t) { return '<div class="col-li">' + t + '</div>'; }
      function render(mode) {
        segBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.mode === mode ? "true" : "false"); });
        list.setAttribute("data-mode", mode);
        list.innerHTML = mode === "seven"
          ? SEVEN.map(li).join("")
          : '<div class="col-grp">' + NOW.map(li).join("") + '</div>'
            + '<div class="col-grp col-later"><div class="col-grp-lbl">Later / add-on</div>' + LATER.map(li).join("") + '</div>';
        live.textContent = mode === "seven" ? "7 items, one flat list" : "5 now + a “Later” group";
        note.innerHTML = mode === "seven"
          ? 'Seven features in one flat list: <b>decision fatigue</b>. The eye can’t weigh what matters. Cap visible lists at <b>five</b>.'
          : 'Five ranked by user priority, the rest split into <b>“Later / add-on”</b>. Fewer choices, clearer hierarchy.';
      }
      segBtns.forEach(function (b) { b.addEventListener("click", function () { render(b.dataset.mode); }); });
      render("seven");
    },

    /* 10d / content & copy: specific beats vague. */
    "content-copy-specific": function (root) {
      var l1 = $("#cos-line", root), l2 = $("#cos-line2", root), live = $(".live", root),
          note = $("#cos-note", root), segBtns = root.querySelectorAll("[data-mode]");
      var SPEC = [["About 2 minutes", "one-time setup"], ["Up to 10 files, 25 MB each", "PDF, PNG, or Figma"]];
      var VAGUE = [["This only takes a moment", "quick and effortless"], ["Upload files quickly and easily", "seamless, robust, cutting-edge"]];
      function render(mode) {
        var a = mode === "specific" ? SPEC : VAGUE;
        l1.innerHTML = '<b>' + a[0][0] + '</b> <span class="cos-dim">' + a[0][1] + '</span>';
        l2.innerHTML = '<b>' + a[1][0] + '</b> <span class="cos-dim">' + a[1][1] + '</span>';
        segBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.mode === mode ? "true" : "false"); });
        live.textContent = mode === "specific" ? "named limits + units" : "empty claims";
        note.innerHTML = mode === "specific"
          ? 'Real numbers and units: <b>2 minutes</b>, <b>10 files</b>, <b>25 MB</b>. The claim becomes checkable. If you don’t know the number, omit the claim.'
          : '“A moment”, “quick”, “easy”, <b>fuzzy promises</b> with no meaning. Replace vague claims with concrete units when time or scope matters.';
      }
      segBtns.forEach(function (b) { b.addEventListener("click", function () { render(b.dataset.mode); }); });
      render("specific");
    },

    /* 11 / accessibility: name + focus + target size on one icon button. */
    "accessibility": function (root) {
      var btn = $("#ax-btn", root), sr = $("#ax-sr", root), srtxt = $("#ax-sr-txt", root),
          nameBtns = root.querySelectorAll("[data-name]"), focusBtns = root.querySelectorAll("[data-focus]"),
          size = $("#ax-size", root),
          oS = $("#ax-so", root), live = $(".live", root), note = $("#ax-note", root),
          named = true, foc = true;
      function press(btns, key, on) {
        btns.forEach(function (b) { b.setAttribute("aria-pressed", (b.dataset[key] === "on") === on ? "true" : "false"); });
      }
      function render() {
        var s = +size.value;
        press(nameBtns, "name", named); press(focusBtns, "focus", foc);
        btn.style.width = btn.style.height = s + "px";
        btn.classList.toggle("show-focus", foc);
        sr.classList.toggle("unnamed", !named);
        srtxt.textContent = named ? "Delete item, button" : "button";
        oS.textContent = s + "px";
        live.textContent = s + "px · " + (named ? "named" : "unnamed") + (foc ? " · focus" : "");
        note.innerHTML = !named
          ? 'Unlabeled icon button, a screen reader just says <b>“button.”</b> Add an <span class="kbd">aria-label</span>.'
          : (!foc
            ? 'Named, but with <b>no visible focus</b> a keyboard user can’t see where they are. Keep a <span class="kbd">:focus-visible</span> ring.'
            : (s < 44
              ? 'Named and focusable, but the target is <b>' + s + 'px</b>, under the <b>44px</b> minimum. Grow it.'
              : 'Named, focusable, and ≥ <b>44px</b>. Usable by mouse, keyboard, and assistive tech.'));
      }
      nameBtns.forEach(function (b) { b.addEventListener("click", function () { named = b.dataset.name === "on"; render(); }); });
      focusBtns.forEach(function (b) { b.addEventListener("click", function () { foc = b.dataset.focus === "on"; render(); }); });
      size.addEventListener("input", render);
      render();
    },

    /* 11b / accessibility: meaning must never live in colour alone. */
    "accessibility-color": function (root) {
      var wrap = $(".axc-wrap", root), err = $("#axc-err", root), live = $(".live", root),
          note = $("#axc-note", root), modeBtns = root.querySelectorAll("[data-mode]"),
          visBtns = root.querySelectorAll("[data-vision]");
      var state = { mode: "color", vision: "typical" };
      function render() {
        var m = state.mode, v = state.vision;
        wrap.setAttribute("data-mode", m);
        root.setAttribute("data-vision", v);
        modeBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.mode === m ? "true" : "false"); });
        visBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.vision === v ? "true" : "false"); });
        err.innerHTML = m === "color"
          ? ""
          : '<span class="axc-err-ico" aria-hidden="true">!</span> Enter a valid 16-digit card number.';
        live.textContent = (m === "color" ? "red border only" : "border + text + icon")
          + (v === "deutan" ? " · deuteranopia" : v === "mono" ? " · achromatopsia" : "");
        if (m === "color" && v === "typical")
          note.innerHTML = 'The only cue is the red border. Toggle <b>Deuteranopia</b> or <b>Achromatopsia</b> to see why it fails: colour-blind users lose the hue, so the error loses its meaning.';
        else if (m === "color" && v === "deutan")
          note.innerHTML = 'Under deuteranopia the whole card shifts hue and the red border muddies into the frame. <b>Colour alone doesn’t reach ~1 in 12 men</b>.';
        else if (m === "color" && v === "mono")
          note.innerHTML = 'Under achromatopsia the whole card collapses to greys. The red border reads as just a darker frame, <b>no message, no icon, no error state</b>.';
        else if (m === "cue" && v === "typical")
          note.innerHTML = 'The same error, now with <b>a message and an icon</b>. Colour points at it; text and icon carry the meaning. Never encode by hue alone.';
        else if (m === "cue" && v === "deutan")
          note.innerHTML = 'Even when colour is lost, the <b>icon and message still carry the error</b>. Colour augments the cue; it never has to carry it alone.';
        else
          note.innerHTML = 'Fully monochrome, the <b>icon and message still carry the error</b>. Text and shape survive the loss of every hue.';
      }
      modeBtns.forEach(function (b) { b.addEventListener("click", function () { state.mode = b.dataset.mode; render(); }); });
      visBtns.forEach(function (b) { b.addEventListener("click", function () { state.vision = b.dataset.vision; render(); }); });
      render();
    },

    /* 11c / accessibility: native elements ship keyboard behaviour for free. */
    "accessibility-keyboard": function (root) {
      var native = $("#axk-native", root), div = $("#axk-div", root), read = $("#axk-read", root),
          live = $(".live", root), note = $("#axk-note", root);
      function report(msg, bad) {
        read.textContent = msg;
        read.classList.toggle("bad", !!bad);
      }
      native.addEventListener("click", function () { report("Native <button>: click, Enter, and Space all fire the action."); });
      div.addEventListener("click", function () { report("The div works with a mouse click, but that’s it."); });
      div.addEventListener("focus", function () { report("div focused. Now press Enter or Space…"); });
      div.addEventListener("keydown", function (e) {
        if (e.key === "Enter") report("Enter did nothing, you’d have to wire keydown yourself.", true);
        else if (e.key === " ") report("Space scrolled the page instead of activating the control.", true);
      });
      native.addEventListener("focus", function () { report("Native button focused. Enter / Space will activate it."); });
      live.textContent = "mouse, keyboard, and touch all work";
      note.innerHTML = 'A native <span class="kbd">&lt;button&gt;</span> gives focus, Enter/Space, and announcements <b>for free</b>. A <span class="kbd">div</span> + onClick needs all of it hand-rolled, and usually misses. Prefer native elements.';
    },

    /* 12 / UX & states: cycle a component through loading / empty / error / content. */
    "ux": function (root) {
      var panel = $("#ux-panel", root), live = $(".live", root), note = $("#ux-note", root),
          segBtns = root.querySelectorAll("[data-state]"), state = "content";
      var views = {
        loading: '<div class="ux-sk"></div><div class="ux-sk"></div><div class="ux-sk short"></div>',
        empty: '<div class="ux-msg"><div class="ux-ill"></div><div class="ux-t">No projects yet</div><div class="ux-d">Create your first project to get started.</div><button class="ux-cta">Create project</button></div>',
        error: '<div class="ux-msg"><div class="ux-ico">!</div><div class="ux-t">Couldn’t load projects</div><div class="ux-d">Check your connection and try again.</div><button class="ux-cta ghost">Retry</button></div>',
        content: '<div class="ux-item"><span></span>Onboarding revamp</div><div class="ux-item"><span></span>Billing v2</div><div class="ux-item"><span></span>Mobile nav</div>'
      };
      var notes = {
        loading: 'A <b>skeleton</b> holds the layout while data loads, no blank flash, no jump when it arrives.',
        empty: 'The empty state <b>explains what goes here</b> and offers the first action, not a bare “No data”.',
        error: 'The error says <b>what failed and what to do</b>, and keeps the user’s place. Never a dead end.',
        content: 'The happy path, easy to design, but it’s <b>one of four</b> states users actually hit.'
      };
      function render() {
        panel.className = "ux-panel state-" + state;
        panel.innerHTML = views[state];
        segBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.state === state ? "true" : "false"); });
        live.textContent = state + " state";
        note.innerHTML = notes[state];
      }
      segBtns.forEach(function (b) { b.addEventListener("click", function () { state = b.dataset.state; render(); }); });
      render();
    },

    /* 12b / UX: destructive actions confirm, and the confirm names the action. */
    "ux-destructive": function (root) {
      var del = $("#uxd-del", root), confirm = $("#uxd-confirm", root), name = $(".uxd-name", root),
          live = $(".live", root), note = $("#uxd-note", root), segBtns = root.querySelectorAll("[data-mode]"),
          mode = "none", open = false;
      function render() {
        segBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.mode === mode ? "true" : "false"); });
        live.textContent = mode === "none" ? "delete on first click" : (mode === "ok" ? "confirm says OK" : "confirm names the action");
        note.innerHTML = mode === "none"
          ? 'One careless click and the file is gone. Destructive and irreversible actions <b>ask first</b>, or offer undo.'
          : (mode === "ok"
            ? 'A confirm appears, but the button says <b>“OK”</b>, it doesn’t say what’s about to happen. The confirm button should <b>name the action</b>.'
            : 'The confirm names the action (<b>“Delete Draft report Q3”</b>), not “OK”. The user confirms exactly what they asked for, and the destructive control is demoted, not styled like the primary one.');
      }
      function close() { open = false; confirm.innerHTML = ""; }
      del.addEventListener("click", function () {
        if (mode === "none") { name.textContent = "Deleted (no undo)"; close(); return; }
        if (open) { close(); return; }
        open = true;
        var label = mode === "ok" ? "Delete item?" : "Delete “Draft report Q3”?";
        var yes = mode === "ok" ? "OK" : "Delete";
        confirm.innerHTML = '<div class="uxd-cbox"><div class="uxd-ct">' + label + '</div>'
          + '<div class="uxd-ca"><button type="button" class="uxd-c-yes">' + yes + '</button>'
          + '<button type="button" class="uxd-c-no">Cancel</button></div></div>';
        confirm.querySelector(".uxd-c-yes").addEventListener("click", function () {
          name.textContent = "Deleted after confirm";
          close();
        });
        confirm.querySelector(".uxd-c-no").addEventListener("click", close);
      });
      segBtns.forEach(function (b) { b.addEventListener("click", function () { mode = b.dataset.mode; close(); render(); }); });
      render();
    },

    /* 12c / UX: kill dead zones, the whole label toggles. */
    "ux-deadzone": function (root) {
      var label = $("#uxz-label", root), box = $("#uxz-box", root), read = $("#uxz-read", root),
          live = $(".live", root), note = $("#uxz-note", root), segBtns = root.querySelectorAll("[data-mode]");
      function render(mode) {
        label.setAttribute("data-mode", mode);
        segBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.mode === mode ? "true" : "false"); });
        live.textContent = mode === "whole" ? "text + box = one target" : "box is the only target";
        note.innerHTML = mode === "whole"
          ? 'Click anywhere on the pill, <b>the whole control is interactive</b>, box, text, and the padding between. No dead zone.'
          : 'Only the tiny box toggles; clicking the text or padding does nothing. A dead zone, and a miss for every imprecise tap. Padding, not margin, should carry the hit area.';
      }
      function sync() {
        read.textContent = "checked: " + box.checked + (label.getAttribute("data-mode") === "box" ? " · text click does nothing" : " · text click toggles too");
      }
      box.addEventListener("change", sync);
      label.addEventListener("click", function (e) {
        if (e.target === box) return;
        if (label.getAttribute("data-mode") === "whole") {
          box.checked = !box.checked;
          sync();
        } else {
          read.textContent = "you clicked the text, nothing happened";
        }
      });
      segBtns.forEach(function (b) { b.addEventListener("click", function () { render(b.dataset.mode); sync(); }); });
      render("whole"); sync();
    },

    /* 12d / UX: labels above fields, inputs ≥ 16px on mobile web. */
    "ux-form": function (root) {
      var form = $("#uxf-form", root), lbl = $("#uxf-lbl", root), inp = $("#uxf-in", root),
          live = $(".live", root), note = $("#uxf-note", root),
          segBtns = root.querySelectorAll("[data-mode]");
      function render(mode) {
        form.setAttribute("data-mode", mode);
        segBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.mode === mode ? "true" : "false"); });
        lbl.classList.toggle("visually-hidden", mode === "bad");
        inp.style.fontSize = mode === "bad" ? "14px" : "16px";
        live.textContent = mode === "good" ? "real label · 16px input" : "placeholder label · 14px";
        note.innerHTML = mode === "good"
          ? 'A <b>real label above the field</b> (placeholder is a hint only) and a <b>16px+</b> input, so iOS never auto-zooms on focus.'
          : 'Placeholder as the only label <b>vanishes on focus</b> and fails contrast; 14px triggers iOS focus-zoom. Label above, always visible, input ≥ 16px on mobile web.';
      }
      segBtns.forEach(function (b) { b.addEventListener("click", function () { render(b.dataset.mode); }); });
      render("good");
    },

    /* 13 / design systems: 3 tokens drive every component in a mini UI at once. */
    "design-systems": function (root) {
      var mini = $("#ds-mini", root), hue = $("#ds-hue", root), rad = $("#ds-rad", root),
          sp = $("#ds-space", root), oH = $("#ds-ho", root), oR = $("#ds-ro", root),
          oS = $("#ds-so", root), live = $(".live", root), note = $("#ds-note", root);
      function render() {
        var h = +hue.value, r = +rad.value, s = +sp.value;
        mini.style.setProperty("--ds-h", h);
        mini.style.setProperty("--ds-r", r + "px");
        mini.style.setProperty("--ds-s", s + "px");
        oH.textContent = h + "°"; oR.textContent = r + "px"; oS.textContent = s + "px";
        live.textContent = "3 tokens · every component";
        note.innerHTML = 'Every element reads from the same <b>tokens</b>: one hue drives the accent, authored in <b>OKLCH</b> so white-on-accent contrast holds as you drag it, and inner radii derive from <b>parent − padding</b>, concentric, never equal. One source of truth, no stray hexes.';
      }
      [hue, rad, sp].forEach(function (el) { el.addEventListener("input", render); });
      render();
    },

    /* 13b / design systems: compose atoms → molecules → organisms. */
    "design-systems-atomic": function (root) {
      var track = $("#dsa-track", root), name = $("#dsa-name", root), live = $(".live", root),
          note = $("#dsa-note", root), segBtns = root.querySelectorAll("[data-level]");
      function atom(label, cls) { return '<div class="dsa-atom ' + cls + '">' + label + '</div>'; }
      var LEVELS = {
        atoms: { name: "atoms · button, icon, input", html: atom("Button", "a-btn") + atom("Icon", "a-icon") + atom("Input", "a-input") },
        molecule: { name: "molecule · search field = input + icon + button", html: '<div class="dsa-mol">' + atom("⌕", "a-icon") + atom("Search…", "a-input grow") + atom("Go", "a-btn") + '</div>' },
        organism: { name: "organism · top nav = logo + search + links", html: '<div class="dsa-org">' + atom("logo", "a-logo") + atom("⌕", "a-icon") + atom("Link", "a-link") + atom("Link", "a-link") + atom("C", "a-avatar") + '</div>' }
      };
      function render(level) {
        var L = LEVELS[level];
        track.setAttribute("data-level", level);
        track.innerHTML = L.html;
        name.textContent = L.name;
        segBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.level === level ? "true" : "false"); });
        live.textContent = L.name;
        note.innerHTML = 'Build the <b>smallest pieces first</b>, then assemble up: atoms (button, icon, input) → molecules (search field) → organisms (nav). Each layer is <b>modular, composable, and reused</b>, not copy-pasted per screen.';
      }
      segBtns.forEach(function (b) { b.addEventListener("click", function () { render(b.dataset.level); }); });
      render("atoms");
    },

    /* 13c / design systems: elevation is a standardised scale; dark mode lifts luminance. */
    "design-systems-elevation": function (root) {
      var live = $(".live", root), note = $("#dse-note", root),
          segBtns = root.querySelectorAll("[data-theme]");
      var start = document.documentElement.getAttribute("data-theme")
        || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      function render(theme) {
        root.setAttribute("data-theme", theme);
        segBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.theme === theme ? "true" : "false"); });
        live.textContent = theme === "dark" ? "dark · higher = lighter" : "light · elevation via shadow";
        note.innerHTML = theme === "dark"
          ? 'In <b>dark mode</b>, surfaces <b>closer to the user get lighter</b>, the base is darkest, each layer above lifts. Depth comes from a <b>standardised scale</b>, not ad-hoc shadows.'
          : 'In <b>light mode</b> the same scale carries the stack via shadow, keeping the relative brightness order. One ramp, both modes, elevation governs luminance.';
      }
      segBtns.forEach(function (b) { b.addEventListener("click", function () { render(b.dataset.theme); }); });
      render(start);
    },

    /* 14 / principles: prototype fidelity slider, low-fi invites feedback and is cheap to change. */
    "principles": function (root) {
      var mock = $("#pr-mock", root), fi = $("#pr-fi", root), oF = $("#pr-fo", root),
          live = $(".live", root), note = $("#pr-note", root);
      function render() {
        var f = +fi.value, level = f < 34 ? "sketch" : (f < 67 ? "wire" : "hifi");
        mock.className = "pr-mock lvl-" + level;
        oF.textContent = level === "sketch" ? "sketch" : (level === "wire" ? "wireframe" : "hi-fi");
        live.textContent = (level === "sketch" ? "low" : (level === "wire" ? "medium" : "high")) + " fidelity";
        note.innerHTML = level === "hifi"
          ? 'Polished pixels <b>look finished</b>, people hesitate to critique them and every change is expensive. Save this for last.'
          : (level === "wire"
            ? 'Wireframe fidelity, enough to test flow and layout, still cheap to change.'
            : 'A rough sketch <b>invites honest feedback</b> and costs nothing to redo. Start here: pencils before pixels.');
      }
      fi.addEventListener("input", render);
      render();
    },

    /* 14b / principles: diverge into many sketches, then converge on one. */
    "principles-flow": function (root) {
      var svg = $("#prf-svg", root), read = $("#prf-read", root), prog = $("#prf-prog", root),
          oP = $("#prf-co", root), play = $("#prf-play", root), live = $(".live", root),
          note = $("#prf-note", root), raf = null;
      var P = [70, 100], S = [396, 100], W = 460, H = 200;
      var FAN = [
        { x: 120, y: 60 }, { x: 185, y: 95 }, { x: 232, y: 100 },
        { x: 280, y: 105 }, { x: 340, y: 140 }
      ];
      function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
      function lerp(a, b, t) { return a + (b - a) * t; }
      function render() {
        var p = +prog.value;
        oP.textContent = p;
        var phase = p < 45 ? "diverge" : (p < 70 ? "converge" : "decide");
        live.textContent = phase;
        read.textContent = phase === "diverge"
          ? "Diverge: how might we…? Generate many low-fi options before committing."
          : (phase === "converge"
            ? "Converge: pull the sketches back into one direction."
            : "Decide: one solution, then iterate with feedback.");
        var s = "";
        s += '<circle cx="' + P[0] + '" cy="' + P[1] + '" r="13" class="prf-node prf-problem"/>';
        s += '<text x="' + P[0] + '" y="' + (P[1] + 26) + '" text-anchor="middle" class="prf-lab">problem</text>';
        var t1 = clamp(p / 45, 0, 1), t2 = clamp((p - 45) / 25, 0, 1);
        for (var i = 0; i < FAN.length; i++) {
          var f = FAN[i];
          var d1 = clamp(t1 * 45 - i * 6, 0, 45) / 45;         // stagger the fan-out
          var d2 = clamp(t2 * 25 - i * 4, 0, 25) / 25;         // stagger the collapse
          var sx = lerp(P[0], f.x, d1), sy = lerp(P[1], f.y, d1);
          sx = lerp(sx, S[0], d2); sy = lerp(sy, S[1], d2);
          if (d1 > 0.02) s += '<line x1="' + P[0] + '" y1="' + P[1] + '" x2="' + sx + '" y2="' + sy + '" class="prf-line"/>';
          var done = d2 >= 1;
          s += '<rect x="' + (sx - 6) + '" y="' + (sy - 6) + '" width="12" height="12" rx="2" class="' + (done ? 'prf-sk prf-sk-in' : 'prf-sk') + '"/>';
        }
        var glow = p >= 70;
        s += '<circle cx="' + S[0] + '" cy="' + S[1] + '" r="' + (glow ? 17 : 13) + '" class="' + (glow ? 'prf-node prf-sol glow' : 'prf-node prf-sol') + '"/>';
        s += '<text x="' + S[0] + '" y="' + (S[1] + 26) + '" text-anchor="middle" class="prf-lab">one decision</text>';
        if (p >= 45) s += '<line x1="' + P[0] + '" y1="' + P[1] + '" x2="' + S[0] + '" y2="' + S[1] + '" class="prf-rail"/>';
        svg.innerHTML = s;
      }
      function playTo() {
        if (raf) cancelAnimationFrame(raf);
        var from = +prog.value, to = from >= 100 ? 0 : 100, start = performance.now(), dur = 2200;
        (function step(now) {
          var t = clamp((now - start) / dur, 0, 1);
          var ease = 1 - Math.pow(1 - t, 3);
          prog.value = Math.round(lerp(from, to, ease));
          render();
          if (t < 1) raf = requestAnimationFrame(step);
        })(start);
      }
      prog.addEventListener("input", function () { if (raf) cancelAnimationFrame(raf); render(); });
      play.addEventListener("click", playTo);
      note.innerHTML = 'Sketch <b>many low-fi options</b> before converging on one. Pencils before pixels, polished work too early shuts down exploration and pulls critique toward colour instead of the idea.';
      render();
    },

    /* 14c / principles: sharing low-fi work invites critique that hi-fi suppresses. */
    "principles-share": function (root) {
      var sketch = $("#prs-sketch", root), fb = $("#prs-fb", root), live = $(".live", root),
          note = $("#prs-note", root), segBtns = root.querySelectorAll("[data-mode]");
      var FEED = [
        "does the flow make sense? try moving the CTA up",
        "can we drop the third step?",
        "what happens on mobile?",
        "the title should lead with the action"
      ];
      function render(mode) {
        sketch.setAttribute("data-mode", mode);
        fb.setAttribute("data-mode", mode);
        sketch.innerHTML = mode === "low"
          ? '<div class="prs-wire prs-w-t"></div><div class="prs-wire prs-w-img"></div><div class="prs-wire prs-w-line"></div><div class="prs-wire prs-w-btn"></div>'
          : '<div class="prs-hi-img"></div><div class="prs-hi-t">Project Alpha</div><div class="prs-hi-b">A short summary.</div><button type="button" class="prs-hi-btn">View project</button>';
        fb.innerHTML = mode === "low"
          ? FEED.map(function (f, i) { return '<div class="prs-fb-bubble" style="animation-delay:' + (i * 90) + 'ms">' + f + '</div>'; }).join("")
          : '<div class="prs-fb-none">“looks great!” … nothing useful</div>';
        segBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.mode === mode ? "true" : "false"); });
        live.textContent = mode === "low" ? "4 rounds of honest critique" : "0 rounds of honest critique";
        note.innerHTML = mode === "low"
          ? 'A rough sketch <b>invites critique</b>, people read it as a work-in-progress and give real feedback.'
          : 'Polished pixels <b>suppress critique</b>: people assume it’s done and hold back. Share early and often; frame feedback against goals, not taste.';
      }
      segBtns.forEach(function (b) { b.addEventListener("click", function () { render(b.dataset.mode); }); });
      render("low");
    }
  };

  Object.keys(DEMOS).forEach(function (key) {
    var root = document.getElementById("demo-" + key);
    if (root) DEMOS[key](root);
  });
})();
