import { useEffect, useState, useContext } from 'react';

import { FilterCategoriesContext, FilterCategoryProps } from "./ParamFilterProvider";
import { useUrlParam, UpdateParamType, ClearParamType } from '../useUrlParam';

type FilterContextYpe = Partial<FilterCategoryProps[]>

export type ParamFilterType = string | null;

interface useParamFilterReturnProps {
  activeFilterId: ParamFilterType;
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

  const [activeFilterId, setActiveFilterId] = useState<ParamFilterType>(null);

  const activeFilterName = filterCategories
    .filter(category => category?.id === activeFilterId)[0]?.name || '';

  useEffect(() => {
    const hasFocusFilter = !!paramValueFromUrl && focusTypes.includes(paramValueFromUrl); 
    setActiveFilterId(hasFocusFilter ? paramValueFromUrl : null);   
  }, [paramValueFromUrl, focusTypes]);

  return { 
    filterCategories,
    activeFilterId,
    activeFilterName, 
    updateFilter, 
    clearFilter
  };
}
