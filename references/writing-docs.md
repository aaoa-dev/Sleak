# Writing Sleak's own docs

Not a product-UI rule, this governs how **Sleak's own material** gets written: this file,
the other references, `checklist.md`, `SKILL.md`, `README.md`, and the rendered pages under
`docs/`. Apply it when adding or editing any of them. Adapted from
[technical-writing](sources.md#external-craft-skills), trimmed to what a rules-and-reference
repo needs; the source skill's RFC, commit-message, and tutorial-writing sections don't apply
here and are left out.

## Purpose

Catch the failure mode specific to reference docs: a rule that's technically correct but
costs the reader two reads to parse, a heading that names the topic instead of the point, a
sentence carrying two instructions at once.

## Pick the mode, don't mix it

Two questions decide a document's mode: does it inform *action* or *understanding*, and does
it serve *learning* or *work*.

| | Learning | Work |
|---|---|---|
| **Action** | tutorial | how-to |
| **Understanding** | explanation | reference |

Sleak's reference files are mostly **reference** (the numbered rules, the tables, the CSS
tokens, describe and don't persuade) with **explanation** sections mixed in on purpose (the
`## Why this goes wrong` / `## Notes` sections, where a point of view is allowed). Keep that
split conscious: a rule's numbered items stay dry and complete; the surrounding prose is where
judgment and trade-offs get spelled out. Don't let a numbered rule drift into arguing for
itself, that's what the explanation section is for.

## One instruction, one sentence

A rule item states one checkable thing. Two instructions in one sentence means the reader has
to parse before they can check either. Split them.

Put the condition before the instruction: "When padding is 0, radii may repeat" reads faster
than burying the "when" clause at the end.

## Say who does what

Prefer "the browser clips the corner" to "the corner gets clipped." Passive voice is fine only
when the actor is unknown or beside the point, most CSS-cascade explanations qualify (`the
value that wins` matters more than tracing which rule wrote it).

## Headings carry the point

A rule heading is the finding, not the topic: "Nested corners share one curve axis," not
"Radius." A reference-table heading can be a bare noun phrase ("Do / Don't," "Common
mistakes"), that's a legitimate reference-mode heading, not a violation. Sentence case
throughout, no Title Case.

## Leave no sentence open to two readings

- Keep "only," "not," and "just" next to the word they modify.
- Make every "it," "this," and "that" point at one obvious noun. Repeat the noun if there's
  any doubt, don't lean on a pronoun to carry a whole clause.
- Break up long noun strings ("the accent hue tinted dark neutral rule" → "the rule that tinted
  darks follow the accent hue").
- Say which parts "and"/"or" join when a sentence could group two ways.

## Keep the codebase as the word list

Use the real token, file, or class name, not a paraphrase of it: `--r-card`, not "the card
radius variable." A reader searching the repo for a term you invented finds nothing.

## Review checklist

Run this before merging a new or edited reference:

1. Is the file's primary content one Diátaxis mode, with explanation sections clearly marked
   as such (a `##` heading, not blended into the numbered rules)?
2. Does any rule item carry two instructions? Split it.
3. Is every "only," "it," "this" unambiguous?
4. Would a designer say this term out loud, or is it invented jargon? Use the plain word or the
   real token name.
5. Sentence case on headings, no decorative emoji, no em dash as a general-purpose connector
   (a period or comma does the job).
6. Read the [content-copy.md AI-tell section](content-copy.md#cut-ai-tell-prose-docs-landing-pages-marketing)
   against the new prose. Puffery and chatbot tics apply to Sleak's own docs same as any other.

## Notes

- This file is about **prose quality and structure**. What the prose says (the actual design
  rules) is out of scope, that's the rest of `references/`.
- `content-copy.md`'s AI-tell section and this file overlap by design: that one catalogues
  the patterns to cut, this one covers the structural decisions (mode, heading, sentence
  shape) around them. Apply both.
