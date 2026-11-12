/* Copyright (c) 2021-26 MIT 6.102/6.031 course staff, all rights reserved.
 * Reconstructed for self-study.
 */

import assert from 'node:assert';
import { MultiIntervalSet } from '../src/multiintervalset.js';

/*
 * Tests for the MultiIntervalSet abstract data type.
 * These tests must be legal clients of the MultiIntervalSet spec.
 */
describe('MultiIntervalSet', function () {

    // Testing strategy
    //   TODO

    it('covers empty set', function () {
        const set = new MultiIntervalSet<string>();
        assert.deepStrictEqual(set.labels(), new Set());
    });

    // TODO more tests

});
