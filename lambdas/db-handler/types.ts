export interface Exercise {
  readonly exerciseName: string | null;
  readonly weight: string | null;
  readonly repetitions: string | null;
}

export interface Training {
  readonly date: string;
  readonly id: number;
  readonly exercises: Exercise[] | undefined;
}
