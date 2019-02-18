# js-object-mapper
Node module with utility functions to help you easily map one JS object to another.


## Motivation
When doing UI development using TypeScript or JavaScript it becomes necessary to map between various ViewModel objects and the various DataAcessObjects (DAOs) received from the various services used to fetch data for the UI. Writing code to do this mapping becomes tedious and repetivive. So this module aims to help by providing functions to easily map any JS object to another.

---

## **Examples**

### *DeepSet*
This method allows you to set deeply nested property or object values within an object.
If the target object does not contain the targetted property to be set, then the targetted
property hierarchy is created. This is very useful when trying to initialise a deeply nested
object structure without having to explicily create each object in the targetted property hierarchy.
This works for deeply nested arrays as well.
   If the targetted property hierarchy exists then, it used and the property is set without it overwriting
perviously set values.

1. Initialise an empty object with a deeply nested object property, in this case a nested multidimentional array.

````javascript
   const r = {};
   mapper.deepSet(r, 'b[0][1].h.y[0][1][0].p', 2);
   // Prints 2 to the console
   console.log(b[0][1].h.y[0][1][0].p);
````

2. Update a deeply nested property.

````javascript
   let r = {'a': 1, 'b': 2, c: { x: 1, y:[1, 2]} };
   mapper.deepSet(r, 'c.y[1]', 22);
   // Prints 22 to the console
   console.log(r.c.y[1]);
   // Prints 1 to the console
   console.log(r.a);
````

### *DeepGet*
This method allows you to fetch deeply nested properties from within an object without having to imperatively traverse the entire property hierarchy to get the value of the property. Additionally you do not need to do null checks along the way, if the property does not exist or one of the properties along the way is null, the method will return undefined. It also works for deeply nested multi-dimensional array values.

1. Get nested array values

````javascript
r = {a: 1, b:[[1,2,3], [4, 5]], c:{x:[9, {y:[10]}]}};
// Prints 10 to the console
console.log(mapper.deepGet(r, 'c.x[1].y[0]'));
````

### *Map*
This method allows you to map a property on one object to a property on another object. It leverages the 'DeepSet' and 'DeepGet' methods above. If the property hierarchy on the target object does not exist, the entire property hierarchy on the target object is created and this saves you the tedious task of having to create the entire property hierarchy on the target object before setting the value of a deeply nested property. This also works for deeply nested arrays and multi-dimensionl arrays.
   If the source property does not exist then the target propery is set to 'undefined'. 

1. Set target object properties

````javascript
        s = {a:1, b:2, c:{p:1, q:[1, 2]}};
        t = {o:{}};

        mapper.map(s, t, 'c.p', 'o.p');
        mapper.map(s, t, 'c.q', 'o.q');

        // Prints 1 to the console
        console.log(t.o.p);

        // Prints [1, 2] to the console
        console.log(t.o.q);

````