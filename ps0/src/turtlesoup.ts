/*
 * Reconstructed starter code for 6.102 Spring 2026 ps0 (Turtle Graphics).
 * Specs are copied from the public ps0 API docs.
 *
 * Rules from the handout:
 *  - Only edit this file.
 *  - Do NOT change any function signatures.
 *  - You may add helper functions here, and tests in test/turtlesoup.test.ts.
 */

import fs from 'node:fs';
import { exec } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { Turtle, DrawableTurtle, Point, PenColor } from './turtle.js';

/**
 * Draw a square.
 *
 * @param turtle the turtle context
 * @param sideLength length of each side, must be >= 0
 */
export function drawSquare(turtle: Turtle, sideLength: number): void {
    // Implemented
    if (sideLength === 0) {
        return;
    }
    for (let i = 0; i < 4; i++) {
    turtle.forward(sideLength);
    turtle.turn(90);
}
}

/**
 * Determine the length of a chord of a circle.
 * (There is a simple formula; derive it or look it up.)
 * 
 * @param radius radius of a circle, must be > 0
 * @param angle in radians, where 0 <= angle < Math.PI
 * @returns the length of the chord subtended by the given angle
 *          in a circle of the given radius
 */
export function chordLength(radius: number, angle: number): number {
    // Implemented
    if (radius === 0 || radius <0) {
        throw new Error('radius must be > 0');
    }
    if (angle < 0 || angle >= Math.PI) {
        throw new Error('angle must be in [0, pi)');
    }
    return 2 * radius * Math.sin(angle / 2);
}

/**
 * Approximate a circle by drawing a many-sided regular polygon,
 * using exactly `numSides` small counterclockwise turns,
 * so that the turtle is back to its original heading and position
 * after the drawing is complete.
 *
 * @param turtle the turtle context
 * @param radius radius of the circle circumscribed around the polygon, must be > 0
 * @param numSides number of sides of the polygon to draw, must be >= 10
 */
export function drawApproximateCircle(turtle: Turtle, radius: number, numSides: number): void {
    // Implemented
    if (radius <=0){
        throw new Error('radius must be > 0');
    }
    if (numSides < 10) {
        throw new Error('numSides must be >= 10');
    }

    const angle = (2 * Math.PI) / numSides;
    const sideLength = chordLength(radius, angle);
    for (let i = 0; i < numSides; i++) {
        turtle.forward(sideLength);
        turtle.turn(-(360 / numSides));
    }
}

/**
 * Calculate the distance between two points.
 *
 * @param p1 one point
 * @param p2 another point
 * @returns Euclidean distance between p1 and p2
 */
export function distance(p1: Point, p2: Point): number {
    // Implemented
    const dy = p2.y - p1.y;
    const dx = p2.x - p1.x;
    return Math.sqrt((dy)**2 + (dx)**2);
}

/**
 * Given a list of points, find a sequence of turns and moves that visits the points in order,
 * ending with the turtle facing its original heading.
 *
 * @param points array of N input points.  Adjacent points must be distinct, and the array must not start with (0,0).
 * @returns an array of length 2N+1 of the form [turn_0, move_0, ..., turn_N-1, move_N-1, turn_N]
 *    such that if the turtle starts at (0,0) heading up (positive y direction),
 *    and executes turn(turn_i) and forward(move_i) actions in the same order,
 *    then it will be at points[i] after move_i for all valid i,
 *    and be back to its original upward heading after turn_N.
 */
export function findPath(points: Array<Point>): Array<number> {
    // Implemented
    if(points.length === 0) {
        return [0];
    }
    if ( points[0].x === 0 && points[0].y === 0) {
        throw new Error('First point must not be (0,0)');
    }
    let path: Array<number> = [];
    const turtleStartPoint = new Point(0, 0);
    let currentHeading = 0; // Upward direction

    for (let i = 0; i < points.length; i++) {
        if (i > 0 && points[i].equalValue(points[i - 1])) {
            throw new Error('Adjacent points must be distinct');
        }
        const currentPoint = i === 0 ? turtleStartPoint : points[i - 1];
        const nextPoint = points[i];
        const dx = nextPoint.x - currentPoint.x;
        const dy = nextPoint.y - currentPoint.y;
        const distanceToNext = distance(currentPoint, nextPoint);
        const angleToNext = Math.atan2(dx, dy) * (180 / Math.PI);  // axis are swapped to match turtle's coordinate system
        path.push(angleToNext - currentHeading);
        path.push(distanceToNext);
        currentHeading = angleToNext;
    }
    path.push(-currentHeading); // Final turn to face original heading
    return path;
}

