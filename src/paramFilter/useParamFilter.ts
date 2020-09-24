import { useEffect, useState, useContext } from 'react';

import { FilterCategoriesContext, FilterCategoryProps } from "./ParamFilterProvider";
import { useUrlParam, UpdateParamType, ClearParamType } from '../useUrlParam';

type FilterContextYpe = Partial<FilterCategoryProps[]>

export type ParamFilterType = string | null;

interface useParamFilterReturnProps {
  activeFilterType: ParamFilterType;
  activeFilterName: string;
  filterCategories: FilterContextYpe;
  updateFilter: UpdateParamType;
  clearFilter: ClearParamType;
}

export function useParamFilter (paramName:string): useParamFilterReturnProps {

  const { 
    paramValueFromUrl, 
    updateParam: updateFilter, 
    clearParam: clearFilter, 
  } = useUrlParam(paramName);
  
  const filterCategories = useContext(FilterCategoriesContext) || [];

  const focusTypes = filterCategories.map(category => category?.id);

  const [activeFilterType, setActiveFilterType] = useState<ParamFilterType>(null);

  const activeFilterName = filterCategories
    .filter(category => category?.id === activeFilterType)[0]?.name || '';

  useEffect(() => {
    const hasFocusFilter = !!paramValueFromUrl && focusTypes.includes(paramValueFromUrl); 
    setActiveFilterType(hasFocusFilter ? paramValueFromUrl : null);   
  }, [paramValueFromUrl, focusTypes]);

  return { 
    filterCategories,
    activeFilterType,
    activeFilterName, 
    updateFilter, 
    clearFilter
  };
}
