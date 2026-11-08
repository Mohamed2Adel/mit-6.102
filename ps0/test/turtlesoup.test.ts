/*
 * Tests for ps0.
 * The first test in each suite matches the public tests named in the handout; the rest are extra
 * tests that only check what the specs promise (they never pass inputs that break a precondition).
 * The real autograder also has hidden tests, so passing these does not mean your code is perfect.
 */

import assert from 'node:assert';
import { chordLength, distance, drawApproximateCircle, drawSquare, findPath } from '../src/turtlesoup.js';
import { PenColor, Point, Turtle } from '../src/turtle.js';

/**
 * Assert that two numbers are equal within a given error tolerance.
 *
 * @param actual answer actually returned by the module being tested
 * @param expected answer expected by the test
 * @param delta actual is considered equal to expected if it's within +/- delta; defaults to 0.001
 * @param message optional message with extra information about this test case, to display when the assertion fails
 */
function assertAlmostEqual(actual: number, expected: number, delta: number = 0.001, message?: string): void {
    assert(Math.abs(actual - expected) <= delta,
        `expected ${expected} +/- ${delta}, got ${actual}` + (message ? `: ${message}` : ''));
}

/**
 * Assert that a heading in degrees points up, i.e. is a multiple of 360 within tolerance.
 */
function assertHeadingUp(heading: number, message: string): void {
    const remainder = ((heading % 360) + 360) % 360;
    assert(Math.min(remainder, 360 - remainder) < 0.001, `${message}: heading was ${heading} degrees`);
}

/**
 * Simulate a findPath result on a turtle that starts at (0,0) heading up,
 * and check it against the findPath spec.
 */
function assertValidPath(points: Array<Point>, path: Array<number>): void {
    assert.strictEqual(path.length, 2 * points.length + 1, 'path must have length 2N+1');
    assert(path.every(value => Number.isFinite(value)), `path must contain only finite numbers: ${path}`);
    let x = 0;
    let y = 0;
    let heading = 0; // degrees clockwise from up
    for (let i = 0; i < points.length; ++i) {
        heading += path[2 * i]!;
        const move = path[2 * i + 1]!;
        x += move * Math.sin(heading * Math.PI / 180);
        y += move * Math.cos(heading * Math.PI / 180);
        assertAlmostEqual(x, points[i]!.x, 0.001, `x after move ${i}`);
        assertAlmostEqual(y, points[i]!.y, 0.001, `y after move ${i}`);
    }
    heading += path[path.length - 1]!;
    assertHeadingUp(heading, 'final heading should be up');
}

/**
 * Turtle that draws nothing but records every command, so tests can check what was drawn.
 * Starts at (0,0) heading up, like DrawableTurtle.
 */
class RecordingTurtle implements Turtle {
    public readonly moves: Array<number> = [];
    public readonly turns: Array<number> = [];
    /** position after each forward(), starting with the initial position */
    public readonly positions: Array<Point> = [new Point(0, 0)];
    public heading = 0; // degrees clockwise from up

    public forward(units: number): void {
        this.moves.push(units);
        const last = this.positions[this.positions.length - 1]!;
        const radians = this.heading * Math.PI / 180;
        this.positions.push(new Point(last.x + units * Math.sin(radians), last.y + units * Math.cos(radians)));
    }

    public turn(degrees: number): void {
        this.turns.push(degrees);
        this.heading += degrees;
    }

    public color(color: PenColor): void {
    }

    public getSVG(): string {
        return '';
    }

    public get position(): Point {
        return this.positions[this.positions.length - 1]!;
    }

    /** @returns the visited positions with near-duplicates (within 0.001) removed */
    public distinctPositions(): Array<Point> {
        const distinct: Array<Point> = [];
        for (const p of this.positions) {
            if (!distinct.some(q => Math.hypot(p.x - q.x, p.y - q.y) < 0.001)) {
                distinct.push(p);
            }
        }
        return distinct;
    }
}

/**
 * Assert that the turtle never called forward() with a non-positive number,
 * since Turtle.forward requires units to be positive.
 */
