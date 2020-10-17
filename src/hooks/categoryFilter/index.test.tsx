import React from "react";
// import { renderHook } from "@testing-library/react-hooks";

import { 
  UrlParamCategoryFilterProvider, 
  useUrlParamCategoryFilter 
} from "../../index";

const mockedUpdateParam = jest.fn();
const mockedClearParam = jest.fn();

jest.mock("../useUrlParams", () => ({
  useUrlParam() {
    return {
      paramValue: '',
      paramCollection: [],
      updateParam: mockedUpdateParam,
      clearParam: mockedClearParam
    };
  },
}));

const PARAM_NAME = 'paramName';

const dummyCategories = [
  { id: "category1", name: "Category 1" },
  { id: "category2", name: "Category 2" }
];

function DummyCategoryFilterConsumerComponent () {
  const {
    filterCategories,
    // activeFilterId,
    // activeFilterName, 
    // updateFilter, 
    // clearFilter
  } = useUrlParamCategoryFilter(PARAM_NAME);
  return (
    <>
      
    </>
  );  
}

function DummyCategoryFilterProviderComponent () {
  return (
    <UrlParamCategoryFilterProvider filterCategories={dummyCategories}>
      <>haaay</>
    </UrlParamCategoryFilterProvider>
  );
}

describe("useUrlParam", () => {

});
