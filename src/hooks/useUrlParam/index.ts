import { useRouter } from 'next/router';

import { 
  getParamsWithUpdatedParam, 
  getParamsWithRemovedParam 
} from './helperQueryParams';

export type UpdateParamType = (arg1: string) => void;
export type ClearParamType = () => void;

export interface UseUrlParamReturnProps {
  paramValue: string | null;
  paramCollection: string[] | null;
  updateParam: UpdateParamType;
  clearParam: ClearParamType;
}

export function useUrlParam (paramKey: string): UseUrlParamReturnProps {
  const router = useRouter();
  const currentPath = router.asPath ? `/${router.asPath}` : '';
  console.log('currentPath', currentPath);

  // ??? - this is typed as <string | string[]>, but only seeing the single string
  const paramValue = router.query[paramKey] as string || '';
  const paramCollection = paramValue ? paramValue?.split(',') : [];

  const updateParam = (option: string | string[]): void => {
    const formattedOption = Array.isArray(option) ? option.join(',') : option;
    const newParams = getParamsWithUpdatedParam(router.query, paramKey, formattedOption);
    router.push(`${currentPath}/${newParams}`);
  };

  const clearParam = (): void => {
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
