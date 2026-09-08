import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import { findChatGptComposer, readComposerText, snapshotComposer } from "../src/site/chatgpt-adapter";

describe("ChatGPT composer adapter", () => {
  it("finds the preferred Lexical contenteditable", () => {
    const dom = new JSDOM('<main><div contenteditable="true" data-lexical-editor="true">Hello</div><textarea placeholder="Ask ChatGPT"></textarea></main>');
    expect(findChatGptComposer(dom.window.document)?.getAttribute("data-lexical-editor")).toBe("true");
  });
  it("supports textarea and contenteditable fallbacks", () => {
    const textareaDom = new JSDOM('<textarea placeholder="Ask ChatGPT">A prompt</textarea>');
    expect(readComposerText(findChatGptComposer(textareaDom.window.document)!)).toBe("A prompt");
    const editableDom = new JSDOM('<div contenteditable="true">Editable prompt</div>');
    expect(readComposerText(findChatGptComposer(editableDom.window.document)!)).toBe("Editable prompt");
  });
  it("returns an exact snapshot without changing the element", () => {
    const dom = new JSDOM('<div contenteditable="true" aria-label="Ask ChatGPT">Ama &amp; Kojo</div>');
    const composer = findChatGptComposer(dom.window.document)!;
    const before = composer.outerHTML;
    const snapshot = snapshotComposer(dom.window.document)!;
    expect(snapshot.element).toBe(composer);
    expect(snapshot.text).toBe("Ama & Kojo");
    expect(composer.outerHTML).toBe(before);
  });
  it("returns null without a supported composer", () => {
    expect(snapshotComposer(new JSDOM("<main><p>Loading</p></main>").window.document)).toBeNull();
  });
  it("does not select the SecureAI indicator", () => {
    const dom = new JSDOM('<div id="secureai-guard-indicator"><div contenteditable="true">fake</div></div><textarea placeholder="Ask ChatGPT"></textarea>');
    expect(findChatGptComposer(dom.window.document)?.tagName).toBe("TEXTAREA");
  });
});
