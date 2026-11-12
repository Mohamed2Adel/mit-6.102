/* Copyright (c) 2021-26 MIT 6.102/6.031 course staff, all rights reserved.
 * Reconstructed for self-study.
 */

import assert from 'node:assert';
import { similarity } from '../src/similarity.js';
import { MultiIntervalSet } from '../src/multiintervalset.js';

/*
 * Tests for similarity(..) and for your Problem 5.2 helper ADT.
 * These tests must be legal clients of your spec of similarity.
 */
describe('similarity', function () {

    // Testing strategy
    //   TODO (include partitions about precision: bigint -> number conversion)

    it('covers two empty sets', function () {
        assert.strictEqual(similarity([], new MultiIntervalSet<string>(), new MultiIntervalSet<string>()), 0);
    });

    // TODO more tests

});

// TODO Problem 5.2: describe(...) suite for your helper ADT
