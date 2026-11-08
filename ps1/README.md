# Problem Set 1: Specific Graphics (6.102 Spring 2026)

Source: https://web.mit.edu/6.102/www/sp26/psets/ps1/ (summarized; specs from the public [API docs](https://web.mit.edu/6.102/www/sp26/psets/ps1/doc/)).

> The official starter repo lives on github.mit.edu (MIT login only), so this folder is a
> **reconstruction**: same exported signatures and specs as the public docs, working provided code
> (`utils.ts`, `lib/animate.ts`), and example tests based on the handout. Not public, so
> reconstructed or left as TODO: the exact in-file comments, the 5(c) questions at the bottom of
> `lerp.ts`, and the starter's example tests. Didit / slack days don't apply to you.

## Goals
Practice **test-first programming** and **specifications**: write tests from specs, implement to
specs, **strengthen** some specs, and write your own specs. Workflow for every function:
**specs → tests → implementation**, iterating as needed.

## Setup
```bash
npm install                     # once
npm test                        # compile + run all Mocha tests
npm test -- -f "lerpColor"      # run only matching tests
npm run coverage                # tests + coverage report (coverage/index.html)
npm run lint                    # ESLint (the handout wants zero warnings)
npm start                       # runs src/main.ts -> writes example1.html, example2.html
```
Optional: `git init` and commit after every step (test-first history, small commits, clear messages).

## Files
| File | What |
|---|---|
| `src/lerp.ts` | `lerpWeak`, `lerpStrong` (you write both specs), `lerp`, `forTestingOnly`, 5(c) questions |
| `src/colors.ts` | `Color`, `lerpColor`, `fillGradient`, `makePalette`, `interpolate`: **fixed specs** |
| `src/curves.ts` | `Point`, `bezierInterpolate`, `bezierPath`: specs you must **strengthen** |
| `src/utils.ts` | provided `assertApproxEqual`, `hslToRgb`, `rgbToHsl`; your larger helpers go here |
| `src/toolbox.ts` | your ≤3 toolbox functions + `handoutExampleOne/Two` |
| `src/main.ts` | `npm start` entry, ungraded, edit freely |
| `lib/animate.ts` | provided `animateToFile(frames, filename)`, 24 fps |
| `test/*.test.ts` | one suite per module |

## Rules (what you can and can't change)
- Don't rename provided files/folders. Don't change signatures in `lerp.ts`.
- `colors.ts`: don't change signatures **or specs**.
- `curves.ts`: specs must end up **stronger** than provided (never weaker).
- Don't export anything new from `lerp.ts`, `colors.ts`, `curves.ts`. Small unexported helpers there are fine.
- Larger helpers → `src/utils.ts` + tests in `test/utils.test.ts`. Tests must not call unexported src helpers; test-only helpers live in `test/`; src must never call test code.
- Tests must be **legal clients** of the spec: they run against other valid implementations.

## Numeric conventions
- Integers are safe integers. Non-integral results may be off by up to **0.001**; use only
  `assertApproxEqual` for that. You may not strengthen/weaken a spec by changing the tolerance.
- Violated precondition = unspecified behavior. Underdetermined postcondition: tests must accept every allowed result.

## Steps
0. Read the whole handout. **1.** Read all provided specs.
2. **lerpWeak / lerpColor**
   - (a) In `lerp.ts`, write a **weak** spec for `lerpWeak`: understandable, enough to implement `lerpColor`, otherwise as weak as possible.
   - (b) Test it in the first section of `test/lerp.test.ts` (very small suite). Commit.
   - (c) Implement `lerpWeak`. The spec should feel uncomfortably weak, but the docs, tests and code should be excellent. Commit.
   - (d) Test `lerpColor` in `test/colors.test.ts` (fixed spec, very small suite). Commit.
   - (e) Implement `lerpColor` by calling `lerp` (which currently is `lerpWeak`). Commit.
3. **fillGradient**: (a) tests, (b) implement. Commit each.
4. **makePalette**: (a) tests, (b) implement (use `utils.hslToRgb` / `utils.rgbToHsl`). Commit each.
5. **lerpStrong / interpolate**
   - (a) At the top of `interpolate`'s body: one sentence on why `lerp` with your lerpWeak spec can't implement `interpolate`.
   - (b) Write a **strong**, useful spec for `lerpStrong` that works everywhere `lerp` is used, plus `interpolate`.
   - (c) Answer the three questions at the bottom of `lerp.ts` (one sentence each).
   - (d) Test `lerpStrong` in the last section of `test/lerp.test.ts`. (e) Implement. Commit.
   - (f) Change `export const lerp = lerpWeak` to use `lerpStrong`.
   - (g) Test `interpolate` (fixed spec; `@throws` when t < 0 or t > 1: use `assert.throws(() => { ... })`). Commit.
   - (h) Implement `interpolate` by calling `lerp`. Commit.
