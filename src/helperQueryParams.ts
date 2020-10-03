import { LooseObject } from "./types";

interface GetParamValuesProps {
  paramValue: string | null;
  paramCollection: string[] | null;
}

type RawParamValueType = string | string[] | null;

export function getParamValues (
  rawParamValue: RawParamValueType): GetParamValuesProps {
  
  const paramIsString = rawParamValue && typeof(rawParamValue) === 'string';
  const paramString = paramIsString ? rawParamValue as string : null;
  const paramIsCollection = rawParamValue && Array.isArray(rawParamValue);
  const paramCollection = paramIsCollection ? rawParamValue as string[]: null;
  const paramCollectionString = paramCollection ? paramCollection.join(',') : null;
  const paramValue = paramString || paramCollectionString || null; 
  return { paramValue, paramCollection };
}

export function getParamsWithRemovedParam (
  params: LooseObject, 
  key: string): string {
  
  const newParams = Object.keys(params)
    .filter((param) => param !== key)
    .map((param) => `${param}=${params[param]}`)
    .join('&');

  return !!newParams ? `?${newParams}` : '';
}

export function getParamsWithUpdatedParam (
  params: LooseObject, 
  key: string, 
  newValue: string): string {
  
  const updatedParams: LooseObject = { ...params, [key]: newValue };
  
  return '?' + Object.keys(updatedParams)
    .map((param) => `${param}=${updatedParams[param]}`)
    .join('&');
}
