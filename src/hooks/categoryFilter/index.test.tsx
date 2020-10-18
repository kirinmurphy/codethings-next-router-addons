import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from "@testing-library/react"
import * as useUrlParamModule from '../useUrlParam';

import { 
  UrlParamCategoryFilterProvider, 
  useUrlParamCategoryFilter 
} from "../../index";

const PARAM_NAME = 'paramName';

const dummyCategories = [
  { id: "category1", name: "Category 1" },
  { id: "category2", name: "Category 2" }
];

const TESTID_FILTER_CATEGORIES = 'filterCategories';
const TESTID_ACTIVE_FILTER_ID = 'activeFilterId';
const TESTID_ACTIVE_FILTER_NAME = 'activeFilterName';
const TESTID_BUTTON_UPDATE_INVALID_VALUE = 'buttonUpdateInvalidValue';
const TESTID_BUTTON_UPDATE_WITH_FIRST_CATEGORY_ID = 'buttonUpdateValidValue';
const TESTID_BUTTON_CLEAR_FILTER = 'clearFilter';

function DummyCategoryFilterConsumer () {
  const {
    filterCategories,
    activeFilterId,
    activeFilterName, 
    updateFilter, 
    clearFilter
  } = useUrlParamCategoryFilter(PARAM_NAME);

  // :/ this feels pretty workaroundy...
  // but @testing-library/react-hooks doesn't really work with components
  // need to have a component inside the provider since using useContext
  return (
    <>
      <div data-testid={TESTID_FILTER_CATEGORIES}>{JSON.stringify(filterCategories)}</div>
      <div data-testid={TESTID_ACTIVE_FILTER_ID}>{JSON.stringify(activeFilterId)}</div>
      <div data-testid={TESTID_ACTIVE_FILTER_NAME}>{JSON.stringify(activeFilterName)}</div>
      <button data-testid={TESTID_BUTTON_UPDATE_INVALID_VALUE}
        onClick={() => updateFilter('non-matching-id')} />
      <button data-testid={TESTID_BUTTON_UPDATE_WITH_FIRST_CATEGORY_ID}
        onClick={() => updateFilter(dummyCategories[0].id)} />
      <button data-testid={TESTID_BUTTON_CLEAR_FILTER} onClick={clearFilter} />
    </>
  );  
}

function DummyCategoryFilterProvider () {
  return (
    <UrlParamCategoryFilterProvider filterCategories={dummyCategories}>
      <DummyCategoryFilterConsumer />
    </UrlParamCategoryFilterProvider>
  );
}

const useUrlParamSpy = jest.spyOn(useUrlParamModule, 'useUrlParam');

const mockedUpdateParam = jest.fn();
const mockedClearParam = jest.fn();

const defaultUseUrlParamProps = {
  paramValue: '',
  paramCollection: [],
  updateParam: mockedUpdateParam,
  clearParam: mockedClearParam
}

describe.only("useUrlParam hook", () => {
  test('provides the filter categories passed into the UrlParamCategoryFilterProvider', () => {
    useUrlParamSpy.mockReturnValue(defaultUseUrlParamProps)
    render(<DummyCategoryFilterProvider />);
    expect(screen.getByTestId(TESTID_FILTER_CATEGORIES)).toHaveTextContent(JSON.stringify(dummyCategories));
  });

  describe('activFilterId & activeFilterName', () => {
    describe('with NO filter param value', () => {
      test('are set to null if there is no active filter', () => {
        useUrlParamSpy.mockReturnValue(defaultUseUrlParamProps)
        render(<DummyCategoryFilterProvider />);
        expect(screen.getByTestId(TESTID_ACTIVE_FILTER_ID)).toHaveTextContent('null');
        expect(screen.getByTestId(TESTID_ACTIVE_FILTER_NAME)).toHaveTextContent('null');
      });
    });

    describe('with filter param value', () => {
      test('are set to null if activeFilterId does not match to a filter category', () => {
        const paramProps = { ...defaultUseUrlParamProps, paramValue: 'not-a-matching-category-id' };
        useUrlParamSpy.mockReturnValue(paramProps);
        render(<DummyCategoryFilterProvider />);
        expect(screen.getByTestId(TESTID_ACTIVE_FILTER_ID)).toHaveTextContent('null');
        expect(screen.getByTestId(TESTID_ACTIVE_FILTER_NAME)).toHaveTextContent('null');
      });

      test('are set to null if there are more than 1 (matching) filter values', () => {
        const dummyParamValue = `${dummyCategories[0].id},${dummyCategories[1].id}`;
        const paramProps = { ...defaultUseUrlParamProps, paramValue: dummyParamValue };
        useUrlParamSpy.mockReturnValue(paramProps)
        render(<DummyCategoryFilterProvider />);
        expect(screen.getByTestId(TESTID_ACTIVE_FILTER_ID)).toHaveTextContent('null');
        expect(screen.getByTestId(TESTID_ACTIVE_FILTER_NAME)).toHaveTextContent('null');
      });

      test('are set to the catgory id & name if filterValue matches to a category.id', () => {
        const matchingParam = dummyCategories[0]
        const paramProps = { ...defaultUseUrlParamProps, paramValue: matchingParam.id };
        useUrlParamSpy.mockReturnValue(paramProps);
        render(<DummyCategoryFilterProvider />);
        expect(screen.getByTestId(TESTID_ACTIVE_FILTER_ID)).toHaveTextContent(matchingParam.id);
        expect(screen.getByTestId(TESTID_ACTIVE_FILTER_NAME)).toHaveTextContent(matchingParam.name);
      });        
    });
  });

  describe('updateFilter', () => {
    beforeEach(() => {
      useUrlParamSpy.mockReturnValue(defaultUseUrlParamProps);
      render(<DummyCategoryFilterProvider />);
    });

    it('should NOT update the url param if new value does NOT match to a category id', () => {
      const button = screen.getByTestId(TESTID_BUTTON_UPDATE_INVALID_VALUE);
      fireEvent.click(button);
      expect(mockedUpdateParam).not.toHaveBeenCalled();
    });

    it('should update the url param if new value matches to a category id', () => {
      const button = screen.getByTestId(TESTID_BUTTON_UPDATE_WITH_FIRST_CATEGORY_ID);
      fireEvent.click(button);
      expect(mockedUpdateParam).toHaveBeenCalledWith(dummyCategories[0].id);
    });
  });

  describe('clearFilter', () => {
    it('should clear the param value from the URL', () => {
      useUrlParamSpy.mockReturnValue(defaultUseUrlParamProps);
      render(<DummyCategoryFilterProvider />);
      const button = screen.getByTestId(TESTID_BUTTON_CLEAR_FILTER);
      fireEvent.click(button);
      expect(mockedClearParam).toHaveBeenCalled();
    });
  });
});
