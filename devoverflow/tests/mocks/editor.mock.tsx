const mockEditorMethods = {
  getMarkDown: jest.fn(() => ""),
  setMarkDown: jest.fn(),
  focus: jest.fn(),
};

const MockEditor = jest.fn(({ value, editorRef, fieldChange, ...props }) => {
  if (editorRef) {
    editorRef.current = {
      setMarkdown: jest.fn((markdown: string) => {
        fieldChange(markdown);
      }),
      getMarkdown: jest.fn().mockImplementation(() => value),
    };
  }
  return (
    <textarea id="mdx-editor" data-testid="mdx-editor" onChange={fieldChange} placeholder="MDXEditor Mock" {...props} />
  );
});

export { MockEditor, mockEditorMethods };
