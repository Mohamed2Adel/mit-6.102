# MIT 6.102: Software Construction (Spring 2026), self-study

My work on the problem sets from MIT's [6.102 Software Construction](https://web.mit.edu/6.102/www/sp26/),
done on my own while following the course readings.

The course teaches how to write software that is **safe from bugs**, **easy to understand** and
**ready for change**, using TypeScript, test-first programming, specifications and abstract data types.

> The official starter code is on github.mit.edu (MIT login only). Each problem set here is a
> **reconstruction** from the public handout and API docs: same function signatures and specs,
> with the provided library code rewritten by hand. Details are in each folder's README.

## Problem sets

| Folder | Problem set | Topics | Status |
|---|---|---|---|
| [`ps0/`](ps0/) | Turtle Graphics | TypeScript, VS Code, Mocha tests, Git | Done |
| [`ps1/`](ps1/) | Specific Graphics | Test-first programming, weak vs. strong specs, linear interpolation, colors, Bézier curves, animations | Done |

## Running a problem set

Each folder is its own Node project. You need [Node.js](https://nodejs.org/) installed.

```bash
cd ps1
npm install      # once
npm test         # compile and run the Mocha tests
npm start        # run the program (ps1 writes example1.html and example2.html)
```

`ps1` also has:

```bash
npm run coverage   # tests with a coverage report
npm run lint       # ESLint
```

## How I work
Each function goes **spec → tests → implementation**, with a commit after each step, so the
Git history shows the test-first workflow.
