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

  // the useRouter query type is <string | string[] | null>, which is a bit akward.  
  // if >=1 values expected, the consuming component has to accommodate either a string or an array
  // this flattens that so components can always rely on the ability to iterate on the result 
  // paramValue is then just some syntactic sugar that can be used if expecting just a single prop
  const { paramCollection, paramValue } = getParamValues(router.query[paramKey] || null);

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
