export interface Exercise {
  readonly exerciseName: string | null;
  readonly weight: string | null;
  readonly repetitions: string | null;
}

export interface Training {
  readonly date: string;
  // TO DO: this shouldn't be optional
  readonly id: number;
  readonly exercises: Exercise[] | undefined;
}

export type Trainings = Training[];

export type Mode = "add" | "edit";
