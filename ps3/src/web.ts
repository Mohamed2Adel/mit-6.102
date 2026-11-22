/* Copyright (c) 2021-26 MIT 6.102/6.031 course staff, all rights reserved.
 * Reconstructed for self-study from the public ps3 handout.
 *
 * PROVIDED CODE: web user interface, runs in the browser (loaded by web/index.html).
 * Start the server with: npm run web, then open http://localhost:8080/
 */

import { parse } from './expression.ts';
import { size, image } from './commands.ts';
import { ImageLibrary } from './imagelibrary.ts';

/**
 * @param id element id in web/index.html
 * @returns that element
 */
function element<T extends HTMLElement>(id: string): T {
    const found = document.getElementById(id);
    if (!found) { throw new Error(`missing #${id}`); }
    return found as T;
}

const filenames: Array<string> = await (await fetch('img/')).json();
const library = new ImageLibrary('img', ...filenames);
await library.loaded();
element('library').textContent = filenames.join(' ');

const input = element<HTMLTextAreaElement>('input');
const output = element<HTMLImageElement>('output');

element<HTMLFormElement>('form').addEventListener('submit', (event) => {
    event.preventDefault();
    element('parsed').textContent = '';
    element('size').textContent = '';
    element('error').textContent = '';
    output.removeAttribute('src');
    try {
        const expression = parse(input.value);
        element('parsed').textContent = expression.toString();
        element('size').textContent = size(expression, library);
        output.src = image(expression, library);
    } catch (e) {
        element('error').textContent = e instanceof Error ? e.message : String(e);
    }
});
