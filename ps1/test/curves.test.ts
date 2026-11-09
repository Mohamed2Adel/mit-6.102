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
     *   partition on n: n=0, n=1, n=2, n>2
     *   partition on t: t=0, t=1, 0<t<1
     *   covered by: n=0 and t=0
     *   ([],0) -> error
     *   covered by: n=1 and t=0.5
     *   ([(2,3)],0.5) -> (2,3)
     *   covered by: n=2 and t=1
     *   ([(3,5),(1,6)],1) -> (1,6)
     *   covered by: n=3 and t=1/3
     *   ([(1,2),(3,6),(5,4)],1/3) -> (7/3, 4)
     */

    it('bezierInterpolate covers empty controlPoints', function () {
        assert.throws(() => bezierInterpolate([], 0), Error);
    });
    it('bezierInterpolate covers n=1 return same point', function () {
    const p = bezierInterpolate([{ x: 2, y: 3 }], 0.5);
    assertApproxEqual(p.x, 2);
    assertApproxEqual(p.y, 3);
    });
    it('bezierInterpolate covers n=2, t=1 return last point', function () {
    const p = bezierInterpolate([{ x: 3, y: 5 }, {x: 1, y: 6}], 1);
    assertApproxEqual(p.x, 1);
    assertApproxEqual(p.y, 6);
    });
    it('bezierInterpolate covers n=1 return same point', function () {
    const p = bezierInterpolate([{ x: 1, y: 2 }, { x: 3, y: 6 }, { x: 5, y: 4 }], 1/3);
    assertApproxEqual(p.x, 7/3);
    assertApproxEqual(p.y, 4);
    });
});

describe('bezierPath', function () {
    /*
     * Testing strategy for bezierPath:
     *   TODO: partitions (the provided postcondition is TODO, so there's no example test yet)
     */

    // TODO: tests
});
