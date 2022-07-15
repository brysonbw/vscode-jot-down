import * as _vscode from 'vscode'

/// <reference types="svelte" />

declare global {
    const tsvscode: {
      postMessage: ({ command: string, value: any }) => void;
      getState: () => any;
      setState: (state: any) => void;
    };
    const apiBaseUrl: string;
  }