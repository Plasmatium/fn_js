if(!this.document) {
  var R = require('Ramda');
  var fs = require('fs');
}

//globalize functions in R
for(let prop in R) {
  global[prop] = R[prop];
}

var Container = function(x) {
  this.__value = x;
}

Container.of = function(x) { return new Container(x); };

Container.prototype.map = function(f){
  return Container.of(f(this.__value))
}

//------------------------------------------------------
//------------------------------------------------------


var Maybe = function(x) {
  this.__value = x;
}

Maybe.of = function(x) {
  return new Maybe(x);
}

Maybe.prototype.isNothing = function() {
  return (this.__value === null || this.__value === undefined);
}

Maybe.prototype.map = function(f) {
  return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this.__value));
}

Maybe.prototype.join = function() {
  return this.__value;
}


//--------------------------------------------
var IO = function(f) {
  this.__value = f;
}

IO.of = function(x) {
  return new IO(function() {
    return x;
  });
}

IO.prototype.map = function(f) {
  return new IO(R.compose(f, this.__value));
}

IO.prototype.join = function() {
  return this.__value;
}

var $ = (selector) => IO.of(document.querySelectorAll(selector));

// -----------------------------------------------
// pure
var url = (link)=>IO.of(link);

var parseSplit = R.compose(R.map(R.split('=')), R.split('&'));
var getParamFromUrl = R.compose(parseSplit, R.compose(R.last, R.split('?')));

//  filter :: String -> (IO [a] -> IO String)
var filter = (key) => {
  return R.map(R.filter((v)=>v[0]===key));
}

// findKey :: String -> IO (Maybe String)
var findKey = (key) => {
  return R.compose(R.map(Maybe.of), filter(key));
}


// ----------Exercises-----------------------
var ex1 = R.map(R.add(1));

//-------------------
var Left = function(x) {
  this.__value = x;
}

Left.of = function(x) {
  return new Left(x);
}

Left.prototype.map = function(f) {
  return this;
}

var Right = function(x) {
  this.__value = x;
}

Right.of = function(x) {
  return new Right(x);
}

Right.prototype.map = function(f) {
  return Right.of(f(this.__value));
}

var showWelcome = R.compose(R.concat( "Welcome "), R.prop('name'))

var checkActive = function(user) {
 return user.active ? Right.of(user) : Left.of('Your account is not active')
}

user = {'active': true, 'name': 'Plasmatium'};

var ex6 = R.compose(R.map(showWelcome), checkActive);

//-------------------------
var ex7 = (x) => {
  return x.length>3 ? Right.of(x) : Left.of("Need length > 3");
}

var ex72 = (x) => {
  return typeof x === "string" ? Right.of(x) : Left.of("Need string");
}

//-----------------------------------------------------------------

var join = function(mma) {
  return mma.join();
};

//  safeProp :: Key -> {Key: a} -> Maybe a
var safeProp = curry(function(x, obj) {
  return new Maybe(obj[x]);
});

//  safeHead :: [a] -> Maybe a
var safeHead = safeProp(0);

//-----------------------------------------
var fas = compose(join, map(safeProp('street')), join, map(safeHead), safeProp('addresses'));
var fas2 = compose(safeProp('street'), join, safeHead, join, safeProp('addresses'));
var chain = curry((f, m) => {
  return m.map(f).join();
});

var fas3 = compose(chain(safeProp('street')), chain(safeHead), safeProp('addresses'));
