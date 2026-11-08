/*
 * Provided utilities for ps1 (reconstructed; specs copied from the public ps1 API docs).
 *
 * Put LARGER helper functions here (used by implementation and/or tests), with TypeDoc specs,
 * and write Mocha tests for them in test/utils.test.ts.
 * Call them from other modules as utils.myHelper(..).
 */

import assert from 'node:assert';
import type { Color } from './colors.js';

/** Default tolerance for assertApproxEqual. */
export const defaultTolerance = 0.001;

/**
 * Assert that two numbers are approximately equal.
 *
 * @param actual actual value
 * @param expected expected value
 * @param message optional error message
 * @param tolerance optional error tolerance, overriding the default
 * @throws AssertionError iff |actual-expected| > tolerance
 */
export function assertApproxEqual(actual: number, expected: number, message?: string, tolerance: number = defaultTolerance): void {
    if (Math.abs(actual - expected) > tolerance) {
        throw new assert.AssertionError({
            message: (message ? message + ': ' : '') + `expected ${expected} +/- ${tolerance}, got ${actual}`,
            actual,
            expected,
            operator: 'assertApproxEqual',
        });
    }
}

/**
 * Convert from HSL to nearest (rounded, half up) RGB color.
 *
 * @param hsl HSL color, [h,s,l] tuple of numbers 0 <= h < 360 and 0 <= s,l <= 1
 * @returns nearest RGB color, [r,g,b] tuple of integers 0 <= r,g,b <= 255
 */
export function hslToRgb(hsl: Color): Color {
    const [h, s, l] = hsl;
    const chroma = (1 - Math.abs(2 * l - 1)) * s;
    const sector = h / 60;
    const x = chroma * (1 - Math.abs((sector % 2) - 1));
    const m = l - chroma / 2;
    let rgb1: Color;
    if (sector < 1) { rgb1 = [chroma, x, 0]; }
    else if (sector < 2) { rgb1 = [x, chroma, 0]; }
    else if (sector < 3) { rgb1 = [0, chroma, x]; }
    else if (sector < 4) { rgb1 = [0, x, chroma]; }
    else if (sector < 5) { rgb1 = [x, 0, chroma]; }
    else { rgb1 = [chroma, 0, x]; }
    // small epsilon so values like 127.49999999 (true value 127.5) round half up
    const toByte = (v: number): number => Math.min(255, Math.max(0, Math.round((v + m) * 255 + 1e-9)));
    return [toByte(rgb1[0]), toByte(rgb1[1]), toByte(rgb1[2])];
}

/**
 * Convert from RGB to HSL color.
 *
 * @param rgb RGB color, [r,g,b] tuple of integers 0 <= r,g,b <= 255
 * @returns HSL color, [h,s,l] tuple of numbers 0 <= h < 360 and 0 <= s,l <= 1
 */
export function rgbToHsl(rgb: Color): Color {
    const [r, g, b] = rgb.map(v => v / 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const chroma = max - min;
    const l = (max + min) / 2;
    let h = 0;
    if (chroma !== 0) {
        if (max === r) { h = 60 * (((g - b) / chroma) % 6); }
        else if (max === g) { h = 60 * ((b - r) / chroma + 2); }
        else { h = 60 * ((r - g) / chroma + 4); }
    }
    h = ((h % 360) + 360) % 360;
    const s = (l === 0 || l === 1) ? 0 : chroma / (1 - Math.abs(2 * l - 1));
    return [h, s, l];
}
