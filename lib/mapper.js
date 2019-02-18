//jshint esnext:true

function unravelArrPropToArr(prop, arr){
  let start = prop.indexOf('[');
  let end = prop.lastIndexOf(']');

  if (start !== -1 && end !== -1) {   
    idx = prop.substr(start+1, end - start -1);
    
    prop = prop.substr(0, start);
    var regex = /\]\[/gi;
    idx = idx.replace(regex, '.');
    idxArr = idx.split('.');
    
    idxArr.forEach(i => arr.push(i));
  }
}

function unravelArrProp(prop){
  let ret = [];
  unravelArrPropToArr(prop, ret);
  return ret;
}

function deepGetArr(source, propArr){  
  let prop = propArr.shift();
  
  start = prop.indexOf('[')
  end = prop.lastIndexOf(']');
  
  if (start !== -1 && end !== -1) {    
    let idxArr = unravelArrProp(prop);
    if (idxArr.length > 0) {
      idxArr.reverse().forEach(idx => propArr.unshift(idx));      
     }
    prop = prop.substr(0, start);
  }
    
  if(source.hasOwnProperty(prop)) {
    if (propArr.length === 0) {
      return source[prop];
    } else {
    let nextSource = source[prop];
    return deepGetArr(nextSource, propArr);
  } 
 } else { return undefined; }
}

function deepSetArr(target, propArr, propVal){  
  let prop = propArr.shift();
  let propIsArray = false;
  
  if(typeof prop === 'object') {    
    propIsArray = prop.propIsArray;
    prop = prop.property;
  } else {
    propIsArray = false;
  }
  
  start = prop.indexOf('[')
  end = prop.lastIndexOf(']');
  
  if (start !== -1 && end !== -1) {    
    let idxArr = unravelArrProp(prop);
    if (idxArr.length > 0) {
      let idxArrRev = idxArr.reverse();   
      for (let i = 0; i < idxArrRev.length; i++) {
        let createArray = i === 0 ? false : true;
        propArr.unshift({property:idxArrRev[i], propIsArray: createArray});
      }
     }
    prop = prop.substr(0, start);
    propIsArray = true;
  }
  
  if(target.hasOwnProperty(prop)) {
    if (propArr.length === 0) {
      target[prop] = propVal;
    } else {
    let nextTarget = target[prop];
    deepSetArr(nextTarget, propArr, propVal);
  } 
 } else {
   if (propArr.length > 0) {
     target[prop] = propIsArray ?  [] : {};
     let nextTarget =  target[prop];
     deepSetArr(nextTarget, propArr, propVal);
   } else {
        target[prop] = propVal;
   }
 }
}

function deepSet(target, propStr, propVal) {
   keys = propStr.split('.');   
   deepSetArr(target, keys, propVal);
}

function deepGet(source, propStr) {
  keys = propStr.split('.');
  return deepGetArr(source, keys);
}

function map(source, target, propStrFrom, propStrTo) {
  if (!target || target === null) { target = {};}
  sourcePropVal = deepGet(source, propStrFrom);
  deepSet(target, propStrTo, sourcePropVal);
}
  
module.exports = {
  map,
  deepGet,
  deepSet
}