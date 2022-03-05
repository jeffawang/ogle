import * as monaco from 'monaco-editor';
import Parser from "web-tree-sitter";
import { Theme, Language, MonacoTreeSitter, ThemeConfig } from "monaco-tree-sitter";

import OgleTheme from './theme.json';
import C from 'monaco-tree-sitter/grammars/c.json';

type OnChangeHandler = (e: string) => void;

export default class ShaderEditor {
  editor: monaco.editor.IStandaloneCodeEditor;
  on_change_handler: OnChangeHandler;
  monacoTreeSitter: MonacoTreeSitter;

  constructor(el: HTMLElement, fragment: string, on_change_handler: OnChangeHandler) {
    this.editor = monaco.editor.create(el, {
      value: fragment,
      language: 'glsl',
      minimap: { enabled: false },
      theme: 'vs'
    });
    this.on_change_handler = on_change_handler;
    this.editor.getModel().onDidChangeContent(this.on_change.bind(this));
    window.addEventListener("resize", (_) => (this.editor.layout()));
  }

  async colorize() {
    Theme.load(OgleTheme as ThemeConfig);
    await Parser.init();
    const language = new Language(C);
    await language.init('tree-sitter-glsl.wasm', Parser);
    this.monacoTreeSitter = new MonacoTreeSitter(monaco, this.editor, language);
  }

  on_change(e) {
    const value = this.editor.getValue();
    this.on_change_handler(value);
  }
}
