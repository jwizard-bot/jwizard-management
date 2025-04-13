import * as React from 'react';
import { FieldValues, UseControllerProps, useController, useFormContext } from 'react-hook-form';
import { TextField } from '@mui/material';
import { TextFieldProps } from '@mui/material/TextField';

type Props<T extends FieldValues> = {
  label: string;
  fieldProps?: Omit<
    TextFieldProps,
    | 'label'
    | 'error'
    | 'helperText'
    | 'onBlur'
    | 'onChange'
    | 'value'
    | 'name'
    | 'inputRef'
    | 'defaultValue'
  >;
} & Omit<UseControllerProps<T>, 'control'>;

const FormTextInput = <T extends FieldValues>({
  label,
  fieldProps = {},
  name,
  rules,
}: Props<T>): React.ReactElement => {
  const { control } = useFormContext<T>();
  const {
    field,
    fieldState: { error },
  } = useController({ name, control, rules });

  return (
    <TextField
      size="small"
      label={label}
      error={!!error}
      helperText={error?.message}
      onChange={field.onChange}
      onBlur={field.onBlur}
      value={field.value || ''}
      name={field.name}
      inputRef={field.ref}
      {...fieldProps}
    />
  );
};

export { FormTextInput };
