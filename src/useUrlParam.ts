import { useRouter } from 'next/router';

import { 
  getParamsWithUpdatedParam, 
  getParamsWithRemovedParam 
} from './helperQueryParams';

export type UpdateParamType = (arg1: string | string[]) => void;
export type ClearParamType = () => void;

interface UseUrlFilterReturnProps {
  paramValueFromUrl: string;
  paramCollectionFromUrl: string[];
  updateParam: UpdateParamType;
  clearParam: ClearParamType;
}

export function useUrlParam (paramKey: string): UseUrlFilterReturnProps {

  const router = useRouter();
  
  const paramValue = router.query[paramKey];
  
  const paramValueFromUrl = typeof(paramValue) === 'string' ? paramValue as string : '';

  const paramCollectionFromUrl = Array.isArray(paramValue) ? paramValue as [] : [];

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
    paramValueFromUrl, 
    paramCollectionFromUrl, 
    updateParam, 
    clearParam 
  };
}
