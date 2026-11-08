/*
 * Reconstructed from the public 6.102 Spring 2026 ps0 API docs
 * (https://web.mit.edu/6.102/www/sp26/psets/ps0/doc/).
 * The official starter code is on github.mit.edu, which needs an MIT account.
 * You should NOT need to edit this file.
 */

/**
 * Enumeration of turtle pen colors.
 */
export enum PenColor {
    Transparent = 0,
    Black = 1,
    Gray = 2,
    Red = 3,
    Pink = 4,
    Orange = 5,
    Yellow = 6,
    Green = 7,
    Cyan = 8,
    Blue = 9,
    Magenta = 10,
}

const SVG_COLORS: ReadonlyMap<PenColor, string> = new Map([
    [PenColor.Transparent, 'none'],
    [PenColor.Black, 'black'],
    [PenColor.Gray, 'gray'],
    [PenColor.Red, 'red'],
    [PenColor.Pink, 'pink'],
    [PenColor.Orange, 'orange'],
    [PenColor.Yellow, 'gold'],
    [PenColor.Green, 'green'],
    [PenColor.Cyan, 'cyan'],
    [PenColor.Blue, 'blue'],
    [PenColor.Magenta, 'magenta'],
]);

/**
 * An immutable point in floating-point pixel space.
 */
export class Point {
    /**
     * Construct a point from an x and y coordinate.
     *
     * @param x the x-coordinate of the point
     * @param y the y-coordinate of the point
     */
    public constructor(
        public readonly x: number,
        public readonly y: number
    ) {
    }

    /**
     * @param that point to compare `this` with
     * @returns true iff this and that represent the same point
     */
    public equalValue(that: Point): boolean {
        return this.x === that.x && this.y === that.y;
    }

    public toString(): string {
        return `Point(${this.x},${this.y})`;
    }
}

/**
 * An immutable line segment in floating-point pixel space.
 */
export class LineSegment {
    /**
     * Construct a line segment from start and end points.
     *
     * @param start one end of the line segment
     * @param end the other end of the line segment
     * @param color line segment color
     */
    public constructor(
        public readonly start: Point,
        public readonly end: Point,
        public readonly color: PenColor
    ) {
    }

    /**
     * Construct a line segment from coordinate pairs.
     *
     * @returns line segment from (startx,starty) to (endx,endy) colored `color`
     */
    public static fromCoordinates(startx: number, starty: number, endx: number, endy: number, color: PenColor): LineSegment {
        return new LineSegment(new Point(startx, starty), new Point(endx, endy), color);
    }

    /**
     * Compute the length of this segment.
     *
     * @returns the length of the line segment
     */
    public length(): number {
        return Math.hypot(this.end.x - this.start.x, this.end.y - this.start.y);
    }

    /**
     * @param that line segment to compare `this` with
     * @returns true iff this and that represent the same line segment
     */
    public equalValue(that: LineSegment): boolean {
        return this.start.equalValue(that.start) && this.end.equalValue(that.end) && this.color === that.color;
    }
}

/**
 * Turtle interface.
 *
 * Defines the interface that any turtle must implement. Note that the
 * standard directions/rotations use Logo semantics: initial heading
 * of zero is 'up', and positive angles rotate the turtle clockwise.
 */
export interface Turtle {
    /**
     * Move the turtle forward a number of steps.
     *
     * @param units number of steps to move in the current direction; must be positive
     */
    forward(units: number): void;

    /**
     * Change the turtle's heading by a number of degrees clockwise.
     *
     * @param degrees amount of change in angle, in degrees, with positive being clockwise
     */
    turn(degrees: number): void;

    /**
     * Change the turtle's current pen color.
     *
     * @param color new pen color
     */
    color(color: PenColor): void;

    /**
     * Get the image created by this turtle.
     *
     * @returns string containing image in SVG format
     */
    getSVG(): string;
}

/**
 * Turtle that draws in a window on the screen.
 */
export class DrawableTurtle implements Turtle {
    private static readonly MARGIN = 20;

    private readonly lines: Array<LineSegment> = [];
    private position = new Point(0, 0);
    private headingDegrees = 0; // 0 = up, increasing clockwise
    private penColor = PenColor.Black;

    public forward(units: number): void {
        const radians = this.headingDegrees * Math.PI / 180;
        const newPosition = new Point(
            this.position.x + units * Math.sin(radians),
            this.position.y + units * Math.cos(radians)
        );
        this.lines.push(new LineSegment(this.position, newPosition, this.penColor));
        this.position = newPosition;
    }

    public turn(degrees: number): void {
        this.headingDegrees = (this.headingDegrees + degrees) % 360;
    }

    public color(color: PenColor): void {
        this.penColor = color;
    }

    public getSVG(): string {
        const points = [new Point(0, 0), ...this.lines.flatMap(line => [line.start, line.end])];
        const minX = Math.min(...points.map(p => p.x)) - DrawableTurtle.MARGIN;
        const maxX = Math.max(...points.map(p => p.x)) + DrawableTurtle.MARGIN;
        const minY = Math.min(...points.map(p => p.y)) - DrawableTurtle.MARGIN;
        const maxY = Math.max(...points.map(p => p.y)) + DrawableTurtle.MARGIN;
        // turtle space has y pointing up; SVG has y pointing down, so negate y
        const svgLines = this.lines.map(line =>
            `<line x1="${line.start.x}" y1="${-line.start.y}" x2="${line.end.x}" y2="${-line.end.y}"`
            + ` stroke="${SVG_COLORS.get(line.color)}" stroke-width="1" />`
        );
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${-maxY} ${maxX - minX} ${maxY - minY}"`
            + ` width="${maxX - minX}" height="${maxY - minY}">\n`
            + svgLines.join('\n')
            + '\n</svg>\n';
    }
}
