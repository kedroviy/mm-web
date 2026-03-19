export type ProgressSpinnerSize = 'sm' | 'md' | 'lg';
export type ProgresSpinnerDiameter = 12 | 24 | 32;

export const SPINNER_SIZE_MAP: Record<ProgressSpinnerSize, ProgresSpinnerDiameter> = {
  sm: 12,
  md: 24,
  lg: 32,
};

export type ProgressSpinnerMode = 'determinate' | 'indeterminate';
