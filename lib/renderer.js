'use strict'

const electron = require('electron');
const ipc = electron.ipcRenderer;
const $ = require('jquery');
const marked = require('marked');
const remote = electron.remote;
const mainProcess = remote.require('./main');
const clipboard = remote.clipboard;
const shell = electron.shell;

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

$markdownView.on('keyup', function() {
  let content = $(this).val();
  renderMarkdownToHtml(content);
});

$openFileButton.on('click', () => {
  mainProcess.openFile();
});

$saveFileButton.on('click', () => {
  let html = $htmlView.html();
  mainProcess.saveFile(html);
});

$copyHtmlButton.on('click', () => {
  let html = $htmlView.html();
  clipboard.writeText(html);

  new Notification('Output Saved', {
    body: 'Your HTML has been saved to the clipboard'
  });
});

$(document).on('click', 'a[href^="http"]', (event) => {
  event.preventDefault;
  shell.openExternal(this.href);
});