function assertOnlyPositiveMoves(turtle: RecordingTurtle): void {
    for (const units of turtle.moves) {
        assert(units > 0, `forward() must be called with positive units, but got ${units}`);
    }
}

describe('drawSquare', function() {
    /*
     * Testing strategy for drawSquare(turtle, sideLength):
     *   partition on sideLength: 0, 0 < sideLength < 1, integer > 1, non-integer > 1
     *   check: the corners visited form a square of the right size, and forward() is only called with positive units
     */

    /**
     * Assert that the turtle visited exactly 4 distinct corners forming a square with the given side.
     * Works for any orientation and either turning direction.
     */
    function assertDrewSquare(turtle: RecordingTurtle, sideLength: number): void {
        const corners = turtle.distinctPositions();
        assert.strictEqual(corners.length, 4, `a square has 4 corners, but the turtle visited ${corners.length}`);
        const pairDistances: Array<number> = [];
        for (let i = 0; i < corners.length; ++i) {
            for (let j = i + 1; j < corners.length; ++j) {
                pairDistances.push(distanceBetween(corners[i]!, corners[j]!));
            }
        }
        pairDistances.sort((a, b) => a - b);
        // a square has 4 sides of length s and 2 diagonals of length s*sqrt(2)
        for (let k = 0; k < 4; ++k) {
            assertAlmostEqual(pairDistances[k]!, sideLength, 0.001, `side ${k}`);
        }
        for (let k = 4; k < 6; ++k) {
            assertAlmostEqual(pairDistances[k]!, sideLength * Math.SQRT2, 0.001, `diagonal ${k - 4}`);
        }
    }

    it('sideLength = 0 draws nothing and never calls forward(0)', function() {
        const turtle = new RecordingTurtle();
        drawSquare(turtle, 0);
        assertOnlyPositiveMoves(turtle);
        assert.strictEqual(turtle.distinctPositions().length, 1, 'turtle should not have moved');
    });

    it('integer sideLength', function() {
        const turtle = new RecordingTurtle();
        drawSquare(turtle, 40);
        assertOnlyPositiveMoves(turtle);
        assertDrewSquare(turtle, 40);
    });

    it('non-integer sideLength', function() {
        const turtle = new RecordingTurtle();
        drawSquare(turtle, 12.75);
        assertOnlyPositiveMoves(turtle);
        assertDrewSquare(turtle, 12.75);
    });

    it('sideLength between 0 and 1', function() {
        const turtle = new RecordingTurtle();
        drawSquare(turtle, 0.5);
        assertOnlyPositiveMoves(turtle);
        assertDrewSquare(turtle, 0.5);
    });
});

describe('chordLength', function() {
    /*
     * Testing strategy for chordLength(radius, angle):
     *   partition on angle: 0, small (close to 0), acute, right (pi/2), obtuse, close to pi
     *   partition on radius: 0 < radius < 1, 1, integer > 1, non-integer > 1
     *   partition on result: integer, non-integer
     */

    it('acute angle, integer result', function() {
        assertAlmostEqual(chordLength(5, 2 * Math.asin(3 / 5)), 6);
    });

    it('right angle, decimal result', function() {
        assertAlmostEqual(chordLength(1, Math.PI / 2), Math.sqrt(2));
    });

    it('obtuse angle, decimal result', function() {
        assertAlmostEqual(chordLength(2, 2 * Math.PI / 3), 2 * Math.sqrt(3));
    });

    it('angle = 0 gives 0', function() {
        assertAlmostEqual(chordLength(7, 0), 0);
    });

    it('very small angle, chord is close to the arc length', function() {
        assertAlmostEqual(chordLength(100, 0.001), 0.1, 0.00001);
    });

    it('angle close to pi, chord is close to the diameter', function() {
        assertAlmostEqual(chordLength(3, Math.PI - 1e-9), 6);
    });

    it('60 degrees gives a chord equal to the radius', function() {
        assertAlmostEqual(chordLength(4.5, Math.PI / 3), 4.5);
    });

    it('radius between 0 and 1', function() {
        assertAlmostEqual(chordLength(0.25, Math.PI / 2), 0.25 * Math.sqrt(2));
    });
});

