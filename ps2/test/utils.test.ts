/* Copyright (c) 2021-26 MIT 6.102/6.031 course staff, all rights reserved.
 * Reconstructed for self-study.
 */

/*
 * Tests for utils.ts. Add a describe(...) suite here for every helper you put in utils.ts.
 */

import assert from 'node:assert';

describe('utils', function () {

    it('make sure assertions are enabled', function () {
        assert.throws(() => assert(false));
    });

});
