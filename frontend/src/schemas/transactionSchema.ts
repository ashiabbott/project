import * as yup from 'yup';

export const transactionSchema = yup.object().shape({
  description: yup.string().required('Description is required'),
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .positive('Amount must be positive')
    .required('Amount is required'),
  type: yup
    .string()
    .oneOf(['income', 'expense'], 'Type must be either income or expense')
    .required('Type is required'),
  date: yup
    .date()
    .typeError('Date must be a valid date')
    .required('Date is required'),
});
