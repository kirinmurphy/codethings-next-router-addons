# codethings-nextjs-router-addons 
Created a few custom hooks extending the Next.js useRouter functionality.  

## Install
```
npm install codethings-nextjs-router-addons    
    
yarn add codethings-nextjs-router-addons    
```

## useUrlParam
```
const { 
  paramValue,
  paramCollection
  updateParam, 
  clearParam, 
} = useUrlParam(paramName);
```

### Read param(s)
`paramValue` is the raw string version of the param values    
`paramCollection` is an array version of the param values
```
https://url.com/?paramName=someParamValue

results in:

paramValue === 'someParamValue'
paramCollection === ["someParamValue"]
```

```
https://url.com/?paramName=param1,param2,param3

results in:

paramValue === 'param1,param2,param3'
paramCollection === ['param1', 'param2', 'param3']
```

### Set param(s)
`updateParam` and `clearParam` will update the active param while persisting any other values.

`updateParam` accepts either a string or array of values.

Param can be removed by either calling `clearParam()` or `updateParam(null)` (anything falsy) 

Updates are pushed to the browser history stack and accessible through the browser navigation.    


### Override variable names
Optionally overide the variable names for clarity or to use the hook multiple times in the same component.
```
const { 
  paramValue: timestampValue, 
  updateParam: updateTimestamp, 
  clearParam: clearTimestamp, 
} = useUrlParam('timestamp');
```


### Custom Hook Wrapper
If using the hook for the same param in many places, create and export a wrapper hook to encapsulate the param and custom variable naming.
```
import { useUrlParam } from 'codethings-nextjs-router-addons';

export const PARAM_NAME_KEYWORD_SEARCH = 'search';

export function useKeywordSearchFilter () {
 
  const { 
    paramValue: keywordSearchValue, 
    updateParam: updateKeywordSearch, 
    clearParam: clearKeywordSearch,  
  } = useUrlParam(PARAM_NAME_KEYWORD_SEARCH);

  return { 
    keywordSearchValue,
    updateKeywordSearch,
    clearKeywordSearch
  };
}
```


### Example: Fetching search results from URL param
Capture updates to history stack and use that to make api queries when the url state changes.   

#### Search Input Component    
Using the `useKeywordSearchFilter` wrapper hook just made above: 
```
import { useKeywordSearchFilter } from '.utils/useKeywordSearchFilter';

const { 
  updateKeywordSearch, 
  clearKeywordSearch
} = useKeywordSearchFilter();

const [searchInput, setSearchInput] = useState();

<form>
  <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)}>
  <button onClick={() => updateKeywordSearch(searchInput)}>
  <span className="clear" onClick={() => { 
    setSearchInput('');
    clearKeywordSearch();
  }>Clear</span>
</form>
```

#### Search Results Component
then use the param value to trigger a fetch (or gql query or reducer dispatch, etc.) when URL params update.  
```
import { 
  useKeywordSearchFilter, 
  PARAM_NAME_KEYWORD_SEARCH 
} from '../utils/useKeywordSearchFilter';

const { 
  keywordSearchValue, 
} = useKeywordSearchFilter();

const [searchResults, setSearchResults] = useState(null);

useEffect(() => {
  const abortController = new AbortController();

  const fetchData = async () => {
    try {
      const params = !!keywordSearchValue ? ?${PARAM_NAME_KEYWORD_SEARCH}={keywordSearchValue}` : '';
      const path = `api/resource/${params}`;
      const response = await fetch(path, { signal: abortController.signal });
      const { searchObject } = await response.json();
      setSearchResults(searchObject);
    } catch (e) { 
      if (!abortController.signal.aborted) {
        console.log('search api error: ', e.message);
      }
    }
  };

  fetchData();

  return () => abortController.abort();
}, [keywordSearchValue]);
```
Filtered results are rendered on the page either from calling `updateKeywordSearch` anywhere in the code or directly navigating to the url with the param value.   


**Abort Controller** - allows cleaning up pending requests if component unmounts mind async     
Thanks Yurui - https://dev.to/pallymore/clean-up-async-requests-in-useeffect-hooks-90h



## UrlParamCategoryFilter
The Url Param Category Filter extends `useUrlParam` by constraining the possible valid values provided in the url against a fixed set of categories.  

### UrlParamCategoryFilterProvider
```
const foodCategories = [
  { id: 'fruit', name: 'Fruit' },
  { id: 'vegetable', name: 'Vegetable' },
  { id: 'bakedGoods', name: 'Baked Goods' }
];

<UrlParamCategoryFilterProvider filterCategories={foodCategories}>
  <SomeChildComponentAboutFood>
</UrlParamCategoryFilterProvider> 
```

### useUrlParamCategoryFilter
Access the filter props and methods by using the `useUrlParamCategoryFilter` in any component within the `UrlParamCategoryFilterProvider`
```
const { 
  filterCategories,
  activeFilterId,       
  activeFilterName, 
  updateFilter, 
  clearFilter 
} = useUrlParamCategoryFilter(paramName);
```
where `activeFilterId` matches to the param in the URL    
and `activeFilterName` is the corresponding name from the filterCategories collection.    

If param value is missing or an array of values, these will be set to null

### Example: In-page filter
In some component we make a dropdown selector for the filter: 
```
const { 
  filterCategories: foodCategories,
  activeFilterId: activeFoodCategoryId,
  activeFilterName: activeFoodCategoryName, 
  updateFilter: updateFoodCategory, 
  clearFilter: clearFoodCategory 
} = useUrlParamCategoryFilter('foodCategory');

<div className="dropdown">
  <div className="dropdown-trigger">{activeFoodCategoryName || 'Make A Selection'}</div>
  <div className="dropdown-window>
    {foodCategories.map((foodItem, index) => {
      const { id, catgory } = foodItem;
      const hasActiveFoodCategoryId = category.id === activeFoodCategoryId;

      return (
        <div className="food-category" 
          key={id}
          data-is-active={hasActiveFoodType}
            onClick={() => { 
              if ( !hasActiveFoodType ) { updateFoodCategory(category.id); }
              else { clearFoodCategory(); }
            }>
          {category.name}
        </div>
      );
    }}  
  </div>
</div>
```

and then in another component somewhere render a list based on if each item has that category property
```
const { 
  activeFilterId: activeFoodType 
} = useUrlParamCategoryFilter('foodCategory');

{foodItems.map((foodItem, index) => {
  const { id, category } = foodItem;
  const hasActiveFoodType = category.id === activeFoodType;
  const showItem = !activeFoodType || hasActiveFoodType;

  return showItem 
    ? <SomeFoodItemComponent foodItem={foodItem} key={id} />
    : <React.Fragment key={id} />;
})}
```


### Multiple Category filters on the same page
Currently only supports one category provider per page. 

