/*
 * Tests for curves.ts (reconstructed starter).
 *
 * PS1 problem 6(a): strengthen the specs in src/curves.ts FIRST, then test YOUR strengthened specs.
 * Add/commit/push at each spec and testing sub-step.
 *
 * Handy data from the handout:
 *  - control points (0,9), (10,-6), (20,16), (30,0): the point at t = 1/3 is approximately (10, 3.56)
 *  - control points (0,9), (50,9), (0,0), (30,1): 10 points quadratically spaced in t
 */

import assert from 'node:assert';
import { Point, bezierInterpolate, bezierPath } from '../src/curves.js';
import { assertApproxEqual } from '../src/utils.js';

describe('bezierInterpolate', function () {
    /*
     * Testing strategy for bezierInterpolate:
     *   TODO: partitions
     */

    it('bezierInterpolate covers empty controlPoints', function () {
        assert.throws(() => bezierInterpolate([], 0), Error);
    });
});

describe('bezierPath', function () {
    /*
     * Testing strategy for bezierPath:
     *   TODO: partitions (the provided postcondition is TODO, so there's no example test yet)
     */

    // TODO: tests
});
