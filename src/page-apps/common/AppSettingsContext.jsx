import React, { createContext, useContext, useReducer, useState } from 'react';

/**
 * @typedef {object} AppSettings
 * @property {number} puzzleSize
 * @property {boolean} showTimer
 */

/**
 * @type {AppSettings}
 */
const DEFAULT_SETTINGS = {
  puzzleSize: 3,
  puzzleDiff: 'easy',
  showTimer: true
};

/**
 * @type {React.Context<AppSettings>}
 */
export const SettingsContext = createContext(null);

/**
 *
 * @param {object} props
 * @param {any} props.children
 */
export function SettingsProvider({ children }) {
  const [appState, setAppState] = useState({...DEFAULT_SETTINGS});

  return (
    <SettingsContext.Provider value={{ appState, setAppState }}>
      {children}
    </SettingsContext.Provider>
  );
}

export default SettingsProvider;
