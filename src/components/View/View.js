import React from 'react';
import propTypes from 'prop-types';
import ScrollContainer from '../../containers/ScrollContainer/ScrollContainer';
import './View.css';

const View = ({
  view, viewName, children, aside,
}) => {
  const className = [
    'view',
    viewName,
    view === viewName ? '-is-active' : '',
    aside ? 'view--aside' : '',
  ].join(' ');

  return (
    <ScrollContainer className={className} viewName={viewName} view={view}>
      {children}
    </ScrollContainer>
  );
};

View.defaultProps = {
  aside: false,
};

View.propTypes = {
  // current app view
  view: propTypes.string.isRequired,
  // what to call the current view
  viewName: propTypes.string.isRequired,
  aside: propTypes.bool,
};
export default View;
