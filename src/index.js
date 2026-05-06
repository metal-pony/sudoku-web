import React, { createElement, useState } from 'react';
import { createRoot } from 'react-dom/client';

// Don't compile styles yet.
// import './styles/index.scss';

// <div>s with this attribute will be used as a container by the React component
// returned by the function at dataComponents[attribute.value].
const dataComponentAttr = 'data-component';

// <any-element> with this attribute will trigger the function(s) defined at
// dataFns[attribute.value]. Multiple functions can be specified, delimited
// by whitespace. The purpose of these functions is to allow for simple
// customizations that don't necessarily require React.
const dataFnAttr = 'data-fns';

/**
 * @type {Object<string, (element: Element) => void>}
 */
const dataFns = {};

/**
 * @type {Object<string, (div: HTMLDivElement) => React.ReactNode>}
 */
const dataComponents = {
  'app-home': (_div) => {
    return (
      <div>
        <h2>About</h2>
        <p>The vision for this site is to showcase my sudoku library. There will be an obligatory sudoku game page, in React and/or HTML Canvas, along with tools for generation and printing. There are probably hundreds if not thousands of sudoku sites floating about the web, but this one will be mine. I don't think there's anything really special about my code, except for the fact that I still prefer to hand-code such hobby projects, at a time when everyone and their dog is adopting ai coding agents (not a bad thing, but I feel like that would take the fun out of my hobby side-projects, ya know?). In the time it took me to type out this paragraph alone, ai probably could have possibly generated a good deal of a sudoku library. It only seems fitting to commit to building out this site to show it in action, starting with this little blank page.</p>
        <p>I believe in free software, so the associated library is free to use and share, the tools are complementary, anything you generate here including puzzles, puzzle images, printables, etc. is yours. This is, after all, a static webpage and the puzzle generation and computation is taking place on your computer. I don't own the fonts or icons, however; so if you plan on compiling a book for sale by copy-pasting images, then just like, be aware of that.</p>
        <p>If you're a sudoku-lover and happen to come across this space before it gets rolling, I hope you'll come back and check it out at a later date. <i className='fa-solid fa-heart' style={{color:'red'}}></i></p>
        <p><em>Contributions and comments are welcome.</em></p>
        <p>Site: <a href="https://github.com/metal-pony/sudoku-web">https://github.com/metal-pony/sudoku-web</a></p>
        <p>Sudoku library: <a href="https://github.com/metal-pony/sudoku-js">https://github.com/metal-pony/sudoku-js</a></p>
        <h3> May 5th, 2026</h3>
        <span><i className='fa-solid fa-wrench fa-lg'></i> Begin</span>
        <ul>
          <li>Stood-up project with boilerplate</li>
        </ul>
      </div>
    );
  },
  'page-404': (_div) => (
    <div>
      <h2>Oh bother.</h2>
      <div>
        <i class="fa-regular fa-file-code fa-2xl"></i>
        <p>This page doesn't exist.</p>
        <a href='/'>&lt; Go Back</a>
      </div>
    </div>
  ),
};

Array.from(document.getElementsByTagName('div'))
.filter(div => div.hasAttribute(dataComponentAttr))
.forEach(div => {
  const component = div.getAttribute(dataComponentAttr);
  if (Object.hasOwn(dataComponents, component)) {
    console.log(`Loading data-component: "${component}".`);
    createRoot(div).render(dataComponents[component](div));
  } else {
    console.error(`⚠️ Undefined data-component: "${component}".`);
  }
});

document.querySelectorAll('[data-fns]').forEach(el => {
  const fns = el.getAttribute('data-fns').split(' ');
  fns.forEach(fn => {
    if (dataFns[fn]) {
      dataFns[fn](el);
    } else {
      console.warn(`No such function ${fn}`);
    }
  });
});
