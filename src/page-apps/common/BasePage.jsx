import React from 'react';
import Page from '../../components/page/Page';

const NAV_LINKS = [
  { text: 'Home (Play)', href: './' },
  { text: 'About', href: './about.html' },
  // { text: 'How to Play', href: './sudoku-tutorial.html' },
  // { text: 'Generator', href: './generator.html' },
];

function BasePageNav({}) {
  const navigation = NAV_LINKS.map((link, i) => (link.icon ? (
    <a
      key={`nav_link_${i}`}
      className='grey hover-light active-secondary'
      href={link.href}
    >
      <i className={link.icon}></i>&nbsp;{link.text}
    </a>
  ) : (
    <a
      key={`nav_link_${i}`}
      className='grey hover-light active-secondary'
      href={link.href}
    >{link.text}</a>
  )));

  return (
    <Page.Nav className='flex h w-full items-center sticky-top bg-night border-b border-gold mono bold'>
      <div className='w-4 flex h col-gap---- pl---- left small'>{ navigation }</div>
      <div className='w-4 flex'>
        <header className='page-header w-full mono gold text-center no-select'>
          <h1>Sudoku.JS</h1>
        </header>
      </div>
      <div className='w-4 flex end pr----'>
      </div>
    </Page.Nav>
  );
}

export function BasePage({ children }) {
  return (
    <Page className='center'>
        <BasePageNav />

        <div className='page-main w-full center'>
          <main className='w-8 page-max-width'>
            { children }
          </main>
        </div>

      <Page.Footer className='w-full pt--- flex wrap center grey'></Page.Footer>
    </Page>
  );
}

export default BasePage;
