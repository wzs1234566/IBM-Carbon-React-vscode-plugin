import * as vscode from 'vscode';
const React = require('react');
const ReactDOMServer = require('react-dom/server');
import * as cir from '@carbon/icons-react';
const icons: any = cir as any;

export function iconWebView(args: any) {
    const panel = vscode.window.createWebviewPanel(
        'CarbonIconPreview',
        'Carbon Icon Preview',
        vscode.ViewColumn.Beside
    );

    panel.webview.html = getWebviewContent(args['name']);
}

function getWebviewContent(component: string) {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>${component}</title>
  </head>
  <body >
  <h1>${component}</h1>
  <div style='background-color:white;'> ${ReactDOMServer.renderToString(React.createElement(icons[component]))} </div>
  </body>
  </html>`;
}