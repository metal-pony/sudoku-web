import React from 'react';
import classNames from 'classnames';

/**
 *
 * @param {object} props
 * @param {string} props.className
 * @param {JSX.Element} props.children
 * @returns
 */
function Header({ className, children }) {
  return (
    <header className={classNames('article-header', className)}>
      { children }
    </header>
  );
}

/**
 *
 * @param {object} props
 * @param {string} props.className
 * @param {JSX.Element} props.children
 * @returns
 */
export function Article({ className, children }) {
  return (
    <article className={classNames('article', className)}>
      { children }
    </article>
  );
}

Article.Header = Header;

export default Article;
