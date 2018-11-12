const callback = (evtName, result) => console.log(evtName, result);

let jump = {
  box: () => 'box jumped',
  fence: () => 'fence jumped',
  pool: () => 'pool jumped',
};

let events = {
  [jump]: [
    'box',
    'fence',
    'pool',
  ],
};

const monkeyPatch = (objName, fnName, cb) => {
  console.log(objName);
  const fn = objName[fnName];
  objName[fnName] = function () {
    const result = fn.apply(this, arguments);
    cb(fnName, result);
    return result;
  };
};

Object
  .entries(events)
  .forEach(([objName, evts]) => {
    console.log(objName);
    evts.forEach(evt => monkeyPatch(objName, evt, callback));
  });

jump.box();
