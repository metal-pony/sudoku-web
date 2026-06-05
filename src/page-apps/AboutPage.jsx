import React from 'react';
import Article from '../components/Article';
import BasePage from './common/BasePage';
import { sudoku17 } from '@metal-pony/sudoku-js';

const iconCheck = (<i className='fa-solid fa-check secondary'></i>);
const libRepoLink = (
  <a href='https://github.com/metal-pony/sudoku-js' className='link'>
    <i className='fa-brands fa-github fa-sm'></i>&nbsp;sudoku-js
  </a>
);
const pagesRepoLink = (
  <a href='https://github.com/metal-pony/sudoku-web' className='link'>
    <i className='fa-brands fa-github fa-sm'></i>&nbsp;sudoku-web
  </a>
);

/**
 *
 * @param {object} props
 * @param {string} props.title
 * @param {string} props.date
 * @param {} props.children
 * @returns
 */
function Header({ title, date }) {
  return (
    <Article.Header className='flex h primary border-b border-grey items-end'>
      <h3>++&nbsp;{ title }</h3>
      <div className='flex pb pl-- end items-end grey'><small>{ date }</small></div>
    </Article.Header>
  );
}

/**
 *
 * @param {object} props
 * @param {string[]} props.items
 */
function List({ items }) {
  return (
    <ul className='mono light-grey'>{
      items.map((text, i) => (
        <li key={`changeblog_list_item_${i}`}>- {text}</li>
      ))
    }</ul>
  );
}

function ChangeBlogEntry({ title, date, items, children }) {
  return (
    <Article>
      <Article.Header className='flex h primary border-b border-grey items-end'>
        <h3>++&nbsp;{ title }</h3>
        <div className='flex pb pl-- end items-end grey'><small>{ date }</small></div>
      </Article.Header>
      <div className='pt-- px-- flex v row-gap- small grey'>
        { children }
        <ul className='mono light-grey'>{
          items.map((text, i) => (
            <li key={`changeblog_list_item_${i}`}>- {text}</li>
          ))
        }</ul>
      </div>
    </Article>
  );
}

export function AboutPage({}) {
  const randomSudoku = sudoku17[Math.trunc(Math.random() * sudoku17.length)];
  const randomSudokuLink = `https://metal-pony.github.io/sudoku-web/?grid=${randomSudoku.toString()}`;

  return (
    <BasePage>
      <div className='flex v row-gap---'>
        <Article>
          <Article.Header className='primary border-b border-grey'>
            <h2>About</h2>
          </Article.Header>
          <div className='pt-- px-- flex v row-gap-'>
            <p>This is a showcase for a sudoku library, {libRepoLink}, including a game page and tools for generation and printing. Hand-coded with <i className='fa-solid fa-heart fa-sm' style={{color:'red'}}></i>.</p>
            <p>The library is free to use in your own projects. The tools here are complementary, and anything you generate including puzzles, puzzle images, printables, etc. is yours. The page is static - so all generation and computation is happening in your browser, not some server. I don't own the fonts or icons, however; so if you plan on compiling a book for sale by copy-pasting images, then just be aware of that.</p>
            <p>If you're a sudoku-lover and happen to come across this space before it gets rolling, I hope you'll come back and check it out at a later date.</p>
            <p><em>Contributions and comments are welcome on the repo page {pagesRepoLink}.</em></p>
          </div>
        </Article>

        <Article>
          <Article.Header className='primary border-b border-grey'>
            <h2>Changeblog</h2>
          </Article.Header>

          <div className='pt-- px-- flex v row-gap-'>
            <ChangeBlogEntry
              title='Undo'
              date='June 5th, 2026'
              items={[
                'A history of game move is now tracked',
                'Added an \'undo\' button to rollback a step in game history',
              ]}
            >
              <p>It's easy to misclick on a candidate and set a cell digit unintentionally. A frustrating side-effect is that neighboring cell's candidates are also automatically reduced unintentionally. To help correct this, changes to the game board are tracked in a history stack. There's a button since last update to reset all of the board's candidates, and now there's another button to undo the previous move.</p>
              <p>Note there may be some quirkiness regarding the game history and shuffling.</p>
            </ChangeBlogEntry>

            <ChangeBlogEntry
              title='Settings Saved'
              date='June 2nd, 2026'
              items={[
                'Settings are now saved in localStorage between sessions',
                'Grids can be loaded via URL',
              ]}
            >
              <p>
                An important feature is sharing and loading puzzles. So to start, grids can now be loaded from the 'grid' url parameter.
                Example: ^<a className='link' href={randomSudokuLink} target='_blank'>{randomSudokuLink}</a>
              </p>
            </ChangeBlogEntry>

            <ChangeBlogEntry
              title='Candidates View'
              date='May 26th, 2026'
              items={[
                'Cell candidates can be shown via settings',
                'Puzzle size can be adjusted via settings',
                'Left-clicking a candidate toggles its visibility; when it\'s the last one, it sets the cell digit instead',
                'Right-clicking a candidate will set cell digit',
                'Left or Right-clicking a cell with a digit reverts the cell to show candidates',
                'Candidates will automatically reduce in neighboring cells when a digit is set',
                'Added a button to reset all candidates',
              ]}
            />

            <ChangeBlogEntry
              title='Pause'
              date='May 15th, 2026'
              items={[
                'Added the settings drawer',
                'Game can now be paused, and shuffles upon resuming',
              ]}
            />

            <ChangeBlogEntry
              title='Time for Game'
              date='May 10th, 2026'
              items={[
                'Added a blurry overlay to the board and a Start button',
                'Game time is tracked and displayed'
              ]}
            />

            <ChangeBlogEntry
              title={<>Game Launch <i className='fa-solid fa-rocket secondary'></i></>}
              date={'May 8th, 2026'}
              items={['Created first playable game page']}
            >
              <p>The first iteration of the game page is simple - the game board, a 'New Game' button, and a shuffle button. It's fixed at 27-clue puzzles, without regard to difficulty (difficulty ranking is actually NYI in the library). Because 27-clues is very fast to generate, it runs synchronously as the page component renders, but later should be moved to a worker. The shuffle button performs a number of operations such that the puzzle such that it becomes nearly unrecognizable from its previous form, but remains essentially the same puzzle. The board itself is a simple array of &lt;div&gt; with click handlers to cycle through digits as a cell is clicked.</p>
              <p>I have much more half-baked code, features, pages, in my editor ready to be refined and released piece by piece. A feature idea dump in the repo issues could help keep things organized.</p>
            </ChangeBlogEntry>

            <ChangeBlogEntry
              title='Pizzazz'
              date='May 7th, 2026'
              items={[
                'Refine text and apply some style',
                'Start creating a few reusable components',
              ]}
            />

            <ChangeBlogEntry
              title='Initialization'
              date='May 5th, 2026'
              items={[
                'Laid out site vision',
                'Initialized empty site',
              ]}
            >
              <p>The vision is to showcase the sudoku library. There will be an obligatory sudoku game page, in React and/or HTML Canvas, along with tools for generation and printing. There are many sudoku sites already on the web, but this one will be mine. There's nothing really special about my code, but I still insist on hand-coding my hobby projects (ai is not bad, but using it might take the fun out of the game, ya know?). In the time it took me to type out this paragraph alone, ai probably could have possibly generated a good deal of a sudoku library. It only seems fitting to commit to building out this site to show it in action, starting with this little blank page.</p>
            </ChangeBlogEntry>
          </div>
        </Article>
      </div>
    </BasePage>
  );
}

export default AboutPage;
