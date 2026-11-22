/* Copyright (c) 2021-26 MIT 6.102/6.031 course staff, all rights reserved.
 * Reconstructed for self-study from the public ps3 handout.
 */

import assert from 'node:assert';
import { ImageLibrary } from '../src/imagelibrary.ts';
// TODO after Problem 2: this file should NOT import expression-impls.ts
import { type MemeExpression, parse } from '../src/expression.ts';
import { Filename } from '../src/expression-impls.ts';

/**
 * Tests for the MemeExpression abstract data type.
 * (Its variant classes are part of its rep, so this one suite covers them too.)
 */
describe('MemeExpression', function () {

    // the image library for tests: add more images to img/ (keep them small!)
    const library = new ImageLibrary('img', 'boromir.jpg', 'tech1.png', 'tech2.png', 'tech3.png',
                                     'tech4.png', 'tech5.png', 'tech6.png', 'black.png', 'red.jpg');

    // Testing strategy
    //   TODO
    //
    //   toString():
    //   equalValue():
    //   parse():
    //   size operation:
    //   image operation:

    it('covers the image library', function () {
        // sanity check of the provided ImageLibrary and the sample images
        const boromir = library.getImage('boromir.jpg');
        assert.strictEqual(boromir.width, 550);
        assert.strictEqual(boromir.height, 325);
        assert.throws(() => library.getImage('nonexistent.png'));
    });

    // TODO: tests for toString(), equalValue(), parse(), and your size and image operations

    it('TODO: parse a filename', function () {
        const expression: MemeExpression = parse('boromir.jpg');
        assert(expression.equalValue(parse('boromir.jpg')));
    });
});
