import React from "react";

interface Parsed {
  exercise: string | null;
  weight: string | null;
  repetitions: string | null;
}

export const parser = (text: string): Parsed => {
  //  match every word or sign from the start of the string until the first occurence of a number and trim whitespace at the end
  const exerciseMatch = text.match(
    /^[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/a-z\s]+/i
  );
  const exercise = exerciseMatch && exerciseMatch[0].trim();

  // match one or more numbers optionally with "kg" or "lbs"
  const weightMatch = text.match(/(\d+\s*kg|\d+\s*lbs|\d+)/);
  const weight = weightMatch && weightMatch[0];

  // match any number or number of numbers seperated by a slash with optionally whitespace at the end
  // TO DO: match whitepace between slashes but not at beginning of the match
  const repetitionsMatch = text.match(/[\d\/]+\s*$/);
  const repetitions = repetitionsMatch && repetitionsMatch[0].trim();

  console.log(
    `exercise: ${exercise}  weight:${weight} repetitions: ${repetitions}`
  );

  return {
    exercise,
    weight,
    repetitions,
  };
};
