export type FieldType = 'text' | 'email' | 'number' | 'textarea';

export interface FormField {
  id: string;              
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
}
