import { useEffect, useState, useContext } from 'react';

import { FilterCategoriesContext, FilterCategoryProps } from "./UrlParamCategoryFilterProvider";
import { useUrlParam, UpdateParamType, ClearParamType } from '../useUrlParam';

type FilterContextYpe = Partial<FilterCategoryProps[]>

export type ParamFilterType = string | null;

interface useUrlParamCategoryFilterReturnProps {
  activeFilterId: ParamFilterType;
  activeFilterName: string;
  filterCategories: FilterContextYpe;
  updateFilter: UpdateParamType;
  clearFilter: ClearParamType;
}

export function useUrlParamCategoryFilter (paramName:string): useUrlParamCategoryFilterReturnProps {

  const { 
    paramValue: filterValue, 
    updateParam: updateFilter, 
    clearParam: clearFilter, 
  } = useUrlParam(paramName);
  
  const filterCategories = useContext(FilterCategoriesContext) || [];

  const focusTypes = filterCategories.map(category => category?.id);

  const [activeFilterId, setActiveFilterId] = useState<ParamFilterType>(null);

  const activeFilterName = filterCategories
    .filter(category => category?.id === activeFilterId)[0]?.name || '';

  useEffect(() => {
    const formattedValue = Array.isArray(filterValue) ? filterValue.join(',') : filterValue;
    const hasFocusFilter = !!formattedValue && focusTypes.includes(formattedValue); 
    setActiveFilterId(hasFocusFilter ? formattedValue : null);   
  }, [filterValue, focusTypes]);

  return { 
    filterCategories,
    activeFilterId,
    activeFilterName, 
    updateFilter, 
    clearFilter
  };
}
