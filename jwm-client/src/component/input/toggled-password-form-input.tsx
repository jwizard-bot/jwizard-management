import * as React from 'react';
import { useMemo, useState } from 'react';
import { FieldValues, UseControllerProps } from 'react-hook-form';
import { FormTextInput } from '@/component/input/form-text-input';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
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
    | 'type'
  >;
} & Omit<UseControllerProps<T>, 'control'>;

const ToggledPasswordFormInput = <T extends FieldValues>(props: Props<T>): React.ReactElement => {
  const [showPassword, setShowPassword] = useState(false);
  const { fieldProps, ...rest } = props;

  const eyeIcon = useMemo(
    () => (
      <InputAdornment position="end">
        <IconButton
          size="small"
          onClick={() => setShowPassword(prevState => !prevState)}
          onMouseDown={e => e.preventDefault()}
          onMouseUp={e => e.preventDefault()}
          edge="end">
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
    [showPassword]
  );

  return (
    <FormTextInput
      {...rest}
      fieldProps={{
        type: showPassword ? 'text' : 'password',
        slotProps: {
          input: {
            endAdornment: eyeIcon,
          },
        },
        ...fieldProps,
      }}
    />
  );
};

export { ToggledPasswordFormInput };
