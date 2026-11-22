/* Copyright (c) 2021-26 MIT 6.102/6.031 course staff, all rights reserved.
 * Reconstructed for self-study from the public ps3 API docs.
 *
 * PROVIDED CODE: do not change this file. Your code must get images and canvases ONLY
 * through this module, never by importing `canvas` or `fs` directly, so that it runs both
 * in Node.js (tests, console UI) and in the web browser (web UI).
 */

/**
 * Interface for accessing Images and Canvases.
 * @module
 */

import type * as NodeCanvas from 'canvas';

/** Image data, as loaded from an image file. */
export type Image = NodeCanvas.Image;

/** An in-memory drawing surface (use `getContext('2d')` to draw on it). */
export type Canvas = NodeCanvas.Canvas;

/** Measurements of a piece of text, from `CanvasRenderingContext2D.measureText()`. */
export type TextMetrics = NodeCanvas.TextMetrics;

const inBrowser: boolean = typeof window !== 'undefined' && typeof document !== 'undefined';

// load the Node.js-only modules only when running in Node.js
const nodeCanvas: typeof NodeCanvas | undefined = inBrowser ? undefined : await import('canvas');
const nodeFs: typeof import('node:fs') | undefined = inBrowser ? undefined : await import('node:fs');
const nodePath: typeof import('node:path') | undefined = inBrowser ? undefined : await import('node:path');

/**
 * Creates a Canvas instance. This function works in both Node.js and Web
 * browsers, where there is no Canvas constructor.
 *
 * @param width width in pixels
 * @param height height in pixels
 * @param type Optionally specify to create a PDF or SVG canvas. Defaults to an
 *             image canvas.
 * @returns a new transparent Canvas of the given size
 */
export function createCanvas(width: number, height: number, type?: 'svg' | 'pdf'): Canvas {
    if (nodeCanvas) {
        return nodeCanvas.createCanvas(width, height, type);
    }
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas as unknown as Canvas;
}

/**
 * Library of pre-loaded images.
 */
export class ImageLibrary {

    private readonly images: Map<string, Image> = new Map();

    /**
     * Make a new image library, loading images from the filesystem (running in Node.js)
     * or from URLs (running in a web browser).
     *
     * @param dirname directory containing images, relative to the current folder (Node.js)
     *                or URL (web); must be "img"
     * @param filenames images to load from the directory, e.g. "boromir.jpg"; names must be unique
     */
    public constructor(dirname: 'img', ...filenames: Array<string>) {
        for (const filename of filenames) {
            if (this.images.has(filename)) {
                throw new Error(`duplicate image name: ${filename}`);
            }
            if (nodeCanvas && nodeFs && nodePath) {
                // Node.js: decoding from a Buffer is synchronous, so the image is ready immediately
                const image = new nodeCanvas.Image();
                image.onerror = (err: Error) => { throw err; };
                image.src = nodeFs.readFileSync(nodePath.join(dirname, filename));
                this.images.set(filename, image);
            } else {
                // web browser: images load asynchronously; see ImageLibrary.loaded() below
                const image = document.createElement('img');
                image.src = `${dirname}/${encodeURIComponent(filename)}`;
                this.images.set(filename, image as unknown as Image);
            }
        }
    }

    /**
     * Get an image from this library by name.
     *
     * @param name image base filename, e.g. "boromir.jpg"
     * @returns fully-loaded Image (so its dimensions and pixels are immediately available for use)
     * @throws Error if no image by that name is in this library
     */
    public getImage(name: string): Image {
        const image = this.images.get(name);
        if (image === undefined) {
            throw new Error(`no image named "${name}" in the library`);
        }
        return image;
    }

    /**
     * Used by the provided web UI only: in a browser, images load asynchronously, so the UI
     * waits on this before calling size() or image(). In Node.js it resolves immediately.
     *
     * @returns promise that resolves when every image in this library has finished loading
     *          (images that fail to load are left out of the library)
     */
    public async loaded(): Promise<void> {
        if (!inBrowser) { return; }
        for (const [name, image] of [...this.images]) {
            try {
                await (image as unknown as HTMLImageElement).decode();
            } catch (_e) {
                this.images.delete(name);
            }
        }
    }
}
