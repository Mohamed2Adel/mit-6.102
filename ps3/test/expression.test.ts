/* Copyright (c) 2021-26 MIT 6.102/6.031 course staff, all rights reserved.
 * Reconstructed for self-study from the public ps3 handout.
 */

import assert from 'node:assert';
import { ImageLibrary } from '../src/imagelibrary.ts';
// TODO after Problem 2: this file should NOT import expression-impls.ts
import { type MemeExpression, parse } from '../src/expression.ts';
import { Filename, Resize, SideBySide } from '../src/expression-impls.ts';
// TODO switch to parse later, but for now import 3 classes and create directly.

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
        const name = new Filename("picture1.jpg");
        assert.throws(()=>new Resize(name, 100.8, 50));
        assert.throws(()=>new Resize(name, 100, 50.9));
    });
    
    it('covers toString() the leaf only', function () {
        const name = new Filename("picture1.jpg");
        assert.equal(name.toString(), 'picture1.jpg')
    });

    it('covers toString() the nested Resize containt SideBySide', function () {
        const left = new Filename("Left.jpg");
        const right = new Filename("Right.jpg");
        const side = new SideBySide(left, right);
        const resize = new Resize(side, 100, 50);
        assert.strictEqual(resize.toString(), '((Left.jpg|Right.jpg))@100x50');
    });

    it('covers toString() the nested SideBySide containt Resize', function () {
        const left = new Filename("Left.jpg");
        const right = new Filename("Right.jpg");
        const resizeRight = new Resize(right, 100, 50);
        const side = new SideBySide(left, resizeRight);
        assert.strictEqual(side.toString(), '(Left.jpg|(Right.jpg)@100x50)');
    });

    it('covers equalValue() true', function () {
        const name = new Filename("picture1.jpg");
        const secondName = new Filename("picture1.jpg");
        assert.strictEqual(name.equalValue(secondName), true);
    });

    it('covers equalValue() false, differ in filename', function () {
        const name = new Filename("picture1.jpg");
        const secondName = new Filename("picture2.jpg");
        assert.strictEqual(name.equalValue(secondName), false);
    });

    it('covers equalValue() false, differ in Width', function () {
        const name = new Filename("picture1.jpg");
        const resize = new Resize(name, 100, 50);
        const secondName = new Filename("picture1.jpg");
        const secondResize = new Resize(secondName, 150, 50);
        assert.strictEqual(resize.equalValue(secondResize), false);
    });

    it('covers equalValue() false, differ in Height', function () {
        const name = new Filename("picture1.jpg");
        const resize = new Resize(name, 100, 50);
        const secondName = new Filename("picture1.jpg");
        const secondResize = new Resize(secondName, 100, 80);
        assert.strictEqual(resize.equalValue(secondResize), false);
    });

    it('covers equalValue() false, differ in order', function () {
        const a = new Filename("a.jpg");
        const b = new Filename("b.jpg");
        const ab = new SideBySide(a,b);
        assert.strictEqual(ab.toString(), "(a.jpg|b.jpg)");
        assert.strictEqual(ab.equalValue(new SideBySide(b,a)), false);
    });

    it('covers equalValue() false, differ in order', function () {
        const a = new Filename("a.jpg");
        const b = new Filename("b.jpg");
        const ab = new SideBySide(a,b);
        assert.strictEqual(ab.toString(), "(a.jpg|b.jpg)");
        assert.strictEqual(ab.equalValue(new SideBySide(b,a)), false);
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
