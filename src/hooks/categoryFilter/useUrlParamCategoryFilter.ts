import { useEffect, useState, useContext } from 'react';

import { FilterCategoriesContext, FilterCategoryProps } from "./UrlParamCategoryFilterProvider";
import { useUrlParam, UpdateParamType, ClearParamType } from '../useUrlParam';

type FilterContextYpe = Partial<FilterCategoryProps[]>

export type ParamFilterType = string | null;

interface useUrlParamCategoryFilterReturnProps {
  activeFilterId: ParamFilterType;
  activeFilterName: string | null;
  filterCategories: FilterContextYpe;
  updateFilter: UpdateParamType;
  clearFilter: ClearParamType;
}

export function useUrlParamCategoryFilter (paramName:string): useUrlParamCategoryFilterReturnProps {

  const { 
    paramValue: filterValue, 
    updateParam, 
    clearParam: clearFilter, 
  } = useUrlParam(paramName);
  
  const filterCategories = useContext(FilterCategoriesContext) || [];

  const focusTypes = filterCategories.map(category => category?.id);

  const [activeFilterId, setActiveFilterId] = useState<ParamFilterType>(null);

  const activeFilterName = filterCategories
    .filter(category => category?.id === activeFilterId)[0]?.name || null;

  const updateFilter = (option: string): void => {
    const matchesCagetory  = filterCategories.filter(category => category?.id === option).length;
    if ( matchesCagetory ) { updateParam(option); }    
  }
  
  useEffect(() => {
    const hasSingleFilterValue =  !!filterValue && filterValue.split(',').length === 1;
    const hasFocusFilter = hasSingleFilterValue && focusTypes.includes(filterValue as string); 
    setActiveFilterId(hasFocusFilter ? filterValue : null);   
  }, [filterValue, focusTypes]);

  return { 
    filterCategories,
    activeFilterId,
    activeFilterName, 
    updateFilter, 
    clearFilter
  };
}
