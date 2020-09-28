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
  
  const paramType = typeof(paramValue);

  const paramValueFromUrl = paramType === 'string' ? paramValue as string : '';

  // ??? - even though paramValue could be string[], can't use isArray here? :/ 
  const paramCollectionFromUrl = paramType !== 'string' ? paramValue as [] : [];

  const updateParam = (option: string | string[]) => {
    const formattedOption = typeof(option) !== 'string' ? option.join(',') : option;
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
