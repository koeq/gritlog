// This should be expressed in the type of weight and therefore in the database scheme.
// In order to prevent a database migration for now we handle the correct parsing here.
export interface ParsedWeight {
  value: number;
  unit: string;
}

export const parseWeight = (
  weight: string | null | undefined
): ParsedWeight | undefined => {
  if (!weight) {
    return;
  }

  const [value, unit] = weight.split(/(kg|lbs)/);

  if (!value || !unit) {
    return;
  }

  return { value: parseFloat(weight.replace(",", ".")), unit };
};
