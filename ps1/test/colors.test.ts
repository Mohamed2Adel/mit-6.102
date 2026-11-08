/*
 * Tests for colors.ts (reconstructed starter).
 *
 * These specs are FIXED, and your tests will be run against other (legal) implementations,
 * so every test must be a legal client of the spec: no assumptions beyond what the spec promises.
 * The example tests below are models: read them, then replace them with your own.
 */

import assert from 'node:assert';
import { Color, lerpColor, fillGradient, makePalette, interpolate } from '../src/colors.js';
import { assertApproxEqual } from '../src/utils.js';

describe('lerpColor', function () {
    /*
     * PS1 problem 2(d). Very simple function: keep the suite very small.
     *
     * Testing strategy for lerpColor:
     *   TODO: partitions
     *   partition on t: t = 0, 0< t < 1, t = 1
     *   partition on each component i: c0[i] < c1[i], c0[i] = c1[i], c0[i] > c1[i]
     *   partition on the exact value of each component of c0 + t·(c1 − c0), before rounding:
     *     integer,
     *     fractional part < .5 (rounds down),
     *     fractional part = .5 (tie, rounds up),
     *     fractional part > .5 (rounds up)
     *
     * Covered by:
     *   ([0, 0, 0], [255, 255, 255], 0)       t = 0, c0 < c1, integer
     *   ([0, 0, 0], [255, 255, 255], 0.5)     0 < t < 1, c0 < c1, tie
     *   ([0, 0, 0], [128, 128, 128], 0.52)  0 < t < 1, c0 < c1, >.5
     *   ([32, 32, 32], [164, 164, 164], 1)  t = 1, c0 < c1, integer
     *   ([0, 0, 0], [128, 128, 128], 0.23)  0 < t < 1, c0 < c1, <.5
     *   ([0, 100, 255], [255, 100, 0], 0.5)  0 < t < 1, c0 > c1, tie
     */

    it('lerpColor covers 25% gray between black and 50% gray', function () {
        assert.deepStrictEqual(lerpColor([0, 0, 0], [128, 128, 128], 0.25), [32, 32, 32]);
    });
    it('lerpColor covers 50% gray between black and white, rounding from 0.5 to up', function () {
        assert.deepStrictEqual(lerpColor([0, 0, 0], [255, 255, 255], 0.5), [128, 128, 128]);
    });
    it('lerpColor covers black between black and white, t=0', function () {
        assert.deepStrictEqual(lerpColor([0, 0, 0], [255, 255, 255], 0), [0, 0, 0]);
    });
    it('lerpColor covers rounding up of 66.56 to 67', function () {
        assert.deepStrictEqual(lerpColor([0, 0, 0], [128, 128, 128], 0.52), [67, 67, 67]);
    });
    it('lerpColor covers t=1', function () {
        assert.deepStrictEqual(lerpColor([32, 32, 32], [164, 164, 164], 1), [164, 164, 164]);
    });
    it('lerpColor covers rounding down of 29.44 to 29', function () {
        assert.deepStrictEqual(lerpColor([0, 0, 0], [128, 128, 128], 0.23), [29, 29, 29]);
    });
    it('lerpColor covers random test of going up and down and staying equal', function () {
        assert.deepStrictEqual(lerpColor([0, 100, 255], [255, 100, 0], 0.5), [128, 100, 128]);
    });
});

describe('fillGradient', function () {
    /*
     * PS1 problem 3(a).
     *
     * Testing strategy for fillGradient:
     *   TODO: partitions
     *   partition on no distance between keys
     *   partition on only one distance between keys "1 gap"
     *   partition on multiple distances between keys "2 gap" and "3 gap"
     *   spec example covers only one distance and "2 gap" distance
     *   covers spec example
     *   [[0,[0, 0, 252]],[3,[0, 126, 0]],[5,[254, 0, 0]]]
     *   covers no gap
     *   [[0,[0, 0, 128]],[1,[0, 128, 0]],[2,[128, 0, 0]]]
     *   covers "3 gap" distance
     *   [[0,[0, 0, 128]],[1,[0, 128, 0]],[5,[255, 0, 0]]]
     */

    it('fillGradient covers the spec example', function () {
        const colors: Map<number, Color> = new Map([
            [0, [0, 0, 252]], [3, [0, 126, 0]], [5, [254, 0, 0]],
        ]);
        assert.strictEqual(fillGradient(colors), 3);
        assert.deepStrictEqual(colors, new Map<number, Color>([
            [0, [0, 0, 252]], [1, [0, 42, 168]], [2, [0, 84, 84]],
            [3, [0, 126, 0]], [4, [127, 63, 0]], [5, [254, 0, 0]],
        ]));
    });
    it('fillGradient covers no distance between keys', function () {
        const colors: Map<number, Color> = new Map(
            [[0,[0, 0, 128]],[1,[0, 128, 0]],[2,[128, 0, 0]]]
        ); 
        assert.strictEqual(fillGradient(colors), 0);
    });
    it('fillGradient covers "3 gap" distance between keys', function () {
        const colors: Map<number, Color> = new Map(
            [[0,[0, 0, 128]],[1,[0, 128, 0]],[5,[255, 0, 0]]]
        );
        assert.strictEqual(fillGradient(colors),3);
        assert.deepStrictEqual(colors, new Map<number, Color>(
            [[0,[0, 0, 128]],[1,[0, 128, 0]],[2,[64, 96, 0]],
            [3,[128, 64, 0]],[4,[191, 32, 0]],[5,[255, 0, 0]]]
        ));
    });
});

describe('makePalette', function () {
    /*
     * PS1 problem 4(a).
     *
     * Testing strategy for makePalette:
     *   TODO: partitions
     */

    it('makePalette covers the spec example: pure green, n=4', function () {
        const palette = makePalette([0, 255, 0], 4);
        // the spec doesn't fix the order of the array, so compare as sorted lists
        const sorted = (colors: Array<Color>): Array<Color> => [...colors].sort((a, b) => a.join(',').localeCompare(b.join(',')));
        assert.deepStrictEqual(sorted(palette), sorted([
            [255, 128, 0],  // bright orange, hue 30
            [0, 255, 0],    // pure green, hue 120
            [0, 128, 255],  // dodger blue, hue 210
            [255, 0, 255],  // fuchsia, hue 300
        ]));
    });
});

describe('interpolate', function () {
    /*
     * PS1 problem 5(g).
     *
     * Testing strategy for interpolate:
     *   TODO: partitions
     */

    it('interpolate covers the spec example: quadratic easing', function () {
        assertApproxEqual(interpolate(0, 1, t => t * t, 0.6), 0.36);
    });
});
