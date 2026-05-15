import React, { useContext, useState } from 'react';
import Page from '../../components/page/Page';
import classNames from 'classnames';
import SettingsProvider, { SettingsContext } from './AppSettingsContext';

const NAV_LINKS = [
  { text: 'Play', href: './' },
  { text: 'About', href: './about.html' },
  // { text: 'How to Play', href: './sudoku-tutorial.html' },
  // { text: 'Generator', href: './generator.html' },
];

function BasePageNav({ settingsOpen, setSettingsOpen }) {
  const { appState, setAppState } = useContext(SettingsContext);

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
    <Page.Nav className='flex v w-full items-center sticky-top bg-night border-b border-gold mono bold'>
      <div className='flex h w-full h-full items-center'>
        <div className='nav-left flex h col-gap--- center'>
        { navigation }
      </div>
      <div className='nav-center flex'>
        <header className='page-header w-full mono gold text-center no-select'>
          <h1>Sudoku.JS</h1>
        </header>
      </div>
        <div className='nav-right flex center'>
        <a
          className={classNames('active-secondary use-pointer no-select', settingsOpen ? 'secondary' : 'grey hover-light')}
          onClick={(ev) => {
            ev.preventDefault();
            setSettingsOpen(!settingsOpen);
          }}
        >
          Settings&nbsp;<i className={classNames('anim anim-transform anim-fast fa-solid fa-gear fa-lg', {
            'rotate--180': settingsOpen
          })}></i>
        </a>
        </div>
      </div>
    </Page.Nav>
  );
}

function BasePageSettingsDrawer({ settingsOpen, setSettingsOpen }) {
  const { appState, setAppState } = useContext(SettingsContext);

  return (
    <div className={classNames('anim anim-right anim-fast settings-drawer bg-night border-t border-gold grey mono', {
      open: settingsOpen
    })}>
      <div className='flex v row-gap-- py--- pr---- end items-end'>
        <label htmlFor='showTimer' className='no-select'>
          <input
            id='showTimer'
            name='showTimer'
            type='checkbox'
            defaultChecked
            onChange={(ev) => {
              setAppState({
                ...appState,
                showTimer: ev.target.checked
              });
            }}
          />&nbsp;Show Timer
        </label>

      </div>
    </div>
  );
}

export function BasePage({ children }) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <SettingsProvider>
    <Page className='center'>
        <BasePageNav settingsOpen={settingsOpen} setSettingsOpen={setSettingsOpen} />

        <div className='page-main-container w-full center'>
          <main className='page-main'>
            { children }
          </main>

          <div
            className={classNames('overlay w-full h-full use-pointer', {
              hidden: !settingsOpen
            })}
            onClick={(ev) => {
              ev.preventDefault();
              setSettingsOpen(false);
            }}
          ></div>
        </div>

        <BasePageSettingsDrawer settingsOpen={settingsOpen} setSettingsOpen={setSettingsOpen} />

      <Page.Footer className='w-full pt--- flex wrap center grey'></Page.Footer>
    </Page>
    </SettingsProvider>
  );
}

export default BasePage;
