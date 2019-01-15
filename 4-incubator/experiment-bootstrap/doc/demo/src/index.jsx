import React from 'react';
import ReactDOM from 'react-dom';

// TODO
//import { attachDevToolsUI } from '../../../src';

import Root from './components/root';

function start() {
  console.log('starting…');

  //attachDevToolsUI();

  // $FlowFixMe
  ReactDOM.render(<Root />, document.getElementById('root'));
}

start();

export { start };
