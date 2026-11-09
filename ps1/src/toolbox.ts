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

import { isBigUint64Array } from 'util/types';
import { animateToFile, framerate, Animation, Frame } from '../lib/animate.js';
import { Color, lerpColor, fillGradient, makePalette, interpolate } from './colors.js';
import { Point, bezierInterpolate, bezierPath } from './curves.js';

/**
 * Build an animation that lasts `seconds` seconds by calling frameAt once per frame, in order.
 *
 * @param seconds duration of the animation in seconds; seconds × framerate must be an integer >= 2
 * @param frameAt function that, given a time t with 0 <= t <= 1, returns the frame to show at that time
 * @returns an animation of exactly N = seconds × framerate frames, where frame i (0 <= i < N) is
 *          frameAt(i / (N − 1)), so the first frame is at t = 0 and the last frame is at t = 1
 * @throws Error if seconds × framerate is not an integer or is less than 2
 */
export function makeAnimation(seconds:number, frameAt:(t:number)=>Frame): Animation {    const result: Animation =[];
    const N = seconds * framerate;
    if(N < 2 || !Number.isInteger(N)) {
        throw new Error('seconds must be >0, and seconds x framerate must be >=2 and integer');
    }
    for (let i = 0; i < N; i++) {
        result.push(frameAt(i/(N-1)));
    }
    return result;
}

/**
 * a fucntion that Return a copy of points, each moved by offset.
 * @param points current points
 * @param offset the offset of type point that the points will be moved with
 * @returns return a copy of points moved with offset. in same length and orders
 *          { x: points[i].x + offset.x, y: points[i].y + offset.y }
 */
export function translate(points: Array<Point>, offset: Point): Array<Point> {
    const result = points.map(point => ({
        x: point.x + offset.x,
        y: point.y + offset.y
    }));

    return result;
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
 

    const frames: Animation = makeAnimation(seconds, t => {
        const offset = bezierInterpolate(translation, easing(t));
        const color = lerpColor(startColor, endColor, t);
        const topPoints = bezierPath(circleTop, t=>t*t, 24);
        const bottomPoints = bezierPath(circleBottom, t=>t*t, 24); 
        return [
            {color: color, points: translate(topPoints, offset)},
            {color: color, points: translate(bottomPoints, offset)}
        ]    
    });
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
