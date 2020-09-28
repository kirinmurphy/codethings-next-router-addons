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
  paramValueFromUrl,
  paramCollectionFromUrl
  updateParam, 
  clearParam, 
} = useUrlParam(paramName);
```

### Read param
`paramValueFromUrl` or `paramCollectionFromUrl` will be populated if there are any matching props in the url. so: 

```
https://url.com/?paramName=someParamValue

results in:

paramValueFromUrl === 'someParamValue'
```


```
https://url.com/?paramName=param1,param2,param3

results in:

paramCollectionFromUrl === ['param1', 'param2', 'param3'];
```

### Set param
`updateParam` and `clearParam` will update the active param while persisting any other values.      

Updates to the params will be pushed to the browser history stack and previous navigation will be accesible with the back/forward browser buttons.    


### Override variable names
Optionally overide the variable names for clarity or to use multiple hooks in the same component.
```
const { 
  paramValueFromUrl: timestampValue, 
  updateParam: updateTimestamp, 
  clearParam: clearTimestamp, 
} = useUrlParam('timestamp');
```


### Custom Hook Wrapper
If using the hook for the same param in many places, create and export a wrapper hook to abstract the param and custom variable names.
```
import { useUrlParam } from 'codethings-nextjs-router-addons';

const SEARCH_PARAM = 'search';

export function useKeywordSearchFilter () {
 
  const { 
    paramValueFromUrl: keywordSearchValue, 
    updateParam: updateKeywordSearch, 
    clearParam: clearKeywordSearch,  
  } = useUrlParam(SEARCH_PARAM);

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
```
import { useKeywordSearchFilter } from '../utils/useKeywordSearchFilter';

const { 
  keywordSearchValue, 
} = useKeywordSearchFilter();

const [searchResults, setSearchResults] = useState(null);

useEffect(() => {
  // Abort Controller - allows cleaning up pending requests if component unmounts mind async
  // Thanks Yurui - https://dev.to/pallymore/clean-up-async-requests-in-useeffect-hooks-90h
  const abortController = new AbortController();

  const fetchData = async () => {
    try {
      const params = !!activeFilterId ? ?${PARAM_NAME_MUSIC_GENRE}={keywordSearchValue}` : '';
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
Access the filter props by using the `useUrlParamCategoryFilter` in any component within the `UrlParamCategoryFilterProvider`
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
and `activeFilterName` is the corersponding name from the filterCategories collection.

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
  <div className="dropdown-trigger">{activeFoodCategoryName}</div>
  <div className="dropdown-window>
    {foodCategories.map((foodItem, index) => {
      const hasActiveFoodCategoryId = foodItem.category.id === activeFoodCategoryId;

      return (
        <div className="food-category" 
          key={index}
          data-is-active={hasActiveFoodType}
            onClick={() => { 
              if ( !hasActiveFoodType ) { updateFoodCategory(foodItem.category.id); }
              else { clearFoodCategory(); }
            }>
          {foodItem.category.name}
        </div>
      );
    }}  
  </div>
</div>
```

and then somewhere else on the page we render a list based on if each item has that category property
```
const { 
  activeFilterId: activeFoodType 
} = useUrlParamCategoryFilter('foodCategory');

{foodItems.map((foodItem, index) => {
  const hasActiveFoodType = foodItem.category.id === activeFoodType;
  const showItem = !activeFoodType || hasActiveFoodType;

  return showItem 
    ? <SomeFoodItemComponent foodItem={foodItem} key={index} />
    : <React.Fragment key={index} />;
})}
```
Filtered results are rendered on the page either from calling `updateFilter` anywhere in the code (inside the `<UrlParamCategoryFilterProvider />`), or directly navigating to the url with the param value.  
