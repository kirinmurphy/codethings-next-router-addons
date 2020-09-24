import React from 'react';

export interface FilterCategoryProps {
  id: string;
  name: string;
}

export const FilterCategoriesContext = React.createContext<FilterContextType>([]);

export type FilterContextType = Partial<FilterCategoryProps[]>

interface ProviderProps {
  children: JSX.Element;
  filterCategories: (FilterCategoryProps | undefined)[];
}

export function ParamFilterProvider ({ children, filterCategories }: ProviderProps): JSX.Element {
  return (
    <FilterCategoriesContext.Provider value={filterCategories}>
      {children}
    </FilterCategoriesContext.Provider>
  );
}
