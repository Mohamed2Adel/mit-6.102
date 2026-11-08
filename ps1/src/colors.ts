/*
 * Reconstructed starter code for 6.102 Spring 2026 ps1 (Specific Graphics).
 * Specs are copied verbatim from the public ps1 API docs.
 *
 * Rules from the handout:
 *  - Don't change the function signatures OR the specifications in this file.
 *  - Don't export anything new from this file.
 *  - Small helpers are OK here (unexported). Larger helpers go in utils.ts with tests in utils.test.ts.
 */

import { lerp } from './lerp.js';
import * as utils from './utils.js';

/**
 * A 3-tuple representing a color.
 */
export type Color = [number, number, number];

/**
 * Perform linear interpolation between RGB colors, [r,g,b] tuples of integers 0 <= r,g,b <= 255.
 *
 * @param c0 initial RGB color
 * @param c1 final RGB color
 * @param t parameter 0 <= t <= 1
 * @returns the RGB color whose components are linearly interpolated between corresponding
 *          components of c0 and c1 with parameter t, rounded to the nearest integer (half up)
 */
export function lerpColor(c0: Color, c1: Color, t: number): Color {
    // PS1 problem 2(e): implement by calling lerp, assuming your lerpWeak spec
    return [lerp(c0[0], c1[0], t), lerp(c0[1], c1[1], t), lerp(c0[2], c1[2], t)];
}

/**
 * Fill in a multicolor gradient that transitions between the provided colors in the specified steps.
 * All colors are [r,g,b] tuples of integers 0 <= r,g,b <= 255.
 *
 * For example, given:
 *  - { 0: [0,0,252], 3: [0,126,0], 5: [254,0,0] }
 *
 * Modifies the input to contain:
 *  - { 0: [0,0,252], 1: [0,42,168], 2: [0,84,84], 3: [0,126,0], 4: [127,63,0], 5: [254,0,0] }
 *
 * and returns 3.
 *
 * @param colors a map of integer keys to RGB colors, not containing keys that differ by more than 2^10,
 *               mutated so that its keys are the integers from the lowest to highest initial keys,
 *               inclusive, and each key k maps to the RGB color:
 *                - colors[k] if k is initially a key in colors
 *                - otherwise, letting prev and next be the nearest lower and higher initial keys,
 *                  respectively, the linear interpolation between colors[prev] and colors[next],
 *                  rounded (half up), at t equal to k's fractional distance from prev to next
 * @returns the number of keys added to colors
 */
export function fillGradient(colors: Map<number, Color>): number {
    // PS1 problem 3(b): implement
    // throw new Error('not implemented yet');

    if(colors.size === 0) {
        return 0;
    }
    else {
        const i = [...colors.keys()].sort((a,b) => a-b);
        for(const key of i) {
            const prev = key;
            const next = i[i.indexOf(key)+1];
            if((next - prev) === 2) {
                const t = 1/(next - prev);
                colors.set(prev + 1, lerpColor(colors.get(prev)!, colors.get(next)!, t));
            }
            else if((next - prev) > 2) {
                for(let j = 1; j < (next - prev); j++) {
                    const t = 1/(next - prev);
                    colors.set(prev + j, lerpColor(colors.get(prev)!, colors.get(next)!, t*j));
                }
            }
    }
    return colors.size - i.length;
}
}

/**
 * Produce a palette of RGB colors that have the same saturation and lightness as the input
 * and evenly divide the spectrum of hues using the HSL representation of RGB.
 * All input and output colors are [r,g,b] tuples of integers 0 <= r,g,b <= 255.
 * See https://en.wikipedia.org/wiki/HSL_and_HSV for an explanation of HSL and its relationship to RGB.
 *
 * For example, a palette generated from pure green (which has hue=120°, saturation=100%, lightness=50%)
 * and n=4 would have: a bright orange (hue=30°), pure green, a dodger blue (210°), and fuchsia (300°).
 *
 * @param color base RGB color
 * @param n number of hues to select from the spectrum of hues, nonnegative integer
 * @returns an array of exactly all the distinct RGB colors converted (and rounded, half up) from HSL
 *          colors that have:
 *           - hues, in degrees, that are multiples modulo 360 of 360/n degrees from the hue of color,
 *           - and the same saturation and lightness as color
 */
export function makePalette(color: Color, n: number): Array<Color> {
    // PS1 problem 4(b): implement (utils.hslToRgb and utils.rgbToHsl are provided)
    throw new Error('not implemented yet');
}

/**
 * Perform interpolation of scalars with an easing function.
 * The easing function transforms linear change into change that may accelerate, oscillate, etc.,
 * and that may not be bounded or endpointed by v0 and v1.
 *
 * For example:
 *  - interpolate(0, 1, t => t*t, 0.6) = 0.36
 *  - interpolate(0, 10, t => t*Math.cos(2*Math.PI*t), 0.4) ≈ -3.236
 *
 * @param v0 value when easing(t) = 0
 * @param v1 value when easing(t) = 1
 * @param easing function mapping input interpolation parameter ti, 0 <= ti <= 1,
 *               to an applied interpolation parameter, unconstrained
 * @param t input interpolation parameter
 * @returns the linear interpolation along v0 to v1 at easing(t)
 * @throws Error if t < 0 or t > 1
 */
export function interpolate(v0: number, v1: number, easing: (ti: number) => number, t: number): number {
    // PS1 problem 5(a): replace this line with a one-sentence explanation:
    //   why can we not use lerp with your lerpWeak spec to implement interpolate(..)?
    //
    // PS1 problem 5(h): implement by calling lerp, which now guarantees your lerpStrong spec
    throw new Error('not implemented yet');
}
