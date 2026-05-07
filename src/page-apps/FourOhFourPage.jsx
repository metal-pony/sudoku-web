import React from 'react';
import Page from '../components/page/Page';
import Article from '../components/Article';

export function FourOhFourPage({}) {
  return (
    <Page className='center'>
      <Page.Header
        text='Sudoku.JS' href='/'
        className='w-full pt---- pb- mono gold text-center'
      />

      <div className='w-8 pt--- page-max-width'>
        <main className='flex v row-gap---'>
          <Article>
            <Article.Header className='evil border-b border-grey'>
              <h2>Oh bother.</h2>
            </Article.Header>
            <div className='pt---- px-- flex v row-gap---- end'>
              <p><i class="fa-regular fa-file-code fa-2xl"></i>&nbsp;This page doesn't exist.</p>
              <p><a href='/'>&lt; Go Back</a></p>
            </div>
          </Article>
        </main>
      </div>

      <Page.Footer className='w-full pt--- flex wrap center grey'></Page.Footer>
    </Page>
  );
}

export default FourOhFourPage;
