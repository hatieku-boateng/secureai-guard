import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import { findChatGptComposer, findChatGptSendButton, installSubmitInterception, isCurrentSnapshot, readComposerText, snapshotComposer } from "../src/site/chatgpt-adapter";

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
    cleanup.setEnabled(true);
    const event = new dom.window.MouseEvent("click", { bubbles: true, cancelable: true });
    dom.window.document.querySelector("button")!.dispatchEvent(event);
    expect(attempts).toEqual(["adapter test"]);
    expect(event.defaultPrevented).toBe(true);
    expect(composer.textContent).toBe("adapter test");
    cleanup.cleanup();
  });

  it("intercepts ChatGPT's current composer-submit-button", () => {
    const dom = new JSDOM('<textarea id="prompt-textarea" placeholder="Ask ChatGPT">0249663991</textarea><button id="composer-submit-button" aria-label="Send prompt"></button>');
    const attempts: string[] = [];
    const controller = installSubmitInterception(dom.window.document, snapshot => { attempts.push(snapshot.text); return true; });
    controller.setEnabled(true);
    const button = dom.window.document.querySelector<HTMLButtonElement>("#composer-submit-button")!;
    const event = new dom.window.MouseEvent("click", { bubbles: true, cancelable: true });
    button.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(attempts).toEqual(["0249663991"]);
    expect(findChatGptSendButton(dom.window.document)).toBe(button);
    controller.cleanup();
  });

  it("intercepts Enter without Shift in the composer, but allows Shift+Enter", () => {
    const dom = new JSDOM('<textarea placeholder="Ask ChatGPT">adapter test</textarea>');
    const attempts: string[] = [];
    const cleanup = installSubmitInterception(dom.window.document, snapshot => { attempts.push(snapshot.text); return true; });
    cleanup.setEnabled(true);
    const enter = new dom.window.KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true });
    dom.window.document.querySelector("textarea")!.dispatchEvent(enter);
    const shiftEnter = new dom.window.KeyboardEvent("keydown", { key: "Enter", shiftKey: true, bubbles: true, cancelable: true });
    dom.window.document.querySelector("textarea")!.dispatchEvent(shiftEnter);
    expect(attempts).toEqual(["adapter test"]);
    expect(enter.defaultPrevented).toBe(true);
    expect(shiftEnter.defaultPrevented).toBe(false);
    cleanup.cleanup();
  });

  it("intercepts Enter from a nested editor node and labelled role buttons", () => {
    const dom = new JSDOM('<div contenteditable="true" aria-label="Ask ChatGPT"><p>adapter test</p></div><div role="button" aria-label="Send message">arrow</div>');
    const attempts: string[] = [];
    const controller = installSubmitInterception(dom.window.document, snapshot => { attempts.push(snapshot.text); return true; });
    controller.setEnabled(true);
    const enter = new dom.window.KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true });
    dom.window.document.querySelector("p")!.dispatchEvent(enter);
    expect(enter.defaultPrevented).toBe(true);
    const click = new dom.window.MouseEvent("click", { bubbles: true, cancelable: true });
    findChatGptSendButton(dom.window.document)!.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);
    expect(attempts).toEqual(["adapter test", "adapter test"]);
    controller.cleanup();
  });

  it("intercepts a form submit containing the composer", () => {
    const dom = new JSDOM('<form><div contenteditable="true" aria-label="Ask ChatGPT">adapter test</div><button type="submit">arrow</button></form>');
    const attempts: string[] = [];
    const controller = installSubmitInterception(dom.window.document, snapshot => { attempts.push(snapshot.text); return true; });
    controller.setEnabled(true);
    const event = new dom.window.Event("submit", { bubbles: true, cancelable: true });
    dom.window.document.querySelector("form")!.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(attempts).toEqual(["adapter test"]);
    controller.cleanup();
  });

  it("uses the right-edge composer geometry when the send arrow has no label", () => {
    const dom = new JSDOM('<div contenteditable="true" aria-label="Ask ChatGPT">adapter test</div><div class="send-icon">arrow</div>');
    const composer = findChatGptComposer(dom.window.document)!;
    Object.defineProperty(composer, "getBoundingClientRect", { value: () => ({ left: 100, right: 500, top: 400, bottom: 460, width: 400, height: 60 }) });
    const attempts: string[] = [];
    const controller = installSubmitInterception(dom.window.document, snapshot => { attempts.push(snapshot.text); return true; });
    controller.setEnabled(true);
    const event = new dom.window.MouseEvent("click", { bubbles: true, cancelable: true, clientX: 480, clientY: 430 });
    dom.window.document.querySelector(".send-icon")!.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(attempts).toEqual(["adapter test"]);
    controller.cleanup();
  });

  it("does not intercept empty prompts or unsupported buttons", () => {
    const dom = new JSDOM('<textarea placeholder="Ask ChatGPT"></textarea><button aria-label="Attach file">Attach</button>');
    let attempts = 0;
    const cleanup = installSubmitInterception(dom.window.document, () => { attempts += 1; return true; });
    cleanup.setEnabled(true);
    const button = dom.window.document.querySelector("button")!;
    const event = new dom.window.MouseEvent("click", { bubbles: true, cancelable: true });
    button.dispatchEvent(event);
    expect(attempts).toBe(0);
    expect(event.defaultPrevented).toBe(false);
    cleanup.cleanup();
  });

  it("allows one deliberate matching resend, then clears the bypass", () => {
    const dom = new JSDOM('<div contenteditable="true" aria-label="Ask ChatGPT">adapter test</div><button aria-label="Send message">Send</button>');
    const snapshots = [] as string[];
    const controller = installSubmitInterception(dom.window.document, snapshot => { snapshots.push(snapshot.text); return true; });
    controller.setEnabled(true);
    const snapshot = snapshotComposer(dom.window.document)!;
    controller.allowNextSubmit(snapshot);
    const first = new dom.window.MouseEvent("click", { bubbles: true, cancelable: true });
    findChatGptSendButton(dom.window.document)!.dispatchEvent(first);
    expect(first.defaultPrevented).toBe(false);
    const second = new dom.window.MouseEvent("click", { bubbles: true, cancelable: true });
    findChatGptSendButton(dom.window.document)!.dispatchEvent(second);
    expect(second.defaultPrevented).toBe(true);
    expect(snapshots).toEqual(["adapter test"]);
    controller.cleanup();
  });

  it("does not bypass a changed snapshot", () => {
    const dom = new JSDOM('<textarea placeholder="Ask ChatGPT">original</textarea><button aria-label="Send message">Send</button>');
    const controller = installSubmitInterception(dom.window.document, () => true);
    controller.setEnabled(true);
    controller.allowNextSubmit(snapshotComposer(dom.window.document)!);
    dom.window.document.querySelector("textarea")!.value = "changed";
    const event = new dom.window.MouseEvent("click", { bubbles: true, cancelable: true });
    findChatGptSendButton(dom.window.document)!.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    controller.cleanup();
  });

  it("starts disabled and changes only in memory", () => {
    const dom = new JSDOM('<textarea placeholder="Ask ChatGPT">adapter test</textarea><button aria-label="Send message">Send</button>');
    const attempts: string[] = [];
    const controller = installSubmitInterception(dom.window.document, snapshot => { attempts.push(snapshot.text); return true; });
    expect(controller.isEnabled()).toBe(false);
    const offEvent = new dom.window.MouseEvent("click", { bubbles: true, cancelable: true });
    findChatGptSendButton(dom.window.document)!.dispatchEvent(offEvent);
    expect(offEvent.defaultPrevented).toBe(false);
    controller.setEnabled(true);
    expect(controller.isEnabled()).toBe(true);
    const onEvent = new dom.window.MouseEvent("click", { bubbles: true, cancelable: true });
    findChatGptSendButton(dom.window.document)!.dispatchEvent(onEvent);
    expect(onEvent.defaultPrevented).toBe(true);
    expect(attempts).toEqual(["adapter test"]);
    controller.cleanup();
  });

  it("detects a changed or detached composer snapshot", () => {
    const dom = new JSDOM('<textarea placeholder="Ask ChatGPT">original</textarea>');
    const snapshot = snapshotComposer(dom.window.document)!;
    expect(isCurrentSnapshot(snapshot)).toBe(true);
    snapshot.element.value = "changed";
    expect(isCurrentSnapshot(snapshot)).toBe(false);
    snapshot.element.remove();
    expect(isCurrentSnapshot(snapshot)).toBe(false);
  });
});
