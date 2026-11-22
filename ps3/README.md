# Problem Set 3: Memely (6.102 Spring 2026)

Source: https://web.mit.edu/6.102/www/sp26/psets/ps3/ (summarized; specs from the public [API docs](https://web.mit.edu/6.102/www/sp26/psets/ps3/doc/)).

> The official starter repo lives on github.mit.edu (MIT login only), so this folder is a
> **reconstruction**: same exported signatures and specs as the public docs, the real ParserLib 4.0.2
> (taken from the public Reading 12 example zip), and the provided code (`imagelibrary.ts`,
> `examples.ts`, console and web UIs) rewritten by hand. Not public, so reconstructed or replaced:
> the exact in-file comments, the starter tests, and **the images in `img/`**, which are small
> placeholders with the handout's sizes (boromir.jpg 550x325, tech*.png 200x150 except tech4.png
> 200x160, black.png 30x30). Didit doesn't apply to you.

## Goals
Practice **recursive data types, grammars and parsing, and equality for immutable types**: design an
immutable AST for a small meme language, write a ParserLib grammar, and add recursive operations
(`size`, `image`) without `instanceof`. Few restrictions on structure: much of the design is yours.

## Setup
```bash
npm install            # once (installs canvas and ParserLib)
npm test               # compile + run all Mocha tests
npm start              # console UI: type expressions, !size, !image, !quit
npm run web            # web UI at http://localhost:8080 (recompile + reload after edits)
npm run watch          # keep recompiling on save (use with npm run web)
npm run examples       # run the Canvas API examples in src/examples.ts
npm run coverage       # tests + coverage report
npm run lint           # ESLint
```
If `npm install` says `canvas` has install scripts not yet allowed, run `npm install-scripts approve canvas`
and install again. Imports use the course's `.ts` style (`'./expression.ts'`).

## The language
Meaning of an expression = an image (2D pixels, positive integer width and height).

| Syntax | Meaning |
|---|---|
| `boromir.jpg` | image file. Letters, digits, `.`; also `-` and `_` but not first |
| `"text"` | caption: one line, transparent background, any chars except newline and `"` |
| `A \| B` | side by side; shorter one centered vertically; height = max |
| `A --- B` | top to bottom (3 or more `-`); narrower one centered horizontally; width = max |
| `A ^ B` | B overlaid on A, **tops** aligned, narrower centered; size = max of each |
| `A _ B` | B overlaid on A, **bottoms** aligned, narrower centered; size = max of each |
| `A @ WxH` | resize; W or H may be `?` = keep aspect ratio as closely as possible; `?x?` is invalid |
| `( ... )` | grouping |

- Precedence, highest first: `@` `^` `_` `|` `---`. So `A _ B ^ C` = `A _ (B ^ C)`.
- Whitespace around symbols is ignored. Fractional centering may be off by ±1 pixel; empty space is transparent.
- `A.jpg_"B"` is invalid: `A.jpg_` reads as a filename. Write `A.jpg _ "B"` or `(A.jpg)_"B"`.
- Example: `boromir.jpg @ 100x?` → 100x59 (550/325 ≅ 1.6923, 100/59 ≅ 1.6949 is closest). `tech3.png@50x?` → 50x38.
- Valid: `A.jpg | B.jpg --- C.jpg | D.jpg`, `((A _ B)^C)---D`, `A@1x2@?x3@4x?`.
- Invalid: `A - B - C`, `A --- --- B`, `|A|B|`, `"no`, `A.jpg_"B"`, `A.jpg@?x?`.
- Optional extensions are allowed if they don't use reserved characters (`- | ^ _ @ ( ) " !` etc.)
  and never appear in output unless they were in the input.

**Iterate:** first do Problems 1-4 for only filenames, `|`, and `@` with numbers (Didit public tests and
most alpha points use only these). Then add captions, `---`, `^`, `_`, and `?`.

## Files
| File | What |
|---|---|
| `src/expression.ts` | `MemeExpression` interface (required `toString`, `equalValue` specs) and `parse()` (glue only). Add your `size` and `image` operations here |
| `src/expression-impls.ts` | **you write**: data type definition and one variant class per kind of expression |
| `src/expressionparser.ts` | starting ParserLib grammar (filenames, `\|`, `@` with numbers) and `parseExpression()` skeleton with TODOs |
| `src/commands.ts` | `size()` and `image()`: **at most 3 lines each**, glue only |
| `src/imagelibrary.ts` | provided: `ImageLibrary` (`getImage`) and `createCanvas()`. **Use only this**, never `canvas` or `fs` |
| `src/examples.ts` | provided Canvas examples: load image, new canvas, draw text, draw scaled, read pixels |
| `src/main.ts`, `src/web.ts`, `src/webserver.ts`, `web/` | provided console and web UIs |
| `test/expression.test.ts` | your tests for `toString`, `equalValue`, `parse`, size, image (creates `library` at the top) |
| `test/commands.test.ts` | public-test-style checks on the minimal language |
| `img/` | images for tests and UIs (keep them small) |
| `lib/parserlib-4.0.2.tgz` | ParserLib ([docs](https://web.mit.edu/6.102/www/parserlib/4.0.2/typedoc/)) |

## Problems
1. **Representing expressions**
   - 1.1 Immutable recursive AST, one variant class per operator, in `expression-impls.ts`. No concrete
     syntax in the AST. An AST may name files that don't exist; only size/image read image data.
     Test with variant constructors (option 1) or your own creator functions (option 2), then move to `parse()`.
   - 1.2 `toString()`: parsable, same image meaning, **recursive, no `instanceof`**. If tests expect exact formatting, specify it.
   - 1.3 `equalValue()`: structural equality (same leaves, operators, order and grouping), **recursive, with `instanceof`**.
     `A | B | C` must equal `(A | B | C)`; you decide whether `(A | B) | C` equals `A | (B | C)`.
     Equal ASTs must be observationally equal.
2. **Parsing**: 2.1 full grammar; 2.2 `parse()` calls `parseExpression()` (tests in `expression.test.ts` must stop importing `expression-impls.ts`); 2.3 `npm start`.
3. **Size**: 3.1 recursive size operation on `MemeExpression`, taking an `ImageLibrary`, returning a record type (not a string), no `instanceof`, avoid reading image data when not needed; 3.2 `size()` returns `"WxH"` in ≤3 lines.
4. **Image**: 4.1 recursive image operation taking an `ImageLibrary` and returning a `Canvas` (never convert to `Image`), no `instanceof`; 4.2 `image()` returns `canvas.toDataURL()` in ≤3 lines; 4.3 `!image`; 4.4 web UI.

## Before you're done
TypeDoc on every type and operation; AF, RI, safety from rep exposure; `checkRep()`; useful `toString()`;
`equalValue()` for immutable types; `@inheritDoc` for methods specified in the interface; a principled
test suite for `MemeExpression` (it covers the variants too).

## Grading (for reference)
~30% alpha autograde + ~20% alpha manual + ~25% beta autograde + ~25% beta manual. Alpha autograde
weights mostly filenames, `|`, and `@` with numbers. Alpha manual reads your specs, data type
definition, AF/RI, and variant implementations.
