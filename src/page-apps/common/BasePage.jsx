import React from 'react';
import Page from '../../components/page/Page';

export function BasePage({ children }) {
  return (
    <Page className='center'>
      <Page.Nav className='flex h w-full h-32px pt-- mono bold'>
        <div className='flex h col-gap--- pl---- left'>
          <a className='grey hover-light active-secondary' href='./'>Home</a>
          <a className='grey hover-light active-secondary' href='./about.html'>About</a>
        </div>
      </Page.Nav>

      <Page.Header
        text='Sudoku.JS'
        className='w-full mono gold text-center no-select'
      />

      <div className='w-8 pt----- page-max-width'>
        <main>
          { children }
        </main>
      </div>

      <Page.Footer className='w-full pt--- flex wrap center grey'></Page.Footer>
    </Page>
  );
}

export default BasePage;
