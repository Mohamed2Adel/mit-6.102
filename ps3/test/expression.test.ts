/* Copyright (c) 2021-26 MIT 6.102/6.031 course staff, all rights reserved.
 * Reconstructed for self-study from the public ps3 handout.
 */

import assert from 'node:assert';
import { ImageLibrary } from '../src/imagelibrary.ts';
import { getPixel } from '../src/examples.ts';
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
    //      input: valid, invalid (throws Error)
    //      valid, operators: none (filename only), |, @, both
    //      valid, chain length of the same operator: 1, 2, more than 2
    //      valid, grouping: left to right by default, overridden by parentheses
    //      valid, precedence: @ applies before |
    //      valid, filename characters: letters/digits only, also contains . - _, starts with .
    //      valid, whitespace: none, spaces, tabs/newlines/carriage returns
    //      valid, parentheses: none, around one operand, redundant (nested or around everything)
    //      invalid: | missing an operand, empty or unbalanced parentheses, incomplete @ size,
    //               size of 0, non-digit size (? or decimal), illegal filename (starts with - or _,
    //               contains a space, _ attached to a filename), empty input
    //   size operation:
    //      partition on input: not in Library, in Library and only one file, nested expression with |
    //                          nested expression with Resize operator, one file with Resize operator @.
    //      partition on output: throw, @WxH, @WxH with flooring, @WxH with ceiling. ceiling and flooring
    //                      will be covered later when extending the design to have @Wx? or @?xH.
    //   image operation:
    //      generate missing image -> throw, generate one image, generated nested image side by side. 
    //      operation on images: @ shrink and stretch.
    //      for generating image vertically will be covered later when extending the design.

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


    it('covers parse() filename with . - _ characters and leading period', function () {
        assert(parse('image-file_3').equalValue(parse('image-file_3')));
        assert(parse('.hidden.png').equalValue(parse('.hidden.png')));
        assert(!parse('image-file_3').equalValue(parse('image-file-3')));
    });

    it('covers parse() whitespace: spaces, tabs, newlines and carriage returns are ignored', function () {
        const expected = parse('a.jpg|b.jpg@1x2');
        assert(expected.equalValue(parse('  a.jpg  |  b.jpg @ 1x2  ')));
        assert(expected.equalValue(parse('a.jpg\t|\r\n b.jpg\n@\t1x2')));
    });

    it('covers parse() redundant parentheses are ignored', function () {
        assert(parse('a.jpg').equalValue(parse('((a.jpg))')));
        assert(parse('a.jpg|b.jpg').equalValue(parse('((a.jpg)|(b.jpg))')));
        assert(parse('a.jpg@1x2').equalValue(parse('(a.jpg)@1x2')));
    });

    it('covers parse() chain of more than 2 |: groups left to right', function () {
        assert(parse('a.jpg|b.jpg|c.jpg').equalValue(parse('(a.jpg|b.jpg)|c.jpg')));
        assert(!parse('a.jpg|b.jpg|c.jpg').equalValue(parse('a.jpg|(b.jpg|c.jpg)')));
        assert(parse('a.jpg|b.jpg|c.jpg').equalValue(parse('(a.jpg|b.jpg|c.jpg)')));
    });

    it('covers parse() chain of 2 @: applied left to right, none dropped', function () {
        assert(parse('a.jpg@1x2@3x4').equalValue(parse('(a.jpg@1x2)@3x4')));
        assert(!parse('a.jpg@1x2@3x4').equalValue(parse('a.jpg@1x2')));
        assert(!parse('a.jpg@1x2@3x4').equalValue(parse('a.jpg@3x4@1x2')));
    });

    it('covers parse() precedence: @ applies before |, parentheses override it', function () {
        assert(parse('a.jpg|b.jpg@1x2').equalValue(parse('a.jpg|(b.jpg@1x2)')));
        assert(!parse('a.jpg|b.jpg@1x2').equalValue(parse('(a.jpg|b.jpg)@1x2')));
    });

    it('covers toString() round trip, | nested on the right', function () {
        const expr = parse('a.jpg|(b.jpg|c.jpg)');
        assert(expr.equalValue(parse(expr.toString())));
    });

    it('covers toString() round trip, deep nesting with both operators', function () {
        const expr = parse('((a.jpg|b.jpg)@1x2|(c.jpg|d.jpg@5x6))@3x4');
        assert(expr.equalValue(parse(expr.toString())));
    });

    it('covers parse() invalid input throws Error', function () {
        for (const input of [
            '',                 // empty input
            '|a.jpg|b.jpg|',    // | missing operands
            'a.jpg|',           // | missing right operand
            'a.jpg||b.jpg',     // | missing middle operand
            '()',               // empty parentheses
            '(a.jpg',           // unbalanced parentheses
            'a.jpg@1x',         // incomplete size
            'a.jpg@1',          // incomplete size
            'a.jpg@0x5',        // width 0
            'a.jpg@5x0',        // height 0
            'a.jpg@?x?',        // ? (not supported yet) and ?x? (never legal)
            '-a.jpg',           // filename starts with -
            '_a.jpg',           // filename starts with _
            'a b.jpg',          // space inside filename
            'a.jpg_"b"',        // _ attached to the filename
        ]) {
            assert.throws(() => parse(input), Error, `expected ${JSON.stringify(input)} to throw`);
        }
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

    // Cover Testing strategy for size operation 
    
    it('cover image not in Library', function() {
        assert.throws(() => parse('notExist').size(library));
    });

    it('cover image in Library and only one file', function() {
        assert.deepStrictEqual(parse('boromir.jpg').size(library), {width:550,height:325});
    });

    it('cover image in Library and only one file include @ operator', function() {
        assert.deepStrictEqual(parse('boromir.jpg@400x200').size(library), {width:400,height:200});
    });

    it('cover image not in Library and only one file include @ operator', function() {
        assert.deepStrictEqual(parse('notExist.jpg@300x150').size(library), {width:300,height:150});
    });

    it('cover image in Library and nested |', function() {
        assert.deepStrictEqual(parse('boromir.jpg|tech4.png').size(library), {width:750,height:325});
    });

    it('cover image in Library and nested | and contain resize @', function() {
        assert.deepStrictEqual(parse('(boromir.jpg|tech4.png)@100x50').size(library), {width:100,height:50});
    });

    it('cover image in Library and nested | with both side resized', function() {
        assert.deepStrictEqual(parse('boromir.jpg@100x50|tech4.png@100x50').size(library), {width:200,height:50});
    });

    it('cover image in Library and nested | with second operand is missing', function() {
        assert.throws(() => parse('boromir.jpg|notExist').size(library));
    });

    it('cover image in Library and chained |', function() {
        assert.deepStrictEqual(parse('tech1.png|tech2.png|tech3.png').size(library), {width:600,height:150});
    });

    it('cover image in Library and chained @ the outer win', function() {
        assert.deepStrictEqual(parse('(tech1.png@100x50)@200x100').size(library), {width:200,height:100});
    });

    it('cover image in Library and right side one is taller', function() {
        assert.deepStrictEqual(parse('tech1.png|tech4.png').size(library), {width:400,height:160});
    });

    // Cover Testing strategy for image operation.

    it('cover missing image so throw', function(){
        assert.throws(()=> parse('missing.png').image(library));
        assert.throws(()=> parse('missing.png@100x40').image(library));
    });

    it('cover drawing one image and check for pixel', function(){
        const canvas = parse('black.png').image(library);
        assert.strictEqual(canvas.width, 30);
        assert.strictEqual(canvas.height, 30);
        const [r,g,b,alpha] = getPixel(canvas, 15, 15);
        assert(r<50);
        assert(g<50);
        assert(b<50);
        assert.deepStrictEqual(alpha, 255); // r=g=b=0, alpha=255 non transparent
    });

    it('cover drawing one image with resize stretch', function(){
        const canvas = parse('red.jpg@100x50').image(library);
        assert.strictEqual(canvas.width, 100);
        assert.strictEqual(canvas.height, 50);
        const [r,g,b,alpha] = getPixel(canvas, 15, 15);
        assert(r>200);
        assert(g<50);
        assert(b<50);
        assert.deepStrictEqual(alpha, 255); // r>200,g=b=0, alpha=255 non transparent
    }); 

    it('cover drawing one image with resize shrink', function(){
        const canvas = parse('red.jpg@10x10').image(library);
        assert.strictEqual(canvas.width, 10);
        assert.strictEqual(canvas.height, 10);
        const [r,g,b,alpha] = getPixel(canvas, 5, 5);
        assert(r>200);
        assert(g<50);
        assert(b<50);
        assert.deepStrictEqual(alpha, 255); // r>200,g=b=0, alpha=255 non transparent
    });  
    
    it('cover drawing nested image with |, and the left is taller', function(){
        const canvas = parse('red.jpg|black.png').image(library);
        assert.strictEqual(canvas.width, 60+30);
        assert.strictEqual(canvas.height, 40);
        const [ , , ,alpha] = getPixel(canvas, 65,35); // this is the region under the black pic, then
        assert.deepStrictEqual(alpha, 0); // transparent
    });

    it('cover drawing nested image with |, and the right is taller', function(){
        const canvas = parse('black.png|red.jpg').image(library);
        assert.strictEqual(canvas.width, 30+60);
        assert.strictEqual(canvas.height, 40);
        const [ , , ,alpha] = getPixel(canvas, 5,35); // this is the region under the black pic, then
        assert.deepStrictEqual(alpha, 0); // transparent
    });

    it('cover drawing chain of 3 image using |', function(){
        const canvas = parse('black.png|red.jpg|black.png').image(library);
        assert.strictEqual(canvas.width, 30+60+30);
        assert.strictEqual(canvas.height, 40);
    });

    it('cover drawing chain of 2 image with resize for each', function(){
        const canvas = parse('black.png@100x50|red.jpg@100x50').image(library);
        assert.strictEqual(canvas.width, 200);
        assert.strictEqual(canvas.height, 50);
    });
});
