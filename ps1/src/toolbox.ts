/*
 * Animation toolbox for ps1 (reconstructed starter).
 *
 * PS1 problem 7:
 *  (b) Draft specs for AT MOST THREE functions that make it easy for a client to create animations
 *      like the two handout examples, by building data structures to pass to animateToFile(..).
 *      You may import-and-re-export existing utils.ts functions (keep their tests in utils.test.ts).
 *      Use static typing where possible; check non-static preconditions and fail fast.
 *  (c) Test them in test/toolbox.test.ts.
 *  (d) Implement them.
 *  (e) Use them to implement handoutExampleOne and handoutExampleTwo (short! no tests needed).
 *
 * Replace `todo` below with your toolbox functions.
 */

import { animateToFile, framerate, Animation } from '../lib/animate.js';
import { Color, lerpColor, fillGradient, makePalette, interpolate } from './colors.js';
import { Point, bezierInterpolate, bezierPath } from './curves.js';

/**
 * TODO
 */
export function todo(): void {
    throw new Error('not implemented yet');
}

/**
 * Generate and save example #1 "alley-oop" from the handout to "example1.html".
 */
export function handoutExampleOne(): void {
    // Looping ONE-second animation.
    const seconds = 1;
    // The circle shape is two Bézier curves:
    const circleTop: Array<Point> = [{ x: 10, y: 10 }, { x: 10, y: 17 }, { x: 20, y: 17 }, { x: 20, y: 10 }];
    const circleBottom: Array<Point> = [{ x: 10, y: 10 }, { x: 10, y: 3 }, { x: 20, y: 3 }, { x: 20, y: 10 }];
    // It is translated by the curve with control points:
    const translation: Array<Point> = [{ x: 0, y: 0 }, { x: 40, y: 110 }, { x: 80, y: 0 }];
    // with this easing function, so that it slows down then speeds up again:
    const easing = (t: number): number => 4 * (t - 0.5) ** 3 + 0.5;
    // Its RGB color transitions linearly from:
    const startColor: Color = [128, 128, 128];
    const endColor: Color = [173, 255, 47];

    const frames: Animation = []; // TODO: build seconds * framerate frames using your toolbox
    animateToFile(frames, 'example1.html');
}

/**
 * Generate and save example #2 "rainbow connection" from the handout to "example2.html".
 */
export function handoutExampleTwo(): void {
    // Looping TWO-second animation.
    const seconds = 2;
    // The heart shape is two Bézier curves:
    const heartLeft: Array<Point> = [{ x: 50, y: 25 }, { x: 34, y: 42 }, { x: 2, y: 36 }, { x: 0, y: 0 }, { x: 50, y: -40 }];
    const heartRight: Array<Point> = [{ x: 50, y: -40 }, { x: 100, y: 0 }, { x: 98, y: 36 }, { x: 66, y: 42 }, { x: 50, y: 25 }];
    // Each curve is revealed over time according to an easing function that is the 1-dimensional
    // Bézier curve with these control points, so each curve starts drawn up to t=.25, makes some
    // progress, bounces back, then goes to t=1:
    const revealEasingControls = [0.25, 1, -1, 1, 1, 1, 1];
    // The color of each curve is a rainbow gradient around the color wheel that starts at:
    const rainbowStart: Color = [39, 229, 220];

    const frames: Animation = []; // TODO: build seconds * framerate frames using your toolbox
    animateToFile(frames, 'example2.html');
}