describe('drawApproximateCircle', function() {
    /*
     * Testing strategy for drawApproximateCircle(turtle, radius, numSides):
     *   partition on numSides: 10 (minimum), odd, even, large (360)
     *   partition on radius: 0 < radius < 1, integer, non-integer
     *   check: exactly numSides turns, all counterclockwise (negative);
     *          back to the original position and heading;
     *          numSides distinct corners, all on a circle of the given radius, with equal sides
     */

    /**
     * Assert the turtle drew a regular polygon with numSides sides inscribed in a circle of the given radius,
     * following every part of the drawApproximateCircle spec.
     */
    function assertDrewCircle(turtle: RecordingTurtle, radius: number, numSides: number): void {
        assertOnlyPositiveMoves(turtle);
        assert.strictEqual(turtle.turns.length, numSides, 'must use exactly numSides turns');
        for (const degrees of turtle.turns) {
            assert(degrees < 0, `every turn must be counterclockwise (negative), but got ${degrees}`);
        }
        assertAlmostEqual(turtle.position.x, 0, 0.001, 'must end at original x');
        assertAlmostEqual(turtle.position.y, 0, 0.001, 'must end at original y');
        assertHeadingUp(turtle.heading, 'must end at original heading');

        const corners = turtle.distinctPositions();
        assert.strictEqual(corners.length, numSides, `polygon should have ${numSides} distinct corners`);
        // the center of a regular polygon is the average of its corners
        const center = new Point(
            corners.reduce((sum, p) => sum + p.x, 0) / corners.length,
            corners.reduce((sum, p) => sum + p.y, 0) / corners.length
        );
        for (const corner of corners) {
            assertAlmostEqual(distanceBetween(corner, center), radius, 0.001, 'every corner should be on the circle');
        }
        const expectedSide = 2 * radius * Math.sin(Math.PI / numSides);
        for (const units of turtle.moves) {
            assertAlmostEqual(units, expectedSide, 0.001, 'all sides should have equal length');
        }
    }

    it('minimum numSides = 10, integer radius', function() {
        const turtle = new RecordingTurtle();
        drawApproximateCircle(turtle, 40, 10);
        assertDrewCircle(turtle, 40, 10);
    });

    it('odd numSides, non-integer radius', function() {
        const turtle = new RecordingTurtle();
        drawApproximateCircle(turtle, 17.5, 11);
        assertDrewCircle(turtle, 17.5, 11);
    });

    it('large numSides', function() {
        const turtle = new RecordingTurtle();
        drawApproximateCircle(turtle, 40, 360);
        assertDrewCircle(turtle, 40, 360);
    });

    it('radius between 0 and 1', function() {
        const turtle = new RecordingTurtle();
        drawApproximateCircle(turtle, 0.5, 24);
        assertDrewCircle(turtle, 0.5, 24);
    });

    it('circle curves to the left of the starting heading', function() {
        // turning counterclockwise from heading up means the circle lies at x <= 0
        const turtle = new RecordingTurtle();
        drawApproximateCircle(turtle, 10, 20);
        for (const p of turtle.positions) {
            assert(p.x <= 0.001, `counterclockwise circle should stay left of the start, but visited ${p}`);
        }
    });
});

