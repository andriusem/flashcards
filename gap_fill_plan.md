# Gap Fill Exercise App – Detailed Implementation Plan

This plan describes how to evolve the current **phrasal-verbs-flashcards** React project into an app that drills users with *gap-fill* exercises, following the exact interaction requested on 2025-05-18.

---
## 1. Requirements Recap
1. Render **exactly four** phrasal-verb options in a horizontal line (e.g. _Come in  Come back  Come up  Come down_).
2. Show **one example sentence** below, with the phrasal verb omitted and replaced by `___`.
3. When the **correct** verb is clicked → insert it into the sentence **in bold**.
4. When an **incorrect** verb is clicked →
   * Sentence stays unchanged (gap still visible).
   * The clicked option turns **red** and remains red even after further clicks.
5. Multiple incorrect clicks should accumulate red/highlighted buttons.
6. Remove the existing **language toggle (FR)** completely.
7. Exercises are sourced from `phrasal_verbs` file (markdown-like).

---
## 2. Data Preparation
### 2.1  Define JSON schema (placed in `src/gapFillData.js`)
```js
[
  {
    "verb": "come up",               // correct answer (lower-case)
    "sentence": "They always ___ with great ideas during meetings.",
    "fullSentence": "They always come up with great ideas during meetings.",
    "distractors": ["come in", "come back", "come down"] // 3 wrong options
  },
  ...
]
```
• `distractors` should **not** contain the correct verb and must be **unique**.

### 2.2  Generating the JSON
* **Manual pass**: copy 30–50 of the most useful examples from `phrasal_verbs`.
* **Script (optional)**: write a Node script (`tools/buildGapFillData.js`) that
  1. Reads `phrasal_verbs` file.
  2. Detects headings (e.g. `**come up**`) and bullet sentences.
  3. Builds an object per sentence → correct verb = heading, sentenceGap = sentence with verb replaced by `___`.
  4. Picks 3 random verbs from the full set as distractors.
  5. Outputs JSON to `src/gapFillData.js`.

> Start with manual JSON for 8–12 exercises to unblock UI work; automate later.

---
## 3. Component Architecture Changes

| New/Existing | Component | Purpose |
|--------------|-----------|---------|
| ✨ **New** | `GapFill` | Renders one exercise + internal state/logic. |
| ✨ **New** | `OptionsBar` | Displays 4 verb buttons horizontally. Receives props: `options`, `onSelect`, `disabled`. |
| ✨ **New** | `OptionButton` | Single button that knows if it’s *wrong* (red) or *correct* (bold). |
| 🛠 **Update** | `App.js` | Replace flashcard workflow with navigation through the gap-fill data; remove `language` state & FR button. |
| 🗑 **Remove** | `Flashcard` component & FR toggle logic (can keep file but unused). |

Directory layout:
```
src/
  components/
    GapFill.jsx
    OptionsBar.jsx
    OptionButton.jsx
  gapFillData.js
  App.js
```

---
## 4. UI & State Flow (GapFill component)
1. **Props**: `{ exercise, onNext }` where `exercise` is one object from data.
2. **Local state**:
   ```js
   const [selectedWrong, setSelectedWrong] = useState([]); // array of wrong verbs clicked
   const [solved, setSolved] = useState(false);
   ```
3. **handleSelect(verb)**
   * If `solved` → ignore further clicks.
   * If `verb === exercise.verb` → `setSolved(true)`.
   * Else add verb to `selectedWrong` (if not already there).
4. **Rendering**:
   * **OptionsBar**
     * map over `[...exercise.distractors, exercise.verb].sort(() => 0.5-Math.random())` so answer location is random.
     * For each option:
       * class `wrong` (red) if in `selectedWrong`.
       * class `disabled` (greyed) when `solved`.
   * **Sentence Area**
     * If `solved` → show `fullSentence` with `<strong>{exercise.verb}</strong>` wrapped in `<strong>`.
     * Else show `sentence` (with gap).
5. **Navigation**
   * After a correct answer, show “Next →” button or auto-advance after 800 ms.
   * `App.js` tracks `currentExerciseIdx` & handles shuffle / loop.

---
## 5. CSS/Tailwind Classes
* `.options-bar` → flex row, gap-x-4.
* `.option-btn` → base button style.
* `.option-btn.wrong` → `bg-red-500 text-white`.
* `.option-btn.correct` → option could stay highlighted (`bg-green-500`), or simply let the inserted bold verb serve as feedback.
* `.sentence` → `text-xl text-center mt-8`.
* `.sentence strong` → `font-bold`.

Add new rules in `src/styles/gapFill.css` or migrate to Tailwind (already installed).

---
## 6. Removing FR Toggle
1. Delete FR & EN buttons from `App.js` (lines 47–60 in current file).
2. Remove `language` state & all related props in descendant components.
3. Delete CSS classes referencing `.language-btn`.

---
## 7. Progressive Migration Steps
1. **Branch**: create git branch `feature/gap-fill`.
2. **Data**: craft initial `gapFillData.js` with ~10 entries.
3. **Components**: build `GapFill`, `OptionsBar`, `OptionButton`.
4. **App.js**: stub navigation (prev/next & counter) recycling existing arrow buttons.
5. **Styling**: quick Tailwind styling pass.
6. **QA**: manual tests – wrong selection persists red, correct inserts bold verb & disables buttons.
7. **Expand Data**: run script to generate 100+ exercises.
8. **Cleanup**: remove obsolete code / styles; ensure tests pass.
9. **Commit & deploy**: Netlify redeploy.

---
## 8. Optional Enhancements (post-MVP)
* Streak counter (% correct on first try).
* Timer & leaderboard.
* Responsive design – mobile first.
* Keyboard shortcuts (1-4 to pick options).
* Accessibility labels.

---
## 9. Testing Checklist
- [ ] **Rendering**: four options & sentence appear.
- [ ] **Correct click** inserts bold verb & disables bar.
- [ ] **Wrong click** keeps gap, button turns red, persists over time.
- [ ] Multiple wrong clicks show cumulative red buttons.
- [ ] Cannot switch to FR; no FR elements in DOM.
- [ ] Navigation works (`←` `→` or buttons).

---
## 10. Work Estimates
| Task | ETA |
|------|-----|
| Data curation (10 items) | 0.5 h |
| Build **GapFill** components | 1.5 h |
| App.js refactor | 0.5 h |
| Styling & polish | 1 h |
| Build data-gen script | 1 h |
| QA & fixes | 0.5 h |
| **Total MVP** | **~5 h** |

---
### Ready to implement 🛠  – let me know if you’d like me to start coding or clarify anything!
