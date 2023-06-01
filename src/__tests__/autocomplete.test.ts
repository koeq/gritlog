/**
 * @jest-environment jsdom
 */
import { autocomplete } from "../utils/autocomplete";

describe("Autocomplete the input on the current line:", () => {
  let textArea: HTMLTextAreaElement;

  // Set up
  beforeEach(() => {
    document.body.innerHTML = '<textarea id="textArea"></textarea>';
    textArea = document.getElementById("textArea") as HTMLTextAreaElement;
  });

  const setupTextAreaAndCursor = (content: string, cursorPos: number) => {
    textArea.value = content;
    textArea.selectionStart = cursorPos;
    textArea.selectionEnd = cursorPos;
  };

  test("Should return current input if textArea is null", () => {
    const currentInput = "some input";
    const suggestion = "suggestion";
    expect(autocomplete(currentInput, suggestion, null)).toBe(currentInput);
  });

  test("Should return current input if no matching exercise found in current line", () => {
    setupTextAreaAndCursor("@80 8/8/8", 8);
    const currentInput = textArea.value;
    const suggestion = "suggestion";
    expect(autocomplete(currentInput, suggestion, textArea)).toBe(currentInput);
  });

  test("Should return current input if current line is empty", () => {
    setupTextAreaAndCursor("\n", 1);
    const currentInput = textArea.value;
    const suggestion = "suggestion";
    expect(autocomplete(currentInput, suggestion, textArea)).toBe(currentInput);
  });

  test("Should ignore headline", () => {
    setupTextAreaAndCursor("# headline", 4);
    const currentInput = textArea.value;
    const suggestion = "suggestion";
    expect(autocomplete(currentInput, suggestion, textArea)).toBe(currentInput);
  });

  test("Should autocomplete the current exercise with 'Pull Ups'", () => {
    setupTextAreaAndCursor("Pu", 2);
    const currentInput = textArea.value;
    const suggestion = "Pull Ups";
    const expected = "Pull Ups ";
    expect(autocomplete(currentInput, suggestion, textArea)).toBe(expected);
  });

  test("Should autocomplete until one whitespace after the exercise", () => {
    setupTextAreaAndCursor("Pull ", 5);
    const currentInput = textArea.value;
    const suggestion = "Pull Ups";
    const expected = "Pull Ups ";
    expect(autocomplete(currentInput, suggestion, textArea)).toBe(expected);
  });

  test("Should autocomplete the current exercise with suggestion in multiline input", () => {
    setupTextAreaAndCursor("Squats\nPush\nPull Ups", 11);
    const currentInput = textArea.value;
    const suggestion = "Push Ups";
    const expected = "Squats\nPush Ups \nPull Ups";
    expect(autocomplete(currentInput, suggestion, textArea)).toBe(expected);
  });
});
