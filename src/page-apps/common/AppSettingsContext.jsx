import React, { createContext, useContext, useReducer, useState } from 'react';
import { SIZES } from '../../components/sudoku/SudokuBoard';

/**
 * @typedef {object} AppSettings
 * @property {number} puzzleSize
 * @property {string} puzzleDiff
 * @property {boolean} showTimer
 * @property {boolean} showCandidates
 * @property {boolean} autoReduceCandidates
 */

const LS_SETTINGS_KEY = 'settings';

/**
 * @typedef {object} SettingConfig
 * @property {any} default
 * @property {(value: any) => boolean} validate
 */

/**
 * @type {{[name: string]:SettingConfig}}
 */
const SETTINGS = {
  puzzleSize: {
    default: 3,
    min: 1,
    max: SIZES.length - 1,
    validate(value) {
      if (typeof value !== 'number') return false;
      if (value < this.min || value > this.max) return false;
      return true;
    }
  },
  puzzleDiff: {
    default: 'easy',
    set: ['easy','medium','hard'],
    validate(value) {
      if (typeof value !== 'string') return false;
      if (!this.set.includes(value)) return false;
      return true;
    }
  },
  showTimer: {
    default: true,
    validate(value) {
      return (typeof value === 'boolean');
    }
  },
  showCandidates: {
    default: false,
    validate(value) {
      return (typeof value === 'boolean');
    }
  },
  autoReduceCandidates: {
    default: true,
    validate(value) {
      return (typeof value === 'boolean');
    }
  },
  highlightSingles: {
    default: false,
    validate(value) {
      return (typeof value === 'boolean');
    }
  },
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
  // Pull settings from localStorage if it exists
  const rawSettingsStr = localStorage.getItem(LS_SETTINGS_KEY);
  /** @type {AppSettings} */
  let state = (rawSettingsStr) ? JSON.parse(rawSettingsStr) : {};
  // Validate -- delete any invalid settings
  for (let propertyName in state) {
    if (Object.hasOwn(SETTINGS, propertyName)) {
      if (!SETTINGS[propertyName].validate(state[propertyName])) {
        console.warn(`${propertyName} in saved settings is invalid and will be deleted.`);
        delete state[propertyName];
      }
    } else {
      console.warn(`${propertyName} in saved settings is not recognized and will be deleted.`);
      delete state[propertyName];
    }
  }
  // Merge-in defaults
  for (let name in SETTINGS) {
    if (!Object.hasOwn(state, name)) {
      state[name] = SETTINGS[name].default;
    }
  }
  // Push back to LS
  localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(state));

  /**
   * @type {ReturnType<typeof useState<AppSettings>>}
   */
  const [appState, setAppState] = useState({...state});

  // Create a middleware to validate state changes and push to LS
  const _setAppState = (stateChange) => {
    let changed = false;
    const newState = {...appState};
    for (let name in stateChange) {
      if (Object.hasOwn(SETTINGS, name)) {
        if (SETTINGS[name] === stateChange[name]) continue;
        if (SETTINGS[name].validate(stateChange[name])) {
          // console.log(`SETTINGS.${name} changed to ${''+stateChange[name]}; (was ${''+newState[name]})`);
          newState[name] = stateChange[name];
          changed = true;
        } else {
          console.warn(`${name} in stateChange is invalid and will not be applied.`);
        }
      } else {
        console.warn(`${name} in stateChange is not recognized and will not be applied.`);
      }
    }
    if (changed) {
      localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(newState));
      setAppState(newState);
    }
  };

  return (
    <SettingsContext.Provider value={{ appState, setAppState: _setAppState }}>
      {children}
    </SettingsContext.Provider>
  );
}

export default SettingsProvider;
