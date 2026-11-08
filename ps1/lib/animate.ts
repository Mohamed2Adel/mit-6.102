/*
 * Provided animation library for ps1 (reconstructed: same API and spec as the public docs;
 * the implementation is my own). Don't change this file.
 */

import fs from 'node:fs';
import type { Color } from '../src/colors.js';
import type { Point } from '../src/curves.js';

/** A single-color polyline. */
export type Polyline = { color: Color, points: Array<Point> };

/** A collection of polylines. */
export type Frame = Array<Polyline>;

/** A sequence of frames. */
export type Animation = Array<Frame>;

/** Framerate for animateToFile. */
export const framerate = 24;

/**
 * Animate a sequence of frames in a loop at 24 frames per second, where each frame is a
 * collection of polylines in specified colors. Writes the result as a SVG to the given file.
 *
 * Each frame in the input appears for 1/24th of a second.
 *
 * Each polyline is drawn with line segments that connect the adjacent pairs of points in its
 * points array. It is drawn in its RGB color, which must be a [r,g,b] tuple of integers 0 <= r,g,b <= 255.
 *
 * @param frames sequence of frames; each frame is a collection of polylines, and each polyline is
 *               a polygonal chain connecting points in order, drawn in RGB color
 * @param filename output filename, e.g. "example.html"
 */
export function animateToFile(frames: Animation, filename: string): void {
    for (const frame of frames) {
        for (const { color } of frame) {
            if (color.length !== 3 || !color.every(c => Number.isInteger(c) && c >= 0 && c <= 255)) {
                throw new Error(`invalid RGB color: [${color}]`);
            }
        }
    }

    // bounding box over all frames, so the view doesn't jump around
    const allPoints = frames.flat().flatMap(polyline => polyline.points);
    const xs = allPoints.map(p => p.x);
    const ys = allPoints.map(p => p.y);
    const minX = allPoints.length ? Math.min(...xs) : 0;
    const maxX = allPoints.length ? Math.max(...xs) : 1;
    const minY = allPoints.length ? Math.min(...ys) : 0;
    const maxY = allPoints.length ? Math.max(...ys) : 1;
    const pad = Math.max(maxX - minX, maxY - minY, 1) * 0.05;
    const viewBox = [minX - pad, minY - pad, maxX - minX + 2 * pad, maxY - minY + 2 * pad].join(' ');
    const strokeWidth = Math.max(maxX - minX, maxY - minY, 1) / 150;

    // y is flipped so the drawing uses Cartesian coordinates (y up)
    const frameGroups = frames.map((frame, i) =>
        `<g class="frame" style="display:${i === 0 ? 'inline' : 'none'}">` +
        frame.map(({ color, points }) =>
            `<polyline fill="none" stroke="rgb(${color.join(',')})" stroke-width="${strokeWidth}" ` +
            `stroke-linejoin="round" stroke-linecap="round" points="${points.map(p => `${p.x},${p.y}`).join(' ')}"/>`
        ).join('') +
        '</g>'
    ).join('\n');

    const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>${filename}</title>
<style>body{margin:0;background:#fff;display:flex;flex-direction:column;align-items:center;font-family:sans-serif}
svg{width:min(90vw,90vh);height:min(90vw,90vh);border:1px solid #ddd}</style></head>
<body>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">
<g transform="translate(0 ${minY + maxY}) scale(1 -1)">
${frameGroups}
</g>
</svg>
<p>${frames.length} frames at ${framerate} fps</p>
<script>
const frames = document.querySelectorAll('.frame');
let current = 0;
if (frames.length > 1) {
  setInterval(() => {
    frames[current].style.display = 'none';
    current = (current + 1) % frames.length;
    frames[current].style.display = 'inline';
  }, 1000 / ${framerate});
}
</script>
</body></html>
`;
    fs.writeFileSync(filename, html);
}
