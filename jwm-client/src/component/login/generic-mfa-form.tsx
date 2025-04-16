import * as React from 'react';
import { useEffect } from 'react';
import { FieldValues, Path, SubmitHandler, useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { AuthCardWrapper } from '@/component/auth-card-wrapper';
import { ToggledPasswordFormInput } from '@/component/input/toggled-password-form-input';
import { useCancelMfaMutation } from '@/redux/api/auth/slice';
import { setMfaRecoveryMode } from '@/redux/store/main-slice';
import { Box, Button, Link } from '@mui/material';

type Props<T> = {
  caption: string;
  label: string;
  controlName: Path<T>;
  isError: boolean;
  linkContent: string;
  submitContent: string;
  mfaRecoveryMode: boolean;
  onSubmitCallback: SubmitHandler<T>;
};

const GenericMfaForm = <T extends FieldValues>({
  caption,
  label,
  controlName,
  isError,
  linkContent,
  submitContent,
  mfaRecoveryMode,
  onSubmitCallback,
}: Props<T>): React.ReactElement => {
  const {
    handleSubmit,
    resetField,
    formState: { isSubmitting },
  } = useFormContext<T>();
  const dispatch = useDispatch();
  const [cancelMfa] = useCancelMfaMutation();

  const onCancel = async (): Promise<void> => {
    await cancelMfa();
  };

  useEffect(() => {
    if (isError) {
      resetField(controlName);
    }
  }, [isError]);

  return (
    <AuthCardWrapper caption={caption}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmitCallback)}
        gap={2}
        display="flex"
        flexDirection="column">
        <ToggledPasswordFormInput
          label={label}
          name={controlName}
          fieldProps={{
            variant: 'outlined',
          }}
        />
        <Button variant="contained" fullWidth type="submit" loading={isSubmitting}>
          {submitContent}
        </Button>
        <Button variant="outlined" fullWidth onClick={onCancel}>
          Cancel
        </Button>
        <Link
          component="button"
          variant="body2"
          onClick={() => {
            dispatch(setMfaRecoveryMode(mfaRecoveryMode));
          }}>
          {linkContent}
        </Link>
      </Box>
    </AuthCardWrapper>
  );
};

export { GenericMfaForm };
