import React, { createElement, useState } from 'react';
import { createRoot } from 'react-dom/client';

import './styles/index.scss';
import AboutPage from './page-apps/AboutPage.jsx';
import FourOhFourPage from './page-apps/FourOhFourPage.jsx';
import GamePage from './page-apps/GamePage.jsx';

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
  'app-game': (_div) => (<GamePage />),
  'app-about': (_div) => (<AboutPage />),
  'page-404': (_div) => (<FourOhFourPage />),
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
