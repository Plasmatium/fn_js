var R = require('ramda');
var rf = require('ramda-fantasy');

for(let p in R) {
  global[p] = R[p];
}

for(let p in rf) {
  if(global[p]) console.log('name conflict', p);
  global[p] = rf[p];
}

Just = Maybe.Just;
Nothing = Maybe.Nothing;

var check_integer = (val) => {
  return Number.isInteger(val) ?
  Either.Right(val) :
  Either.Left(`val: ${val} is not an integer`);
}

var go_next = (val) =>
  val % 2 === 0 ?
  Just(val / 2) :
  Just(val * 3 + 1);

var safeGo = compose(chain(go_next), chain(check_integer));

var checkstop = curry((stop_num, maybe) => maybe.value === stop_num);
var stopOn1 = checkstop(1);

var endpoint = (mb) => {
  if(stopOn1(mb)) {
  }
  else {
    endpoint(safeGo(mb));
  }
}
