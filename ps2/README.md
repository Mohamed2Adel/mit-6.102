# Problem Set 2: Multi-Startup Set (6.102 Spring 2026)

Source: https://web.mit.edu/6.102/www/sp26/psets/ps2/ (summarized; specs from the public [API docs](https://web.mit.edu/6.102/www/sp26/psets/ps2/doc/)).

> The official starter repo lives on github.mit.edu (MIT login only), so this folder is a
> **reconstruction**: same exported signatures and specs as the public docs, a working `Interval`
> class, stubbed methods, and the required reps. Not public, so reconstructed: the exact in-file
> comments, the `IntervalSetCtor` type alias, and the starter's example tests. Didit doesn't apply to you.

## Goals
Practice **designing, testing and implementing ADTs**: mutable types with given specs, two reps for
one interface, AF / RI / safety from rep exposure, `checkRep`, `toString`, generics.

## Setup
```bash
npm install                              # once
npm test                                 # compile + run all Mocha tests
npm test -- -f RepMapIntervalSet         # only one implementation
npm test -- -f RepArrayIntervalSet
npm test -- -f IntervalSet               # both IntervalSet implementations
npm run coverage                         # tests + coverage report (coverage/index.html)
npm run lint                             # ESLint
```
New this pset: `noUncheckedIndexedAccess` is **on**, so `arr[0]` has type `T | undefined`.

## Files
| File | What |
|---|---|
| `src/interval.ts` | provided immutable `Interval` [start, end): **do not change** |
| `src/intervalset.ts` | `IntervalSet<Label>` interface (fixed spec), `IntervalConflictError` (do not change), `makeIntervalSet()` (Problem 3.2) |
| `src/intervalset-impls.ts` | `RepMapIntervalSet`, `RepArrayIntervalSet`, `implementationsForTesting()` (don't change), `IntervalSetCtor` |
| `src/multiintervalset.ts` | `MultiIntervalSet<Label>` (fixed spec) |
| `src/similarity.ts` | `LabelSimilarity`, `similarity()` (may strengthen, never weaken), your helper ADT at the bottom |
| `src/utils.ts` | the **only** file where you may export new helpers |
| `test/*.test.ts` | one suite per module |

## Rules
- Don't change specs of `IntervalSet`, `MultiIntervalSet`, the constructors, `Interval`, `IntervalConflictError`. No new methods.
- `similarity`: strengthen only.
- Don't export anything new except from `src/utils.ts` (test it in `test/utils.test.ts`). Small private helpers elsewhere are fine.
- Every class: AF, RI, safety from rep exposure comment; `checkRep()`; `toString()` (use `@inheritdoc`, no need to test it).
- Interface methods in implementing classes: `@inheritdoc`, don't repeat the spec.
- Tests must be **legal clients** of the spec. `Interval` has no `equals`: compare with `assert.deepStrictEqual`, not `===`.
- Error tests: `assert.throws(() => { set.add(0n, 2n, "A"); }, IntervalConflictError);`
- Performance isn't the goal (quadratic is fine; avoid exponential). Correctness, clarity, changeability are.

## Steps
1. **Test `IntervalSet<string>`** in `test/intervalset.test.ts`. Use `new SomeIntervalSet<string>()` only
   (never `makeIntervalSet` or a concrete constructor). Don't change the `for ... describe(SomeIntervalSet.name ...)` line.
   Partition the state of `this` too. Commit.
2. **`RepMapIntervalSet`** in `src/intervalset-impls.ts`
   - 2.1 Implement for `string` labels with the required rep (exact names, no extra fields, use both):
     ```ts
     private readonly startMap: Map<string, bigint> = new Map();
     private readonly endMap: Map<bigint, bigint> = new Map();
     ```
     Run `npm test -- -f RepMapIntervalSet`. Commit.
   - 2.2 Make it generic: `export class RepMapIntervalSet<Label> implements IntervalSet<Label> { ... }`
     (replace `string` with `Label`). For strings of a label use `"" + lbl` or `` `${lbl}` ``.
   - 2.3 At the bottom of `intervalset-impls.ts`, delete the line marked `remove this line in Problem 2.3`
     and uncomment the line below it. Then add a couple of tests with labels that don't behave like
     strings (e.g. distinct objects with the same `toString()`). Commit.
3. **`RepArrayIntervalSet<Label>`**
   - 3.1 Implement with the required rep (sparse arrays only if documented):
     ```ts
     private readonly labelList: Array<Label> = [];
     private readonly valueList: Array<bigint> = [];
     ```
   - 3.2 Write the one-line `makeIntervalSet()` in `src/intervalset.ts` using one implementation.
     Self code review, check coverage. Commit.
4. **`MultiIntervalSet<Label>`**
   - 4.1 Tests in `test/multiintervalset.test.ts`.
   - 4.2 Implement. The rep **must use `IntervalSet`** (e.g. in an array or map), obtained via `makeIntervalSet()`,
     relying only on the `IntervalSet` spec. Commit.
5. **`similarity`**
   - 5.1 Tests in `test/similarity.test.ts` (include precision partitions).
   - 5.2 Design one **helper ADT** that makes `similarity` safer / clearer / easier to change: spec it as a class
     at the bottom of `src/similarity.ts`, test it in `test/similarity.test.ts`, implement it.
     `bigint` to `number`: `Number(x)` (no `new`).
   - 5.3 Implement `similarity` using only the specs of `MultiIntervalSet` and your helper ADT. Commit.

## Handout examples (useful test data)
- **IntervalSet.add** on `{ "A"=[0,10), "B"=[20,30) }`: `A=[0,10)` no effect; `B=[10,20)` throws; `C=[20,30)` throws; `D=[30,40)` added.
- **MultiIntervalSet.add** on `{ "A"=[[0,10),[20,30)] }`: `A=[0,10)` no effect; `B=[10,20)` added; `C=[20,30)` throws.
- **intervals**: on `{ "A"=[[0,10),[20,30)], "B"=[[10,20)] }`, `intervals("A")` = `{ 0=[0,10), 1=[20,30) }`.
- **similarity** (doc): sims `[["happy","meh",0.5],["meh","sad",0.5]]`;
  `{ happy=[[0,1),[2,4)], sad=[[1,2)] }` vs `{ sad=[[1,2)], meh=[[2,3)], happy=[[3,4)] }` → (0+1+0.5+1)/4 = **0.625**.
- **similarity** (handout figure): `{ A=[[0,5),[20,25)], B=[[10,20),[25,30)] }` vs `{ A=[[20,35)], B=[[10,20)], C=[[0,5)] }`
  - binary label similarity → 15/35 ≈ **0.42857**
  - with `["A","B",0.5]` → 17.5/35 = **0.5**
- Two empty sets → **0**.

## Grading (for reference)
~30% alpha autograde (incl. online exercises) + ~20% alpha manual + ~25% beta autograde + ~25% beta manual (code review).
