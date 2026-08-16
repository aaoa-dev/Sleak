"""Per-rule interactive demo markup, injected by build_rules.py.
IDs here are the contract with docs/assets/demos.js, keep them in sync."""

# slug -> (stage_html, controls_html, note_id or "")
PARTS = {

"concentric-radius": (
  '<div class="cc-parent" id="cc-parent" style="padding:16px"><div class="cc-child" id="cc-child">inner</div></div>',
  '<div class="ctl"><label>Parent radius <output id="cc-ro"></output></label><input id="cc-r" type="range" min="0" max="40" value="28"></div>'
  '<div class="ctl"><label>Padding <output id="cc-po"></output></label><input id="cc-p" type="range" min="0" max="32" value="16"></div>'
  '<div class="ctl"><label>Contrast</label><div class="seg"><button type="button" id="cc-same" aria-pressed="false">Force equal radii (wrong)</button></div></div>',
  "cc-note"),

"section-eyebrows": (
  '<div id="se-stage"></div>',
  '<div class="ctl"><label>Sections on page <output id="se-co"></output></label><input id="se-count" type="range" min="1" max="5" value="3"></div>'
  '<div class="ctl"><label>Eyebrows</label><div class="seg"><button type="button" id="se-eye" aria-pressed="true">Toggle eyebrows</button></div></div>',
  "se-note"),

"intentional-accent": (
  '<div class="ia-ui">'
  '<div class="ia-row"><div class="ia-chip">Overview</div><div class="ia-chip">Reports</div><div class="ia-chip">Settings</div></div>'
  '<div class="ia-row"><div class="ia-chip">Team plan</div><div class="ia-chip">Usage</div></div>'
  '<div class="ia-row" style="align-items:center;justify-content:space-between;">'
  '<span style="display:flex;gap:.4rem"><span class="ia-dot"></span><span class="ia-dot"></span><span class="ia-dot"></span></span>'
  '<span style="font-size:.78rem;color:var(--muted)">recent activity</span></div>'
  '<div class="ia-cta">Start free trial</div>'
  '</div>',
  '<div class="ctl"><label>Accent strategy</label><div class="seg">'
  '<button type="button" data-mode="focus">One focal point</button>'
  '<button type="button" data-mode="scatter">Accent everywhere</button></div></div>',
  "ia-note"),

"accent-hue-blacks": (
  '<div class="ah-demo"><div class="ah-card">'
  '<div class="ah-ct">Accent-hue neutrals</div>'
  '<div class="ah-cb">Every dark on this page, surfaces, borders, body text, is derived from the same hue as the accent.</div>'
  '<button class="ah-cta">Primary action</button>'
  '</div></div>',
  '<div class="ctl"><label>Accent hue (whole page) <output id="ah-ho"></output></label><input id="ah-hue" type="range" min="0" max="360" value="340"></div>'
  '<div class="ctl"><label>Reset</label><div class="seg"><button type="button" id="ah-reset">Back to 340°</button></div></div>',
  "ah-note"),

"typography": (
  '<p id="ty-para"><b>Typography sets the measure.</b> Line length is characters per line; comfortable reading sits between forty-five and seventy-five, where the eye finds each new line without hunting for its start or snapping back too soon.</p>',
  '<div class="ctl"><label>Measure <output id="ty-co"></output></label><input id="ty-ch" type="range" min="24" max="96" value="58"></div>',
  "ty-note"),

"layout-spacing": (
  '<div id="ls-stage" data-sep="space">'
  '<div class="ls-sec"><div class="ls-h">Features</div><div class="ls-b">Everything you need to ship intentional UI.</div></div>'
  '<div class="ls-sec"><div class="ls-h">Pricing</div><div class="ls-b">Simple plans that scale with your team.</div></div>'
  '<div class="ls-sec"><div class="ls-h">FAQ</div><div class="ls-b">Answers to the questions teams ask most.</div></div>'
  '</div>',
  '<div class="ctl"><label>Section separation</label><div class="seg">'
  '<button type="button" data-sep="space">Space + surface</button>'
  '<button type="button" data-sep="rules">Full-bleed rule</button></div></div>'
  '<div class="ctl"><label>Breathing room <output id="ls-go"></output></label><input id="ls-gap" type="range" min="8" max="48" value="28"></div>',
  "ls-note"),

"components": (
  '<button id="cp-btn"></button>'
  '<div class="cp-guide" id="cp-guide"></div>',
  '<div class="ctl"><label>Icon position</label><div class="seg">'
  '<button type="button" data-icon="left">Left</button>'
  '<button type="button" data-icon="right">Right</button>'
  '<button type="button" data-icon="none">None</button></div></div>',
  "cp-note"),

"motion": (
  '<div id="mo-track"><div id="mo-box"></div></div>',
  '<div class="ctl"><label>Duration <output id="mo-do"></output></label><input id="mo-dur" type="range" min="0" max="600" step="10" value="140"></div>'
  '<div class="ctl"><label>Easing</label><select id="mo-ease">'
  '<option value="cubic-bezier(.22,1,.36,1)">ease-out (expressive)</option>'
  '<option value="ease">ease</option>'
  '<option value="linear">linear</option>'
  '<option value="cubic-bezier(.34,1.56,.64,1)">overshoot</option>'
  '</select></div>'
  '<div class="ctl"><label>Preview</label><button type="button" class="play" id="mo-play">Play ▶</button></div>',
  "mo-note"),

"content-copy": (
  '<div class="co-ui">'
  '<div class="co-h" data-sharp="Add Sleak to your agent" data-fluff="Unlock the full potential of your design workflow"></div>'
  '<div class="co-p" data-sharp="Point any coding agent at SKILL.md. It applies the rules as it builds." '
  'data-fluff="Our comprehensive solution empowers teams to seamlessly leverage best-in-class synergies at scale."></div>'
  '<button class="co-btn" data-sharp="Copy install command" data-fluff="Get started today"></button>'
  '</div>',
  '<div class="ctl"><label>Copy style</label><div class="seg">'
  '<button type="button" data-copy="sharp">Verb + object</button>'
  '<button type="button" data-copy="fluff">Vague + padded</button></div></div>',
  "co-note"),
}


def demo_section(slug):
    if slug not in PARTS:
        return ""
    stage, controls, note_id = PARTS[slug]
    note = f'\n        <div class="demo-note" id="{note_id}"></div>' if note_id else ""
    return f"""
  <section class="demo-section">
    <div class="wrap">
      <div class="demo" id="demo-{slug}">
        <div class="demo-inner">
          <div class="demo-head"><span class="lbl">Try it</span><span class="live"></span></div>
          <div class="demo-stage">{stage}</div>
          <div class="demo-controls">{controls}</div>{note}
        </div>
      </div>
    </div>
  </section>
"""
