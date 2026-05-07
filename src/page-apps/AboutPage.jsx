import React from 'react';
import Page from '../components/page/Page';
import Article from '../components/Article';

const iconCheck = (<i className='fa-solid fa-check secondary'></i>);
const libRepoLink = (
  <a href="https://github.com/metal-pony/sudoku-js">
    <i className='fa-brands fa-github fa-sm'></i>&nbsp;sudoku-js
  </a>
);
const pagesRepoLink = (
  <a href="https://github.com/metal-pony/sudoku-web">
    <i className='fa-brands fa-github fa-sm'></i>&nbsp;sudoku-web
  </a>
);

export function AboutPage({}) {
  return (
    <Page className='center'>
      <Page.Header
        text='Sudoku.JS' href='/'
        className='w-full pt---- pb- mono gold text-center'
      />
      <div className='w-8 pt--- page-max-width'>
        <main className='flex v row-gap---'>
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
              <Article>
                <Article.Header className='flex h primary border-b border-grey items-end'>
                  <h3>++ Pizzazz</h3>
                  <div className='flex pb pl-- end items-end'><small>May 7th, 2026</small></div>
                </Article.Header>
                <div className='pt-- px-- flex v row-gap- small'>
                  <ul className='mono'>
                    <li>- Refine text and apply some style</li>
                    <li>- Start creating a few reusable components</li>
                  </ul>
                </div>
              </Article>

              <Article>
                <Article.Header className='flex h primary border-b border-grey items-end'>
                  <h3>++ Initialization</h3>
                  <div className='flex pb pl-- end items-end'><small>May 5th, 2026</small></div>
                </Article.Header>
                <div className='pt-- px-- flex v row-gap- small'>
                  <p>The vision is to showcase the sudoku library. There will be an obligatory sudoku game page, in React and/or HTML Canvas, along with tools for generation and printing. There are many sudoku sites already on the web, but this one will be mine. There's nothing really special about my code, but I still insist on hand-coding my hobby projects (ai is not bad, but using it might take the fun out of the game, ya know?). In the time it took me to type out this paragraph alone, ai probably could have possibly generated a good deal of a sudoku library. It only seems fitting to commit to building out this site to show it in action, starting with this little blank page.</p>
                  <ul className='mono'>
                    <li>- Laid out site vision</li>
                    <li>- Initialized empty site</li>
                  </ul>
                </div>
              </Article>

            </div>
          </Article>
        </main>
      </div>

      <Page.Footer className='w-full pt--- flex wrap center grey'>
      </Page.Footer>
    </Page>
  );
}

export default AboutPage;
