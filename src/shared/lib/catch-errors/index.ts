import { toast } from 'react-toastify';
import { ERROR_REVERT } from 'shared/config/type';

export const catchError = (error: string, errors: ERROR_REVERT[]) => {
  Object.values(errors).find((value) => {
    const isIncludes = error.includes(value.revert);
    if (isIncludes) {
      return toast.error(value.message);
    }
  });
};
