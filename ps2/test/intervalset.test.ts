/* Copyright (c) 2021-26 MIT 6.102/6.031 course staff, all rights reserved.
 * Reconstructed for self-study.
 */

import assert from 'node:assert';
import { IntervalSet, IntervalConflictError } from '../src/intervalset.js';
import { Interval } from '../src/interval.js';
import { implementationsForTesting } from '../src/intervalset-impls.js';

/*
 * Tests for the IntervalSet abstract data type.
 *
 * PS2 instructions:
 * - use `new SomeIntervalSet<string>()` to get fresh empty sets;
 *   do NOT use makeIntervalSet() or call a specific implementation's constructor
 * - these tests must be legal clients of the IntervalSet spec
 * - toString() has a very weak spec, so you do not need to test it
 */
for (const SomeIntervalSet of implementationsForTesting()) {
describe(SomeIntervalSet.name, function () { // PS2 instructions: do not change this line

    // Testing strategy
    //   TODO partition each operation's inputs (including `this`) and outputs

    it('covers empty set', function () {
        const set: IntervalSet<string> = new SomeIntervalSet<string>();
        assert.deepStrictEqual(set.labels(), new Set());
    });

    it('covers add then get interval', function () {
        const set: IntervalSet<string> = new SomeIntervalSet<string>();
        set.add(0n, 10n, 'A');
        assert.deepStrictEqual(set.interval('A'), new Interval(0n, 10n));
        assert.throws(() => { set.add(5n, 15n, 'B'); }, IntervalConflictError);
    });

    // TODO more tests

});
}
