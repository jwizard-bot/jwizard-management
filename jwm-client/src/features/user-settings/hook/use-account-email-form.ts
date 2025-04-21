import { UseFormReturn } from 'react-hook-form';
import * as Yup from 'yup';
import { useQueryMutationForm } from '@/hook/use-query-mutation-form';
import { useAccountEmailQuery } from '@/redux/api/user-account/slice';
import { AccountEmailResDto, UpdateAccountEmailReqDto } from '@/redux/api/user-account/type';
import { yupResolver } from '@hookform/resolvers/yup';

const formSchema = Yup.object().shape({
  email: Yup.string().nullable().defined().email('Value is not valid email address'),
});

const useAccountEmailForm = (): [UseFormReturn<UpdateAccountEmailReqDto>, boolean] =>
  useQueryMutationForm<UpdateAccountEmailReqDto, AccountEmailResDto>({
    onFetchData: () => {
      const { data } = useAccountEmailQuery();
      return data;
    },
    onSuccessCallback: (form, data) => {
      if (data.email) {
        form.setValue('email', data.email);
      }
    },
    resolver: yupResolver(formSchema),
    defaultValues: { email: null },
  });

export { useAccountEmailForm };
