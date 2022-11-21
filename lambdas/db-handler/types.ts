// TODO: check if the types here make sense
export interface Exercise {
  readonly exerciseName: string | null;
  readonly weight: string | null;
  readonly repetitions: string | null;
}

export type Headline = string | null;

export interface Training {
  readonly date: string;
  readonly id: number;
  readonly headline: Headline;
  readonly exercises: Exercise[] | undefined;
}
