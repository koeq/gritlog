import React, { useState } from "react";
import { Training } from "./app";

// input structure  --->  Benchpress 90kg 8/8/8

// TO DO: make multi-line trainings work

export const parse = (
  currentTrainingInput: string | undefined
): Training | undefined => {
  if (!currentTrainingInput) {
    return;
  }

  //  match every word or sign from the start of the string until the first occurence of a number and trim whitespace at the end
  const exerciseMatch = currentTrainingInput.match(
    /^[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/a-z\s]+/i
  );
  const exercise = exerciseMatch && exerciseMatch[0].trim();

  // match one or more numbers optionally with "kg" or "lbs"
  // TO DO: allow "," and "." to make inputs like "12,5kg" valid
  const weightMatch = currentTrainingInput.match(/(\d+\s*kg|\d+\s*lbs|\d+)/);
  const weight = weightMatch && weightMatch[0];

  // match any number or number of numbers seperated by a slash with optionally whitespace at the end
  // TO DO: match whitepace between slashes but not at beginning of the match
  const repetitionsMatch = currentTrainingInput.match(/[\d\/]+\s*$/);
  const repetitions = repetitionsMatch && repetitionsMatch[0].trim();

  // DEBUG regular expressions
  // console.log(
  //   `exercise: ${exercise}  weight:${weight} repetitions: ${repetitions}`
  // );

  return {
    exercise,
    weight,
    repetitions,
  };
};
