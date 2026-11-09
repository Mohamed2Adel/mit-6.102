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
     *   partition on n: n = 1, n = 2, n = 3
     *   partition on color: pured red, pure green, pure blue, white, black
     *   covers spec example (pure green, n=4)
     *   ([0, 255, 0], 4)
     *   covers n = 1, white 
     *   ([255, 255, 255], 1)
     *   covers n = 2, pure red  
     *   ([255, 0, 0], 2)
     *   covers n = 3, pure blue
     *   ([0, 0, 255], 3)
     *   covers n = 5, black 
     *   ([0, 0, 0], 5)
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
    it('makePalette covers n=1 and white', function(){
        const palette = makePalette([255, 255, 255],1);
        // the spec doesn't fix the order of the array, so compare as sorted lists
        const sorted = (colors: Array<Color>): Array<Color> => [...colors].sort((a, b) => a.join(',').localeCompare(b.join(',')));
        assert.deepStrictEqual(sorted(palette), sorted([[255,255,255]]));
    });
    it('makePalette covers pure red, n=2', function () {
        const palette = makePalette([255, 0, 0], 2);
        // the spec doesn't fix the order of the array, so compare as sorted lists
        const sorted = (colors: Array<Color>): Array<Color> => [...colors].sort((a, b) => a.join(',').localeCompare(b.join(',')));
        assert.deepStrictEqual(sorted(palette), sorted([
            [255, 0, 0],    // red, hue 0 [0,255,0] 
            [0, 255, 255],  // cyan, hue 180 [255,0,0]
        ]));
    });
    it('makePalette covers pure blue, n=3 ', function () {
        const palette = makePalette([0, 0, 255], 3);
        // the spec doesn't fix the order of the array, so compare as sorted lists
        const sorted = (colors: Array<Color>): Array<Color> => [...colors].sort((a, b) => a.join(',').localeCompare(b.join(',')));
        assert.deepStrictEqual(sorted(palette), sorted([
            [255, 0, 0],  // red, hue 0
            [0, 255, 0], // green, hue 120 
            [0, 0, 255], // blue, hue 240
        ]));
    });
    it('makePalette covers black, n=5 ', function () {
        const palette = makePalette([0, 0, 0], 5);
        // the spec doesn't fix the order of the array, so compare as sorted lists
        const sorted = (colors: Array<Color>): Array<Color> => [...colors].sort((a, b) => a.join(',').localeCompare(b.join(',')));
        // black has lightness 0, so every hue converts to black: only ONE distinct color
        assert.deepStrictEqual(sorted(palette), sorted([
            [0, 0, 0],
        ]));
    });
});

describe('interpolate', function () {
    /*
     * PS1 problem 5(g).
     *
     * Testing strategy for interpolate:
     *   TODO: partitions
     *   partitions on v0 vs v1: v0<v1, v0>v1, v0=v1
     *   partitions on t: t=0, t=1, 0<t<1
     *   partitions on easing(t): t*t, cos(2*pi*t), 1/t, t
     *   
     *   covered by: v0<v1, 0<t<1, t*t
     *   (0, 1, t*t, 0.6) -> 0.36
     *   covered by: v0>v1, t=1, t
     *   (3, 2, t, 1) -> 2
     *   covered by: v0=v1, 0<t<1, 1/t
     *   (7, 7, 1/t, 0.5) -> 7
     *   covered by: v0<v1, t=0, cos(2*pi*t)
     *   (2, 9, cos(), 0) -> 9
     *
     *   partition on t outside [0, 1] (must throw): t < 0, t > 1
     *   covered by: t < 0
     *   (0, 1, t, -0.5) -> throws Error
     *   covered by: t > 1
     *   (0, 1, t, 1.5) -> throws Error
     */

    it('interpolate covers the spec example: quadratic easing', function () {
        assertApproxEqual(interpolate(0, 1, t => t * t, 0.6), 0.36);
    });
    it('interpolate covers the v0>v1, t=1, t', function () {
        assertApproxEqual(interpolate(3, 2, t => t, 1), 2);
    });
    it('interpolate covers the v0=v1, 0<t<1, 1/t', function () {
        assertApproxEqual(interpolate(7, 7, t => 1/t, 0.5), 7);
    });
    it('interpolate covers the v0<v1, t=0, cos(2*pi*t)', function () {
        assertApproxEqual(interpolate(2, 9, t => Math.cos(2*Math.PI*t), 0), 9);
    });
    it('interpolate covers t < 0: throws', function () {
        assert.throws(() => interpolate(0, 1, t => t, -0.5), Error);
    });
    it('interpolate covers t > 1: throws', function () {
        assert.throws(() => interpolate(0, 1, t => t, 1.5), Error);
    });
});
