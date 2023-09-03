/**
 * @jest-environment jsdom
 */
import { autocomplete } from "../utils/autocomplete";

describe("Autocomplete the input on the current line:", () => {
  let textArea: HTMLTextAreaElement;
  let serializedExercises: string;

  beforeEach(() => {
    document.body.innerHTML = '<textarea id="textArea"></textarea>';
    textArea = document.getElementById("textArea") as HTMLTextAreaElement;
    serializedExercises = textArea.value;
  });

  const setupTextAreaAndCursor = (content: string, cursorPos: number) => {
    textArea.value = content;
    textArea.selectionStart = cursorPos;
    textArea.selectionEnd = cursorPos;
  };

  test("Should return current input if no matching exercise found in current line", () => {
    setupTextAreaAndCursor("@80 8/8/8", 8);

    const suggestion = "suggestion";
    expect(autocomplete(serializedExercises, suggestion, textArea)).toBe(
      serializedExercises
    );
  });

  test("Should return current input if current line is empty", () => {
    setupTextAreaAndCursor("\n", 1);

    const suggestion = "suggestion";
    expect(autocomplete(serializedExercises, suggestion, textArea)).toBe(
      serializedExercises
    );
  });

  test("Should autocomplete the current exercise with 'Pull Ups'", () => {
    setupTextAreaAndCursor("Pu", 2);

    const suggestion = "Pull Ups";
    const expected = "Pull Ups ";
    expect(autocomplete(serializedExercises, suggestion, textArea)).toBe(
      expected
    );
  });

  test("Should autocomplete until one whitespace after the exercise", () => {
    setupTextAreaAndCursor("Pull ", 5);

    const suggestion = "Pull Ups";
    const expected = "Pull Ups ";
    expect(autocomplete(serializedExercises, suggestion, textArea)).toBe(
      expected
    );
  });

  test("Should autocomplete the current exercise with suggestion in multiline input", () => {
    setupTextAreaAndCursor("Squats\nPush\nPull Ups", 11);
    const suggestion = "Push Ups";
    const expected = "Squats\nPush Ups \nPull Ups";
    expect(autocomplete(serializedExercises, suggestion, textArea)).toBe(
      expected
    );
  });
});
