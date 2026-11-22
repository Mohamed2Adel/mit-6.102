/* Copyright (c) 2021-26 MIT 6.102/6.031 course staff, all rights reserved.
 * Reconstructed for self-study from the public ps3 handout.
 *
 * Public-test-style checks for the glue functions, using only the minimal language
 * (filenames, |, @ with numbers). These mirror what the handout says Didit's public tests
 * cover; the real public tests are not public. size() and image() should stay so simple
 * that your MemeExpression tests already cover them.
 */

import assert from 'node:assert';
import { parse } from '../src/expression.ts';
import { size, image } from '../src/commands.ts';
import { ImageLibrary } from '../src/imagelibrary.ts';

describe('commands (minimal language)', function () {

    const library = new ImageLibrary('img', 'tech1.png', 'tech2.png', 'boromir.jpg');

    it('size: tech1.png | tech2.png is 400x150', function () {
        assert.strictEqual(size(parse('tech1.png | tech2.png'), library), '400x150');
    });

    it('size: boromir.jpg @ 100x50 is 100x50', function () {
        assert.strictEqual(size(parse('boromir.jpg @ 100x50'), library), '100x50');
    });

    it('image: returns a PNG data: URL', function () {
        assert.match(image(parse('tech1.png|tech2.png'), library), /^data:image\/png;base64,/);
    });
});
