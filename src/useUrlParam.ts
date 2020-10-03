import { useRouter } from 'next/router';

import { 
  getParamValues,
  getParamsWithUpdatedParam, 
  getParamsWithRemovedParam 
} from './helperQueryParams';

export type UpdateParamType = (arg1: string) => void;
export type ClearParamType = () => void;

interface UseUrlFilterReturnProps {
  paramValue: string | null;
  paramCollection: string[] | null;
  updateParam: UpdateParamType;
  clearParam: ClearParamType;
}

export function useUrlParam (paramKey: string): UseUrlFilterReturnProps {

  const router = useRouter();
  
  const { paramValue, paramCollection } = getParamValues(router.query[paramKey] || null);

  const updateParam = (option: string | string[]) => {
    const formattedOption = Array.isArray(option) ? option.join(',') : option;
    const newParams = getParamsWithUpdatedParam(router.query, paramKey, formattedOption);
    router.push(`/${newParams}`);
  };

  const clearParam = () => {
    const newParams = getParamsWithRemovedParam(router.query, paramKey);
    router.push(`/${newParams}`);
  };  

  return { 
    paramValue,
    paramCollection,
    updateParam, 
    clearParam 
  };
}
