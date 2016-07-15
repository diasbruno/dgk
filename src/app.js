import React from 'react';
import ReactDOM from 'react-dom';
import { compile } from 'libdgk/parser';

if (module.hot) {
  module.hot.accept();
}

console.log(compile('y'));
console.log(compile('\'y\''));
console.log(compile('123'));
console.log(compile('123.234'));

ReactDOM.render(
  <div></div>,
  document.getElementById('main')
);
