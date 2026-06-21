- use describe to group tests
  - zod.test.js
```
describe('searchZod', () => {
  it('should validate with valid query', () => {
    ...
  })
})
```
- __tests__ dir not required, common practices are:
  - .test file in same dir next to implementation:
    - utils/zod.js utils/zod.test.js
  - test dir parallel to src:
    - src/utils/zod.js
    - test/utils/zod.test.js
  - I usually do the first option, Java devs always do the 2nd one
    partially depends on language
- for searchZod, add test where error due to empty string, verifying that the 1 char minimum works
- for other fns make empty string test case
- rest of test file looks good
