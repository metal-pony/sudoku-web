import React from 'react';
import classNames from 'classnames';

/**
 * A terminal Header child element. It should contain no children.
 * Text and subtext are included via props.
 * @param {object} props
 * @param {string} props.className
 * @param {string} props.text
 * @param {string} props.subText
 * @param {string} props.href
 */
function Header({
  className,
  text = 'Page Header',
  subText,
  href
}) {
  const h1 = href ? (
    <h1><a className='header-link' href={href}>{ text }</a></h1>
  ) : (<h1>{ text }</h1>);

  const content = subText ? (
    <hgroup>
      { h1 }
      <p className='header-subtext'>{ subText }</p>
    </hgroup>
  ) : h1;

  return (
    <header className={classNames('page-header', className)}>
      { content }
    </header>
  );
}

/**
 *
 * @param {object} props
 * @param {string} props.className
 * @param {} props.children
 */
function Nav({
  className,
  children
}) {
  return (
    <nav className={classNames('page-nav', className)}>
      { children }
    </nav>
  );
}

/**
 *
 * @param {object} props
 * @param {string[]} props.className
 * @param {} props.children
 */
function Footer({ className, children }) {
  return (
    <footer className={classNames('page-footer', className)}>
      { children }
    </footer>
  );
}

/**
 *
 * @param {object} props
 * @param {string[]} props.className
 * @param {} props.children
 */
export function Page({ className, children }) {
  return (
    <div className={classNames('page', className)}>
      { children }
    </div>
  );
}

Page.Header = Header;
Page.Nav = Nav;
Page.Footer = Footer;

export default Page;
