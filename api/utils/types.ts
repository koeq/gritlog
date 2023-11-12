export interface Exercise {
  readonly exerciseName: string | null;
  readonly weight: string | null;
  readonly repetitions: string | null;
}

export interface Training {
  readonly date: string;
  readonly endDate: string | undefined;
  readonly id: number;
  readonly headline?: string | null | undefined;
  readonly exercises: Exercise[] | undefined;
}
