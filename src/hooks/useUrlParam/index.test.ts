import { renderHook } from "@testing-library/react-hooks";
import { UseUrlParamReturnProps } from ".";
import { useUrlParam } from "../../index";

const MOCK_PARAM_SINGLE_VALUE_KEY = 'param1';
const MOCK_PARAM_SINGLE_VALUE = 'value1';
const MOCK_PARAM_MULTIPLE_VALUE_KEY = 'param2';
const MOCK_PARAM_MULTIPLE_VALUE = 'value2,value3';

const firstDeafultParamString = `${MOCK_PARAM_SINGLE_VALUE_KEY}=${MOCK_PARAM_SINGLE_VALUE}`;
const secondDefaultParamString = `${MOCK_PARAM_MULTIPLE_VALUE_KEY}=${MOCK_PARAM_MULTIPLE_VALUE}`;

const onMockRouterUrlUpdate = jest.fn();

jest.mock("next/router", () => ({
  useRouter() {
    return {
      query: { 
        [MOCK_PARAM_SINGLE_VALUE_KEY]: MOCK_PARAM_SINGLE_VALUE, 
        [MOCK_PARAM_MULTIPLE_VALUE_KEY]: MOCK_PARAM_MULTIPLE_VALUE
      },
      push: onMockRouterUrlUpdate
    };
  },
}));

describe("useUrlParam", () => {
  describe("current params", () => {
    test('provided as empty string and empty array if param key and/or value is missing', () => {
      const { paramValue, paramCollection } = getParamValues('nonexistent-param');
      expect(paramValue).toBe('');
      expect(paramCollection).toEqual([]);    
    });
  
    test('provided as string and collection if param has single value', () => {
      const { paramValue, paramCollection } = getParamValues(MOCK_PARAM_SINGLE_VALUE_KEY);
      expect(paramValue).toBe(MOCK_PARAM_SINGLE_VALUE);
      expect(paramCollection).toEqual([MOCK_PARAM_SINGLE_VALUE]);    
    });
  
    test('provided as string and collection if param has multiple values', () => {
      const { paramValue, paramCollection } = getParamValues(MOCK_PARAM_MULTIPLE_VALUE_KEY);      
      expect(paramValue).toBe(MOCK_PARAM_MULTIPLE_VALUE);
      expect(paramCollection).toEqual(MOCK_PARAM_MULTIPLE_VALUE.split(','));    
    });

    function getParamValues (paramKey: string): UseUrlParamReturnProps {
      const { result } = renderHook(()=> useUrlParam(paramKey));
      return result.current;
    }
  });

  describe('update params', () => {
    describe('with existing params', () => {
      test('should update the new query parameter in the url', () => {
        const UPDATED_PARAM_VALUE = 'updatedParamValue,anotherUpdatedParamValue';
        triggerUpdateParam(MOCK_PARAM_MULTIPLE_VALUE_KEY, UPDATED_PARAM_VALUE);        
        const newParams = `${MOCK_PARAM_MULTIPLE_VALUE_KEY}=${UPDATED_PARAM_VALUE}`;
        const expectedNewParams = `/?${firstDeafultParamString}&${newParams}`;
        expect(onMockRouterUrlUpdate).toHaveBeenCalledWith(expectedNewParams);
      });
  
      // Typescript syntax thing :/
      // test.skip('should update query params with an array of values supplied', () => {
      //   const UPDATED_PARAM_VALUE = ['updatedParamValue', 'anotherUpdatedParamValue'];
      //   // UPDATED_PARAM_VALUE should satify <string | string[]> for second arg type, 
      //   // but getting a "string[] not assignable to string error"
      //   triggerUpdateParam(MOCK_PARAM_MULTIPLE_VALUE_KEY, UPDATED_PARAM_VALUE);
      //   updateParam(UPDATED_PARAM_VALUE);
      //   const newParams = `${MOCK_PARAM_MULTIPLE_VALUE_KEY}=${UPDATED_PARAM_VALUE.join(',')}`;
      //   const expectedNewParams = `/?${firstDeafultParamString}&${newParams}`;
      //   expect(onMockRouterUrlUpdate).toHaveBeenCalledWith(expectedNewParams);
      // });

      test('should remove existing param key if no value is supplied for param', () => {
        triggerUpdateParam(MOCK_PARAM_MULTIPLE_VALUE_KEY, '');        
        const expectedUpdatedParams = `/?${firstDeafultParamString}`;
        expect(onMockRouterUrlUpdate).toHaveBeenCalledWith(expectedUpdatedParams);
      });  
    });

    describe('with new params', () => {
      test('should add a new param to the existing params', () => {
        const NEW_PARAM_KEY = 'param3';
        const NEW_PARAM_VALUE = 'value4';
        triggerUpdateParam(NEW_PARAM_KEY, NEW_PARAM_VALUE);        
        const newParams = `${NEW_PARAM_KEY}=${NEW_PARAM_VALUE}`;
        const expectedUpdatedParams = `/?${firstDeafultParamString}&${secondDefaultParamString}&${newParams}`;
        expect(onMockRouterUrlUpdate).toHaveBeenCalledWith(expectedUpdatedParams);
      });      
    });

    function triggerUpdateParam (paramKey: string, paramValue: string): void {
      const { result } = renderHook(()=> useUrlParam(paramKey));
      const { updateParam } = result.current;
      updateParam(paramValue);    
    }
  });

  describe('clear params', () => {
    test('should remove param key if no value is supplied for param', () => {
      const { result } = renderHook(()=> useUrlParam(MOCK_PARAM_MULTIPLE_VALUE_KEY));
      const { clearParam } = result.current;
      clearParam();
      const expectedUpdatedParams = `/?${firstDeafultParamString}`;
      expect(onMockRouterUrlUpdate).toHaveBeenCalledWith(expectedUpdatedParams);
    });
  });
});
