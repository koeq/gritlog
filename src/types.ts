export type Mode = AddMode | EditMode | DeleteMode;

interface AddMode {
  readonly type: "add";
  readonly id: number;
}

interface EditMode {
  readonly type: "edit";
  readonly id: number;
  readonly initialInput: string;
}

interface DeleteMode {
  readonly type: "delete";
  readonly id: number;
}