describe('distance', function() {
    /*
     * Testing strategy for distance(p1, p2):
     *   partition on x: p1.x = p2.x, p1.x != p2.x
     *   partition on y: p1.y = p2.y, p1.y != p2.y
     *   partition on coordinates: all >= 0, some < 0
     *   partition on coordinates: integer, non-integer
     *   also: swapping p1 and p2 gives the same result
     */

    it('for p1.x = p2.x, p1.y != p2.y', function() {
        assertAlmostEqual(distance(new Point(3, 1), new Point(3, 8)), 7);
    });

    it('for p1.x != p2.x, p1.y != p2.y', function() {
        assertAlmostEqual(distance(new Point(-1, 2), new Point(2, 6)), 5);
    });

    it('for p1.x = p2.x, p1.y = p2.y', function() {
        assertAlmostEqual(distance(new Point(4.5, -2), new Point(4.5, -2)), 0);
    });

    it('for p1.x != p2.x, p1.y = p2.y', function() {
        assertAlmostEqual(distance(new Point(-6, 2), new Point(4, 2)), 10);
    });

    it('all negative coordinates', function() {
        assertAlmostEqual(distance(new Point(-1, -1), new Point(-4, -5)), 5);
    });

    it('non-integer coordinates, non-integer result', function() {
        assertAlmostEqual(distance(new Point(0.5, 1.5), new Point(1.5, 2.5)), Math.SQRT2);
    });

    it('swapping p1 and p2 gives the same distance', function() {
        const p1 = new Point(2, -7.25);
        const p2 = new Point(-3.5, 4);
        assertAlmostEqual(distance(p1, p2), distance(p2, p1));
    });

    it('from the origin', function() {
        assertAlmostEqual(distance(new Point(0, 0), new Point(8, 6)), 10);
    });
});

describe('findPath', function() {
    /*
     * Testing strategy for findPath(points):
     *   partition on N = points.length: 0, 1, > 1
     *   partition on direction of a move: up, down, left, right, diagonal
     *   partition on turn needed: none (straight ahead), right, left, U-turn
     *   partition on revisiting: no point repeated, a non-adjacent point repeated, returns to (0,0)
     *   partition on coordinates: integer, non-integer, negative
     */

    it('single point straight ahead', function() {
        const points = [new Point(0, 10)];
        assertValidPath(points, findPath(points));
    });

    it('square path', function() {
        const points = [new Point(0, 1), new Point(1, 1), new Point(1, 0), new Point(0, 0)];
        assertValidPath(points, findPath(points));
    });

    it('point behind the turtle', function() {
        const points = [new Point(0, -5), new Point(-3, -9)];
        assertValidPath(points, findPath(points));
    });

    it('arbitrary non-integer points', function() {
        const points = [new Point(2.5, -1), new Point(-4, 3.25), new Point(-4, -7), new Point(10, 0.5)];
        assertValidPath(points, findPath(points));
    });

    it('empty array: just a final turn back to up', function() {
        assertValidPath([], findPath([]));
    });

    it('single point to the right', function() {
        const points = [new Point(7, 0)];
        assertValidPath(points, findPath(points));
    });

    it('single point to the left', function() {
        const points = [new Point(-7, 0)];
        assertValidPath(points, findPath(points));
    });

    it('single diagonal point', function() {
        const points = [new Point(3, 4)];
        assertValidPath(points, findPath(points));
    });

    it('back and forth (U-turns)', function() {
        const points = [new Point(0, 5), new Point(0, -5), new Point(0, 5)];
        assertValidPath(points, findPath(points));
    });

    it('straight line with no turns in the middle', function() {
        const points = [new Point(2, 2), new Point(4, 4), new Point(6, 6)];
        assertValidPath(points, findPath(points));
    });

    it('revisits a non-adjacent point', function() {
        const points = [new Point(5, 0), new Point(5, 5), new Point(5, 0), new Point(-5, 0)];
        assertValidPath(points, findPath(points));
    });

    it('counterclockwise loop around the origin', function() {
        const points = [new Point(-1, 1), new Point(-1, -1), new Point(1, -1), new Point(1, 1), new Point(-1, 1)];
        assertValidPath(points, findPath(points));
    });

    it('many points on a circle', function() {
        const points: Array<Point> = [];
        for (let i = 1; i <= 36; ++i) {
            const radians = i * 10 * Math.PI / 180;
            points.push(new Point(10 * Math.cos(radians), 10 * Math.sin(radians) + 0.5));
        }
        assertValidPath(points, findPath(points));
    });
});

/** Distance helper for the tests, independent of the implementation's distance(). */
function distanceBetween(p1: Point, p2: Point): number {
    return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}
