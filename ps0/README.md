# Problem Set 0: Turtle Graphics (6.102 Spring 2026)

Source: https://web.mit.edu/6.102/www/sp26/psets/ps0/ (summarized; specs from the public [API docs](https://web.mit.edu/6.102/www/sp26/psets/ps0/doc/)).

> The official starter repo lives on github.mit.edu (MIT login only), so this folder is a
> **reconstruction**: same function signatures and specs, a working `turtle.ts`, and public tests
> that match the handout's test names. Didit / Caesar / slack days don't apply to you.

## Goals
Write code that is **safe from bugs**, **easy to understand**, and **ready for change**, while
learning TypeScript, VS Code, Mocha, and Git.

## Setup
```bash
npm install     # once
npm start       # runs main() -> writes output.html and opens it
npm test        # runs the Mocha tests
npm test -- -f "findPath"   # run only matching tests
```
Optional: `git init` and commit after each task, like the handout asks (`git add`, `git commit`,
`git lol`/`git log`, `git show <commit>`).

## Rules
- Edit **only** `src/turtlesoup.ts`. Don't change any function signature.
- You may add helper functions in `turtlesoup.ts` and tests in `test/turtlesoup.test.ts`.
- Don't add or change other TypeScript files.

## Turtle API (`src/turtle.ts`)
- `forward(units)`: move in the current direction. The turtle starts at (0,0) **facing up**.
- `turn(degrees)`: rotate **clockwise** by `degrees` (negative = counterclockwise).
- `color(PenColor)`: change pen color (only allowed in `drawPersonalArt`, provided colors only).
- `Point(x, y)`: immutable point with `.x`, `.y`, `equalValue()`.

## Tasks
1. **`drawSquare(turtle, sideLength)`**: draw a square using `forward` and `turn`. The spec leaves
   the turn direction to you. Uncomment the call in `main`, then run `npm start`. Commit.
2. **`chordLength(radius, angle)`**: length of the chord subtended by `angle` (radians,
   `0 <= angle < π`) in a circle of `radius`. Try to derive the formula before looking it up.
   Run `npm test`, then break it on purpose and watch the tests fail. Fix it again.
3. **`drawApproximateCircle(turtle, radius, numSides)`**: draw a regular polygon inscribed in the
   circle using **exactly `numSides` counterclockwise turns**. The turtle must end at its original
   position and heading. Use `chordLength`. You'll notice you can DRY this with `drawSquare`, but
   don't change either spec. Commit.
4. **`distance(p1, p2)`**: Euclidean distance.
5. **`findPath(points)`**: return `[turn_0, move_0, ..., turn_N-1, move_N-1, turn_N]` (length 2N+1)
   so that a turtle starting at (0,0) heading up reaches `points[i]` after `move_i` and ends heading up.
   Use `distance`, and add helpers if they help. Commit.
6. **`drawPersonalArt(turtle)`**: your own art, visually interesting, with **at least ~20 lines of
   non-repetitive code**. Use helpers and loops, not a list of `forward`/`turn` calls. Colors are allowed here.

## Collaboration-policy self-check (from the handout)
Answer yes/no for each, then check against the course
[collaboration policy](https://web.mit.edu/6.102/www/sp26/general/collaboration.html):
- I can import and use classes from the JS/TS standard library.
- I can search the web while writing my solution.
- I can read or post to the class forum while writing part of my solution.
- I can publicly post part of my solution online as a portfolio.
- I can use an AI code-generation tool to write code or text in my solution.
- I can write my solution sitting near (or on a call with) someone writing theirs.
- I can write part of my solution in lab or office hours.
- I can get help from someone while their own solution is visible.
- I can get help from a friend who took the course last semester.
- I can talk about ways to solve the pset with another student.
- …while talking through specific algorithmic steps to make sure we both got it.
- I can show or send my solution to another student.
- I can look at someone else's solution to help write mine.
- I can run someone else's tests on my code to check it.
- My solution can include code I wrote in a previous semester of this class.

## Grading (for reference)
~30% alpha autograde + ~20% alpha manual + ~25% beta autograde + ~25% beta manual (code review).
The real autograder includes **hidden tests**, so read each spec carefully. Passing the public
tests isn't enough. Edge cases worth thinking about: `sideLength = 0`, `angle = 0`, points behind
the turtle, and making the final heading exactly up.
