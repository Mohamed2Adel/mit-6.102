/* Copyright (c) 2021-26 MIT 6.102/6.031 course staff, all rights reserved.
 * Reconstructed for self-study from the public ps3 handout.
 *
 * PROVIDED CODE: console user interface. Run with: npm start
 * (This UI is allowed to use fs and child_process; YOUR code must not.)
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import readline from 'node:readline/promises';
import { execFile } from 'node:child_process';
import { type MemeExpression, parse } from './expression.ts';
import { size, image } from './commands.ts';
import { ImageLibrary } from './imagelibrary.ts';

const IMAGE_DIR = 'img';

/**
 * Read expressions and commands from the console and act on them.
 *   expression   parse and echo it; it becomes the current expression
 *   !size        print the size of the current expression as WxH
 *   !image       generate the image of the current expression and show it in a window
 *   !quit        exit
 */
async function main(): Promise<void> {
    const filenames = fs.readdirSync(IMAGE_DIR).filter(name => !name.startsWith('.'));
    const library = new ImageLibrary(IMAGE_DIR, ...filenames);
    console.log(`image library: ${filenames.join(' ')}`);

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: '> ' });
    let current: MemeExpression | undefined = undefined;

    rl.prompt();
    for await (const line of rl) {
        const input = line.trim();
        try {
            if (input === '') {
                // nothing
            } else if (input === '!quit') {
                break;
            } else if (input.startsWith('!')) {
                if (current === undefined) {
                    throw new Error('no current expression');
                }
                if (input === '!size') {
                    console.log(size(current, library));
                } else if (input === '!image') {
                    show(image(current, library));
                } else {
                    throw new Error(`unknown command ${input}`);
                }
            } else {
                current = parse(input);
                console.log(current.toString());
            }
        } catch (e) {
            console.log(e instanceof Error ? e.message : e);
        }
        rl.prompt();
    }
    rl.close();
}

/**
 * Save a data: URL as a PNG file and open it in the system image viewer.
 * @param dataUrl data:image/png;base64,... URL
 */
function show(dataUrl: string): void {
    const match = dataUrl.match(/^data:image\/png;base64,(.*)$/s);
    if (!match || match[1] === undefined) {
        throw new Error('image() did not return a PNG data: URL');
    }
    const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'memely-')), 'meme.png');
    fs.writeFileSync(file, Buffer.from(match[1], 'base64'));
    console.log(`saved ${file}`);
    const opener = process.platform === 'darwin' ? 'open'
        : process.platform === 'win32' ? 'explorer' : 'xdg-open';
    execFile(opener, [file], () => { /* ignore errors: the path is printed above */ });
}

await main();
