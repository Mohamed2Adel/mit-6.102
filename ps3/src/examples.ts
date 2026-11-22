/* Copyright (c) 2021-26 MIT 6.102/6.031 course staff, all rights reserved.
 * Reconstructed for self-study from the public ps3 handout.
 *
 * Staff-provided example code: you may draw from it without attribution.
 * Run with: npm run examples
 */

/**
 * Examples of using the Canvas API through imagelibrary.ts.
 * @module
 */

import assert from 'node:assert';
import { ImageLibrary, createCanvas, type Canvas, type Image } from './imagelibrary.ts';

/**
 * Example: read an image file into memory, and look at its size.
 * @param library library to read from
 * @returns the image named boromir.jpg
 */
export function readImageFile(library: ImageLibrary): Image {
    const image: Image = library.getImage('boromir.jpg');
    console.log('boromir.jpg is', image.width + 'x' + image.height);
    return image;
}

/**
 * Example: create a new blank image in memory and draw on it.
 * Every pixel of a new canvas starts fully transparent.
 * @returns a 100x50 canvas with a red rectangle in it
 */
export function createBlankImage(): Canvas {
    const canvas: Canvas = createCanvas(100, 50);
    const context = canvas.getContext('2d');
    context.fillStyle = 'red';
    context.fillRect(10, 10, 30, 20); // x, y, width, height
    return canvas;
}

/**
 * Example: draw text into an image. Measure the text first so the canvas is big enough.
 * @param text one line of text
 * @returns a canvas just big enough to hold the text, with a transparent background
 */
export function drawText(text: string): Canvas {
    const font = '48px sans-serif';

    // measure using a scratch canvas
    const scratch = createCanvas(1, 1).getContext('2d');
    scratch.font = font;
    const metrics = scratch.measureText(text);
    const width = Math.max(1, Math.ceil(metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight));
    // (use actualBoundingBox*: node-canvas reports fontBoundingBox* as 0)
    const height = Math.max(1, Math.ceil(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent));

    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    context.font = font;
    context.fillStyle = 'white';
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.fillText(text, metrics.actualBoundingBoxLeft, metrics.actualBoundingBoxAscent);
    context.strokeText(text, metrics.actualBoundingBoxLeft, metrics.actualBoundingBoxAscent);
    return canvas;
}

/**
 * Example: draw an image (or another canvas) at a particular position and size.
 * drawImage() accepts an Image OR a Canvas as its first argument, so you never need to
 * convert a Canvas back to an Image.
 * @param source image or canvas to draw
 * @returns a 300x200 canvas with source stretched into its right half
 */
export function drawImageScaled(source: Image | Canvas): Canvas {
    const canvas = createCanvas(300, 200);
    const context = canvas.getContext('2d');
    context.drawImage(source, 150, 0, 150, 200); // x, y, width, height of the destination
    return canvas;
}

/**
 * Example: examine the pixels of an image, e.g. for unit testing.
 * @param canvas canvas to examine
 * @param x column, 0 = left
 * @param y row, 0 = top
 * @returns [red, green, blue, alpha] at (x, y), each in 0..255 (alpha 0 = transparent)
 */
export function getPixel(canvas: Canvas, x: number, y: number): [number, number, number, number] {
    const data = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
    return [data[0] ?? 0, data[1] ?? 0, data[2] ?? 0, data[3] ?? 0];
}

/** Run all the examples. */
function main(): void {
    const library = new ImageLibrary('img', 'boromir.jpg');
    const boromir = readImageFile(library);

    const blank = createBlankImage();
    assert.deepStrictEqual(getPixel(blank, 0, 0), [0, 0, 0, 0], 'outside rectangle: transparent');
    assert.deepStrictEqual(getPixel(blank, 20, 20), [255, 0, 0, 255], 'inside rectangle: opaque red');

    const caption = drawText('One does not simply');
    console.log('caption is', caption.width + 'x' + caption.height);

    const scaled = drawImageScaled(boromir);
    console.log('left half transparent:', getPixel(scaled, 10, 10)[3] === 0);
    console.log('right half opaque:', getPixel(scaled, 200, 100)[3] === 255);

    // a data: URL, which is what commands.image() must return
    console.log(scaled.toDataURL().substring(0, 60) + '...');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}