/**
 * Draw your personal, custom art.
 *
 * Many interesting images can be drawn using the simple implementation of a turtle.
 * See the problem set handout for more information.
 *
 * @param turtle the turtle context
 */
export function drawPersonalArt(turtle: Turtle): void {
    // Implemented
    const rainbow = [
        PenColor.Red, PenColor.Orange, PenColor.Yellow, PenColor.Green,
        PenColor.Cyan, PenColor.Blue, PenColor.Magenta,
    ];

    // center: a rosette of 36 stars, each rotated 10° and a little smaller than the last
    const numRosetteStars = 36;
    let starSize = 220;
    for (let i = 0; i < numRosetteStars; i++) {
        turtle.color(rainbow[i % rainbow.length]);
        drawStar(turtle, starSize);
        turtle.turn(360 / numRosetteStars);
        starSize *= 0.97;
    }
    
    // outside: a ring of 12 small stars, alternating colors
    const numRingStars = 12;
    for (let i = 0; i < numRingStars; i++) {
        const color = i % 2 === 0 ? PenColor.Magenta : PenColor.Cyan;
        drawStarAt(turtle, i * (360 / numRingStars), 300, 40, color);
    }
}

/**
 * Draw a five-pointed star, starting and ending at the turtle's current position and heading.
 *
 * @param turtle the turtle context
 * @param size length of each of the star's 5 lines, must be > 0
 */
function drawStar(turtle: Turtle, size: number): void {
    const numPoints = 5;
    const turnDegrees = 144; // 180° minus the 36° tip angle; 5 turns = 720° = back to the original heading
    for (let i = 0; i < numPoints; i++) {
        turtle.forward(size);
        turtle.turn(turnDegrees);
    }
}

/**
 * Move the turtle forward without leaving a visible line.
 * Leaves the pen color set to Transparent.
 *
 * @param turtle the turtle context
 * @param units distance to move, must be > 0
 */
function moveWithoutDrawing(turtle: Turtle, units: number): void {
    turtle.color(PenColor.Transparent);
    turtle.forward(units);
}

/**
 * Draw a star away from the turtle, then come back,
 * so the turtle ends at its original position and heading.
 *
 * @param turtle the turtle context
 * @param heading direction to travel, in degrees clockwise from the turtle's current heading
 * @param distanceAway how far to travel before drawing, must be > 0
 * @param size size of the star, as in drawStar
 * @param color pen color for the star
 */
function drawStarAt(turtle: Turtle, heading: number, distanceAway: number, size: number, color: PenColor): void {
    turtle.turn(heading);
    moveWithoutDrawing(turtle, distanceAway);
    turtle.color(color);
    drawStar(turtle, size);
    turtle.turn(180);
    moveWithoutDrawing(turtle, distanceAway);
    turtle.turn(180 - heading);
}

/**
 * Main program.
 *
 * This function creates a turtle and draws in a window.
 */
function main(): void {
    const turtle: Turtle = new DrawableTurtle();

    const sideLength = 40;
    drawSquare(turtle, sideLength);

    const radius = 40;
    const numSides = 360;
    drawApproximateCircle(turtle, radius, numSides);

    drawPersonalArt(turtle);

    const outputFile = 'output.html';
    fs.writeFileSync(outputFile, `<!doctype html>\n<html><body>\n${turtle.getSVG()}</body></html>\n`);
    console.log(`wrote drawing to ${outputFile}`);
    exec(`open ${outputFile}`); // macOS; use "start" on Windows, "xdg-open" on Linux
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main();
}
