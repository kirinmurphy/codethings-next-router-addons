import { LooseObject } from "../types";

interface GetParamValuesProps {
  paramValue: string | null;
  paramCollection: string[] | null;
}

type RawParamValueType = string | string[] | null;

export function getParamValues (rawParamValue: RawParamValueType): GetParamValuesProps {
  const paramCollection = arrayifyParams(rawParamValue);
  const paramValue = paramCollection.join(',');
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
  return !!newValue 
    ? getParamsWithAddedParam(params, key, newValue)
    : getParamsWithRemovedParam(params, key); 
}


// Helpers
function arrayifyParams (
  rawParamValue: RawParamValueType): string[] {
  
  const paramIsCollection = rawParamValue && Array.isArray(rawParamValue);
  const paramIsString = rawParamValue && !paramIsCollection;
  const arrayifiedParamString = paramIsString ? [rawParamValue] : [];
  return paramIsCollection ? rawParamValue as string[] : arrayifiedParamString as string[];
}

function getParamsWithAddedParam(
  params: LooseObject, 
  key: string, 
  newValue: string): string {

  const updatedParams: LooseObject = { ...params, [key]: newValue };
  
  return '?' + Object.keys(updatedParams)
    .map((param) => `${param}=${updatedParams[param]}`)
    .join('&');
}
