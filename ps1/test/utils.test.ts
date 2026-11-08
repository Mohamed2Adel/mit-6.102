/*
 * Tests for utils.ts. Add tests here for any larger helper you put in utils.ts.
 */

import assert from 'node:assert';
import { assertApproxEqual, hslToRgb, rgbToHsl } from '../src/utils.js';

describe('assertApproxEqual', function () {
    it('covers within tolerance', function () {
        assertApproxEqual(1.0005, 1);
    });
    it('covers outside tolerance', function () {
        assert.throws(() => assertApproxEqual(1.01, 1), assert.AssertionError);
    });
});

describe('hslToRgb / rgbToHsl (provided)', function () {
    it('covers pure green round trip', function () {
        const [h, s, l] = rgbToHsl([0, 255, 0]);
        assertApproxEqual(h, 120);
        assertApproxEqual(s, 1);
        assertApproxEqual(l, 0.5);
        assert.deepStrictEqual(hslToRgb([h, s, l]), [0, 255, 0]);
    });
    it('covers half-up rounding: hue 30 -> bright orange', function () {
        assert.deepStrictEqual(hslToRgb([30, 1, 0.5]), [255, 128, 0]);
    });
    it('covers gray (saturation 0)', function () {
        const [, s, l] = rgbToHsl([128, 128, 128]);
        assertApproxEqual(s, 0);
        assertApproxEqual(l, 128 / 255);
    });

    // TODO: tests for your own larger helpers
});
