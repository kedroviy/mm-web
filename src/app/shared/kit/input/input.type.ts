import { FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export interface KitInputProps {
  formControl?: FormControl;
  label?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  errorStateMatcher?: ErrorStateMatcher;
  appearance?: 'outline' | 'fill' | 'standard';
  value?: string;
}
