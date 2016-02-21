'use strict'

const electron = require('electron');
const ipc = electron.ipcRenderer;
const $ = require('jquery');
const marked = require('marked');
const remote = electron.remote;
const mainProcess = remote.require('./main');
const clipboard = remote.clipboard;

const $markdownView = $('.raw-markdown');
const $htmlView = $('.rendered-html');
const $openFileButton = $('#open-file');
const $saveFileButton = $('#save-file');
const $copyHtmlButton = $('#copy-html');

ipc.on('file-opened', (event, content) => {
  $markdownView.text(content);
  renderMarkdownToHtml(content);
});

function renderMarkdownToHtml(markdown) {
  let html = marked(markdown);
  $htmlView.html(html);
}

$markdownView.on('keyup', () => {
  let content = $(this).val();
  renderMarkdownToHtml(content);
});

$openFileButton.on('click', () => {
  mainProcess.openFile();
});

$copyHtmlButton.on('click', () => {
  let html = $htmlView.html();
  clipboard.writeText(html);
});
