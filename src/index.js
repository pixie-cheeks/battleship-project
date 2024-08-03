import './index.css';

console.log('Check whether everything is working or not.');

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
