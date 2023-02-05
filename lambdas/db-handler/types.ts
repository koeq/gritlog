// TODO: check if the types here make sense
export interface Exercise {
  readonly exerciseName: string | null;
  readonly weight: string | null;
  readonly repetitions: string | null;
}

export interface Training {
  readonly date: string;
  readonly id: number;
  readonly headline: string | null;
  readonly exercises: Exercise[];
}