6. **Bézier**
   - (a) Strengthen the specs in `curves.ts`, then test them in `test/curves.test.ts`:
     - `bezierInterpolate`: rename `renameMe` and **weaken its static type** (precondition); define the postcondition. Keep "throws iff controlPoints is empty". It should be generally useful and a good helper for `bezierPath`.
     - `bezierPath`: rename `renameMe`, weaken its type with a **union type**, and strengthen the postcondition. Decide what happens when `undefined` is passed, since you can't add throws cases.
   - (b) Implement both. Commit.
7. **Animations** (alpha grading focuses on 1–6, so do those first)
   - (a) Read the `animateToFile` spec in `lib/animate.ts`.
   - (b) In `toolbox.ts`, spec **at most three** functions that make the handout animations easy to build. Use static types; check other preconditions and fail fast.
   - (c) Test them in `test/toolbox.test.ts`. (d) Implement.
   - (e) Implement `handoutExampleOne/Two` with your toolbox (short; no tests needed). `npm start`, then open `example1.html` / `example2.html`.

## Handout examples (useful test data)
- **lerpColor**: example test "25% gray between black and 50% gray": `[0,0,0]→[128,128,128]` at 0.25 = `[32,32,32]`.
- **fillGradient**: `{0:[0,0,252], 3:[0,126,0], 5:[254,0,0]}` → fills keys 1, 2, 4 with `[0,42,168]`, `[0,84,84]`, `[127,63,0]`, returns 3.
- **makePalette**: pure green, n=4 → hues 30°, 120°, 210°, 300° (orange, green, dodger blue, fuchsia).
- **interpolate**: `interpolate(0,1,t=>t*t,0.6) = 0.36`; `interpolate(0,10,t=>t*Math.cos(2*Math.PI*t),0.4) ≈ -3.236`.
- **Bézier**: control points `(0,9),(10,-6),(20,16),(30,0)`: at t = 1/3 the point is ≈ `(10, 3.56)`. An nth-order curve has n+1 control points; it starts at P₀ and ends at Pₙ, but needn't pass through the others. "1/3 of the way" refers to the parameter t, not arc length.
- **Easing**: on x=t, y=t with `easing(t)=2t²`, inputs `[0,.25,.5,.75,1]` → `[0,.125,.5,1.125,2]`.
- **Example 1 "alley-oop"** (1 s loop): circle = two Béziers `(10,10),(10,17),(20,17),(20,10)` and `(10,10),(10,3),(20,3),(20,10)`; translated along `(0,0),(40,110),(80,0)` with easing `4(t−½)³+½`; color goes linearly from `(128,128,128)` to `(173,255,47)`.
- **Example 2 "rainbow connection"** (2 s loop): heart = Béziers `(50,25),(34,42),(2,36),(0,0),(50,−40)` and `(50,−40),(100,0),(98,36),(66,42),(50,25)`; each one is revealed via the 1-D Bézier easing `.25,1,−1,1,1,1,1`; colored with a rainbow gradient around the color wheel starting at `(39,229,220)`.
- Python [workbook](https://github.com/6031/ps1-spec-graphics/blob/main/Problem-Set-1-Workbook.ipynb) for visualizing and generating test data.

## Testing rules
Partition inputs and outputs, put a **testing strategy comment** at the top of each suite, and
choose small, well-picked cases that cover it. One case per `it()`. Use
`strictEqual`/`deepStrictEqual` (never `equal`) and `assertApproxEqual` for floats. Check coverage.
Read the provided example tests, then replace them with your own.

## Grading (for reference)
~30% alpha autograde (incl. online exercises) + ~20% alpha manual + ~25% beta autograde + ~25% beta manual (code review).
Alpha autograding weighs your **tests** more; beta weighs tests and implementation. Hidden tests run your
tests against broken staff implementations (e.g. a `lerpColor` that always returns the first color), so your suites must catch bugs.
