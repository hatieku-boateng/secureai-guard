import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import { findChatGptComposer, installSubmitInterception, readComposerText, snapshotComposer } from "../src/site/chatgpt-adapter";

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

  it("intercepts a labelled send click and provides the current snapshot", () => {
    const dom = new JSDOM('<div contenteditable="true" aria-label="Ask ChatGPT">adapter test</div><button aria-label="Send message">Send</button>');
    const composer = findChatGptComposer(dom.window.document)!;
    const attempts: string[] = [];
    const cleanup = installSubmitInterception(dom.window.document, (snapshot, event) => { attempts.push(snapshot.text); expect(event.defaultPrevented).toBe(false); return true; });
    const event = new dom.window.MouseEvent("click", { bubbles: true, cancelable: true });
    dom.window.document.querySelector("button")!.dispatchEvent(event);
    expect(attempts).toEqual(["adapter test"]);
    expect(event.defaultPrevented).toBe(true);
    expect(composer.textContent).toBe("adapter test");
    cleanup();
  });

  it("intercepts Enter without Shift in the composer, but allows Shift+Enter", () => {
    const dom = new JSDOM('<textarea placeholder="Ask ChatGPT">adapter test</textarea>');
    const attempts: string[] = [];
    const cleanup = installSubmitInterception(dom.window.document, snapshot => { attempts.push(snapshot.text); return true; });
    const enter = new dom.window.KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true });
    dom.window.document.querySelector("textarea")!.dispatchEvent(enter);
    const shiftEnter = new dom.window.KeyboardEvent("keydown", { key: "Enter", shiftKey: true, bubbles: true, cancelable: true });
    dom.window.document.querySelector("textarea")!.dispatchEvent(shiftEnter);
    expect(attempts).toEqual(["adapter test"]);
    expect(enter.defaultPrevented).toBe(true);
    expect(shiftEnter.defaultPrevented).toBe(false);
    cleanup();
  });

  it("does not intercept empty prompts or unsupported buttons", () => {
    const dom = new JSDOM('<textarea placeholder="Ask ChatGPT"></textarea><button aria-label="Attach file">Attach</button>');
    let attempts = 0;
    const cleanup = installSubmitInterception(dom.window.document, () => { attempts += 1; return true; });
    const button = dom.window.document.querySelector("button")!;
    const event = new dom.window.MouseEvent("click", { bubbles: true, cancelable: true });
    button.dispatchEvent(event);
    expect(attempts).toBe(0);
    expect(event.defaultPrevented).toBe(false);
    cleanup();
  });
});
