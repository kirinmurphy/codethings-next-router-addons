# codethings-next-router-addons 
Created a few custom hooks extending the Next.js useRouter functionality.    

## useUrlParam
```
const { 
  paramValueFromUrl,
  paramCollectionFromUrl
  updateParam, 
  clearParam, 
} = useUrlParam(paramName);
```

### Read param(s)
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

### Set params 
`updateParam` and `clearParam` will update the active param while persisting any other values.  Updates to the params will be pushed to the browser history stack and previous navigation will be accesible with the back/forward browser buttons.  


### Override variable names
Optionally overide the variable names for clarity or to use multiple hooks in the same component.
```
const { 
  paramValueFromUrl: timestampValue, 
  updateParam: updateTimestamp, 
  clearParam: clearTimestamp, 
} = useUrlParam('timestamp');
```


## ParamFilter
The param filter allows you to match a Url paramter against a white-list of valid filter categories and exposes a hook that provide access to view and change the active filter.

  
### Param Filter Provider
```
const foodCategories = [
  { id: 'fruit', name: 'Fruit' },
  { id: 'vegetable', name: 'Vegetable' },
  { id: 'bakedGoods', name: 'Baked Goods' }
];

<ParamFilterProvider filterCategories={foodCategories}>
  <SomeChildComponentAboutFood>
</ParamFilterProvider> 
```

### useParamFilter
Access the filter props by using the `useParamFilter` in any component within the `ParamFilteProvider`
```
const { 
  filterCategories,
  activeFilterId,       
  activeFilterName, 
  updateFilter, 
  clearFilter 
} = useParamFilter(paramName);
```
where `activeFilterId` matches to the param in the URL    
and `activeFilterName` is the corersponding name from the filterCategories collection.

#### For Example:
in some component we make a dropdown selector for the filter: 
```
const { 
  filterCategories: foodCategories,
  activeFilterId: activeFoodCategoryId,
  activeFilterName: activeFoodCategoryName, 
  updateFilter: updateFoodCategory, 
  clearFilter: clearFoodCategory 
} = useParamFilter('foodCategory');

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
} = useParamFilter('foodCategory');

{foodItems.map((foodItem, index) => {
  const hasActiveFoodType = foodItem.category.id === activeFoodType;
  const showItem = !activeFoodType || hasActiveFoodType;

  return showItem ? (
    <div key={index} className="food-item">
      <div className="name">{foodItem.name}</div>
      <div className="type">{foodItem.category.name}</div>
    </div>
  ) : <React.Fragment key={index}>;
})}
```


### Custom Hook Wrapper
If using the hook for the same params in many places, abstract the param and variable renaming into a custom hook wrapper
```
import { useParamFilter } from 'codethings-next-router-addons';

const FILTER_PARAM = 'foodCategory';

export function useFoodCategoryFilter () {
 
  const { 
    filterCategories: foodCategories,
    activeFilterId: activeFoodCategoryId,
    activeFilterName: activeFoodCategoryName, 
    updateFilter: updateFoodCategory, 
    clearFilter: clearFoodCategory 
  } = useParamFilter(FILTER_PARAM);

  return { 
    foodCategories,
    activeFoodCategoryId,
    activeFoodCategoryName, 
    updateFoodCategory, 
    clearFoodCategory
  };
}
```

### Multiple Param filters
Currently only supports matching to one param key per page.  However you can instead pass a comma separated list of values to the param in the URL and then work with the value as an array.  I think.  I need to double check that.  
