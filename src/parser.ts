import React, { useState } from "react";
import { Exercise } from "./types";

// INPUT STRUCTURE  -->  Benchpress 90kg 8/8/8

export const parse = (
  currentInput: string | undefined
): Exercise[] | undefined => {
  if (!currentInput) {
    return;
  }

  const training: Exercise[] = [];
  let exerciseLines: string[] = [];

  if (currentInput.match(/\n/)) {
    exerciseLines = currentInput.split(/\n/);
  } else {
    exerciseLines.push(currentInput);
  }

  exerciseLines.forEach((line) => {
    // match every word or sign from the start of the string until the first occurence of a number and trim whitespace at the end
    const exerciseNameMatch = line.match(
      /^[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/a-z\s]+/i
    );
    const exerciseName = exerciseNameMatch && exerciseNameMatch[0].trim();

    // match one or more numbers optionally seperated by "," or "." and optionally with "kg" or "lbs"
    const weightMatch = line.match(
      /(\d+,?.?\d*\s*kg|\d+,?.?\d*\s*lbs|\d+,?.?\d*)/
    );

    // remove whitespace if format is "_ kg"
    const weight = weightMatch && weightMatch[0].replace(/\s/g, "");

    // match any number or number of numbers seperated by a slash with optionally whitespace at the end
    // TO DO: match whitepace between slashes but not at beginning of the match
    const repetitionsMatch = line.match(/[\d\/]+\s*$/);
    const repetitions = repetitionsMatch && repetitionsMatch[0].trim();

    training.push({ exerciseName, weight, repetitions });
  });

  return training;
};
