import React from 'react';

import './Spinner.css';

const spinner = (props) => (
  <div className="spinner" role="status" aria-label="Loading">
    <div className="lds-dual-ring" />
    {props.text && <div className="spinner-text">{props.text}</div>}
  </div>
);

export default spinner;
