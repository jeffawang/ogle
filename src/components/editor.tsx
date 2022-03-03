import * as monaco from 'monaco-editor';

type OnChangeHandler = (e: string) => void;

export default class ShaderEditor {
  editor: monaco.editor.IStandaloneCodeEditor;
  on_change_handler: OnChangeHandler;

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
  on_change(e) {
    const value = this.editor.getValue();
    this.on_change_handler(value);
  }
}
