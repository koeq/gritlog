export interface Mode {
  readonly type: "add" | "edit" | "delete";
  readonly id: number | null;
}
