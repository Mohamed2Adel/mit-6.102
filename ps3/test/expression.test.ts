/* Copyright (c) 2021-26 MIT 6.102/6.031 course staff, all rights reserved.
 * Reconstructed for self-study from the public ps3 handout.
 */

import assert from 'node:assert';
import { ImageLibrary } from '../src/imagelibrary.ts';
import { type MemeExpression, parse } from '../src/expression.ts';

/**
 * Tests for the MemeExpression abstract data type.
 * (Its variant classes are part of its rep, so this one suite covers them too.)
 */
describe('MemeExpression', function () {

    // the image library for tests: add more images to img/ (keep them small!)
    const library = new ImageLibrary('img', 'boromir.jpg', 'tech1.png', 'tech2.png', 'tech3.png',
                                     'tech4.png', 'tech5.png', 'tech6.png', 'black.png', 'red.jpg');

    // Testing strategy
    //
    //   toString():
    //      variants: Filename, Resize, SideBySide.
    //      nesting: leaf only, one level, Resize contain SideByside, SideByside contain Resize.
    //   equalValue():
    //      result: true, false. Same variant vs different variant.
    //      differs in: filename, Width, Height, left child, right child, order a|b and b|a
    //      grouping: (a|b)|c vs a|(b|c)   (your spec: binary, so NOT equal)
    //   parse():
    //   size operation:
    //   image operation:

    it('covers passing non integer Width or Height and throw', function () {
        assert.throws(()=>parse('picture1.jpg@100.8x50'));
        assert.throws(()=>parse('picture1.jpg@100x50.9'));
    });
    
    it('covers toString() the leaf only', function () {
        const name = parse('picture1.jpg');
        assert(name.equalValue(parse(name.toString())));
    });

    it('covers toString() the nested Resize containt SideBySide', function () {
        const resize = parse('(Left.jpg|Right.jpg)@100x50');
        assert(resize.equalValue(parse(resize.toString())));
    });

    it('covers toString() the nested SideBySide containt Resize', function () {
        const side = parse('Left.jpg|Right.jpg@100x50');
        assert(side.equalValue(parse(side.toString())));
    });

    it('covers equalValue() true', function () {
        const name = parse('picture1.jpg');
        const secondName = parse('picture1.jpg');
        assert.strictEqual(name.equalValue(secondName), true);
    });

    it('covers equalValue() false, differ in filename', function () {
        const name = parse('picture1.jpg');
        const secondName = parse('picture2.jpg');
        assert.strictEqual(name.equalValue(secondName), false);
    });

    it('covers equalValue() false, differ in Width', function () {
        const resize = parse('picture1.jpg@100x50');
        const secondResize = parse('picture1.jpg@150x50');
        assert.strictEqual(resize.equalValue(secondResize), false);
    });

    it('covers equalValue() false, differ in Height', function () {
        const resize = parse('picture1.jpg@100x50');
        const secondResize = parse('picture1.jpg@100x80');
        assert.strictEqual(resize.equalValue(secondResize), false);
    });

    it('covers equalValue() false, differ in order', function () {
        const ab = parse('a.jpg|b.jpg');
        assert.strictEqual(ab.equalValue(parse('b.jpg|a.jpg')), false);
    });

    it('covers equalValue() false, differ in order', function () {
        const ab = parse('a.jpg|b.jpg');
        assert.strictEqual(ab.equalValue(parse('b.jpg|a.jpg')), false);
    });


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
