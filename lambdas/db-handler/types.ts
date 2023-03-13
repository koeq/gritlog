export interface Training {
  readonly date: string;
  readonly id: number;
  readonly headline?: string | null | undefined;
  readonly exercises: {
    exerciseName?: string | null | undefined;
    weight?: string | null | undefined;
    repetitions?: string | null | undefined;
  };
}
