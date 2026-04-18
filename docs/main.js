(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.eb.y === region.cW.y)
	{
		return 'on line ' + region.eb.y;
	}
	return 'on lines ' + region.eb.y + ' through ' + region.cW.y;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (Object.prototype.hasOwnProperty.call(value, key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	var unwrapped = _Json_unwrap(value);
	if (!(key === 'toJSON' && typeof unwrapped === 'function'))
	{
		object[key] = unwrapped;
	}
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.dE,
		impl.er,
		impl.eh,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'outerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (
		(typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		||
		(Array.isArray(_Json_unwrap(value)) && _VirtualDom_RE_js_html.test(String(_Json_unwrap(value))))
	)
		? _Json_wrap(
			/**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		dJ: func(record.dJ),
		eg: record.eg,
		dV: record.dV
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.dJ;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.eg;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.dV) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.dE,
		impl.er,
		impl.eh,
		function(sendToApp, initialModel) {
			var view = impl.cI;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.dE,
		impl.er,
		impl.eh,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.bS && impl.bS(sendToApp)
			var view = impl.cI;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.dr);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.em) && (_VirtualDom_doc.title = title = doc.em);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.dM;
	var onUrlRequest = impl.dN;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		bS: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.c9 === next.c9
							&& curr.c$ === next.c$
							&& curr.c6.a === next.c6.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		dE: function(flags)
		{
			return A3(impl.dE, flags, _Browser_getUrl(), key);
		},
		cI: impl.cI,
		er: impl.er,
		eh: impl.eh
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { dB: 'hidden', ds: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { dB: 'mozHidden', ds: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { dB: 'msHidden', ds: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { dB: 'webkitHidden', ds: 'webkitvisibilitychange' }
		: { dB: 'hidden', ds: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		dd: _Browser_getScene(),
		di: {
			et: _Browser_window.pageXOffset,
			eu: _Browser_window.pageYOffset,
			dj: _Browser_doc.documentElement.clientWidth,
			c_: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		dj: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		c_: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			dd: {
				dj: node.scrollWidth,
				c_: node.scrollHeight
			},
			di: {
				et: node.scrollLeft,
				eu: node.scrollTop,
				dj: node.clientWidth,
				c_: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			dd: _Browser_getScene(),
			di: {
				et: x,
				eu: y,
				dj: _Browser_doc.documentElement.clientWidth,
				c_: _Browser_doc.documentElement.clientHeight
			},
			dz: {
				et: x + rect.left,
				eu: y + rect.top,
				dj: rect.width,
				c_: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.a) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.c),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.c);
		} else {
			var treeLen = builder.a * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.d) : builder.d;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.a);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.c) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.c);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{d: nodeList, a: (len / $elm$core$Array$branchFactor) | 0, c: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {cZ: fragment, c$: host, c4: path, c6: port_, c9: protocol, da: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$Types$AddStateTool = 1;
var $author$project$Lang$EN = 0;
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$Lang$translations = function (lang) {
	if (!lang) {
		return {
			F: 'Accept states',
			G: 'Actions',
			H: 'Add',
			I: 'Add state',
			J: 'Add transition',
			K: 'Alphabet',
			L: 'Auto run',
			M: '< Back',
			N: 'Cancel',
			O: '🗑 Clear All',
			P: 'Clear all',
			Q: 'Close',
			R: 'Code',
			U: 'Current State: ',
			V: 'Delete state/transition',
			dv: 'Diagram generated from code.',
			W: 'Draw',
			X: 'Enter test word…',
			Y: '💾 .dfa',
			Z: 'Download SVG',
			_: '💬 Feedback',
			aa: 'I\'d love to hear your thoughts! Fill out my quick form or send me an email.',
			ab: '💬 Feedback',
			ac: 'Generate diagram',
			ad: 'Got it!',
			ae: '📖 Guide',
			af: '⊕ Add State',
			ag: 'Click on the empty canvas to place a new state.',
			ah: '→ Add Transition',
			ai: 'Click the source state, then the target state. Enter the transition character.',
			aj: '< Back / > Step',
			ak: 'Manually step through the simulation: go back or forward one character at a time.',
			al: 'Deletes all states, transitions and simulation data. This action CANNOT be undone.',
			am: '🗑 Clear All',
			an: 'Code Panel',
			ao: 'The start state field in the Code panel determines the initial Current State.',
			ap: 'The state with the green border and dark green fill on the diagram is the current state.',
			aq: 'Current State',
			ar: 'The state the DFA is currently in. If shown as — (Nothing), the DFA has no valid transition and is stuck.',
			as: 'Starts from the start state when Load DFA is pressed, then changes step by step.',
			at: 'X Delete state/transition',
			au: 'Click on a state or transition to delete it. You can also delete elements in other draw modes — if your cursor is hovering over a state or transition, click the Delete button on your keyboard. The hovered element will turn red to indicate it can be deleted. This is not a bug and you can continue drawing normally.',
			av: ' Editing the Diagram',
			aw: 'States / Alphabet / Start / Accept',
			ax: 'Fill in these fields for a formal DFA description. They update automatically when editing the diagram.',
			ay: 'Format',
			az: 'One transition per line: from,character,to — e.g. q0,a,q1',
			aA: 'Generate diagram',
			aB: 'Automatically builds the diagram from the typed code, arranging states in a circle.',
			aC: 'The transitions rows determine whether a valid transition exists at each index position.',
			aD: 'The active arrow on the diagram shows which character was just read.',
			aE: 'Index',
			aF: 'Shows which character position in the input word the simulation is currently at (e.g. 2 / 4).',
			aG: 'Counts the characters of the word entered in the Test String field.',
			aH: 'Load',
			aI: 'Choose one sloth from SAVED DIAGRAMS or import a .dfa file and it will be loaded. The loaded diagram and code can be edited but it needs to be saved again separately after the editing.',
			aJ: '⚙ Load DFA',
			aK: 'Loads the DFA and sets the simulation to the start state. Press this first.',
			aL: 'Pan',
			aM: 'Drag the empty canvas area to move the view.',
			aN: '>> Read all',
			aO: 'Processes the entire word at once and shows the final result.',
			aP: 'Redo a previously undone action. You can also use Ctrl+Y',
			aQ: '↪ Redo',
			aR: '✎ Rename',
			aS: 'Use the button in the state list or double-click directly on the state.',
			aT: '<< Reset',
			aU: 'Resets the simulation back to the beginning.',
			aV: '▶ Run / ⏹ Stop',
			aW: 'Run: automatically plays through the simulation at the set speed. Stop: pauses it.',
			aX: 'S / A / X',
			aY: 'S = set as start state, A = toggle accept state, × = delete state.',
			aZ: 'Download SVG',
			a_: 'Download an .svg image of the state diagram.',
			a$: 'Save',
			a0: 'Save the current diagram to future use. You can rename the saved sloth, export to a .dfa file and also delete it.',
			a1: ' Save and Load',
			a2: '✋ Select',
			a3: 'Drag states to move them. Double-click a state to rename it.',
			a4: 'Simulation',
			a5: '🐌 Speed slider 🐎',
			a6: 'Adjust the speed of the automatic playback (slower ↔ faster).',
			a7: 'Determined by whether a valid transition exists in the transitions field for the current input character.',
			a8: 'The highlighted state on the canvas (green or red border) shows where the simulation currently is.',
			a9: 'Status',
			ba: 'A text description of the current event. Green = ACCEPTED, Red = REJECTED, Purple = in progress.',
			bb: 'Shown in the Test String panel and updates continuously as the simulation runs.',
			bc: 'What do the status indicators mean?',
			bd: 'Test word',
			be: 'Type the word you want to test (e.g. \"aab\").',
			bf: '📖 Help & Controls',
			bg: 'Undo the last diagram change (up to 50 steps). You can also use Ctrl+Z.',
			bh: '↩ Undo',
			bi: 'Undo / Redo / Clear',
			bj: '+ / − / ⌂',
			bk: 'Zoom in, zoom out, and reset the view.',
			bl: '📂 Import .dfa file',
			bm: 'Load a diagram from your computer',
			bn: 'Index: ',
			bo: 'Load',
			bp: '⚙ Load DFA',
			br: 'X',
			bs: '↩ Load',
			bt: 'Load diagram',
			bu: 'No saved diagrams yet.\nBuild something and save it!',
			bv: '✎',
			bw: 'Save',
			bx: 'Name your save…',
			by: 'Save diagram',
			bz: 'Saved diagrams',
			bA: 'Your saved diagrams',
			bD: '📋 Open Feedback Form',
			bE: '>> Read all',
			bF: 'Redo',
			bG: 'Rename',
			bH: 'Rename',
			bI: 'Rename state: ',
			bJ: '<< Reset',
			bK: 'Reset view',
			bL: '▶ Run',
			bM: 'Save',
			bN: 'Select/Move',
			bO: 'Auto-renumber states on delete',
			bP: 'When deleting q2, all higher states (q3, q4…) are renamed down by one.',
			bQ: 'Language',
			bR: 'Settings',
			bT: function (st) {
				return '✔ ACCEPTED — in accept state: ' + st;
			},
			bU: function (n) {
				return 'State added: ' + n;
			},
			bV: 'Auto run resumed...',
			bW: 'Auto run started...',
			bX: 'Back to start.',
			bY: 'Cleared everything.',
			bZ: function (n) {
				return 'Deleted state: ' + n;
			},
			b_: F2(
				function (fr, to) {
					return 'Deleted transition: ' + (fr + (' → ' + to));
				}),
			b$: 'Diagram generated from code.',
			b0: 'Add states by clicking the canvas.',
			b1: 'Load DFA first!',
			b2: function (w) {
				return 'Loaded. Ready to test: \"' + (w + '\"');
			},
			b3: F2(
				function (st, ch) {
					return '✘ REJECTED: no transition from ' + (st + (' on \'' + (ch + '\'')));
				}),
			b4: 'Nothing to redo.',
			b5: 'Nothing to undo.',
			b6: 'Paused.',
			b7: F2(
				function (ch, st) {
					return 'Read \'' + (ch + ('\' → moved to ' + st));
				}),
			b8: 'Redone.',
			b9: function (st) {
				return '✘ REJECTED — not in accept state (current: ' + (st + ')');
			},
			ca: F2(
				function (o, nw) {
					return 'Renamed: ' + (o + (' → ' + nw));
				}),
			cb: 'Reset. Click \'Load DFA\' to start.',
			cc: function (n) {
				return 'Start state set: ' + n;
			},
			cd: function (st) {
				return 'Stepped back to ' + st;
			},
			ce: F3(
				function (fr, ch, to) {
					return fr + (' --[' + (ch + (']--> ' + to)));
				}),
			cf: 'Undone.',
			cg: 'Speed',
			ch: 'Start state',
			ci: 'State Diagram',
			cj: '✎ rename · S start · A accept · X delete',
			ck: function (n) {
				return 'States  (' + ($elm$core$String$fromInt(n) + ')');
			},
			cl: 'States',
			cm: F2(
				function (sc, tc) {
					return $elm$core$String$fromInt(sc) + (' state' + (((sc !== 1) ? 's' : '') + ('  ·  ' + ($elm$core$String$fromInt(tc) + (' transition' + ((tc !== 1) ? 's' : ''))))));
				}),
			cn: 'Code panel: ',
			co: 'State Diagram: ',
			cp: 'Status: ',
			cq: 'Test String: ',
			cr: '> Step',
			cs: 'Step-by-step',
			ct: '⏹ Stop',
			cu: 'Test String',
			cw: 'Deleted',
			cx: function (n) {
				return 'Exported \"' + (n + '.dfa\"');
			},
			cy: 'Failed to read file.',
			cz: function (n) {
				return 'Imported \"' + (n + '\"');
			},
			cA: function (n) {
				return 'Loaded \"' + (n + '\"');
			},
			cB: 'Nothing to save yet.',
			cC: function (n) {
				return 'Saved \"' + (n + '\"');
			},
			cD: 'Character(s) for this transition (use | for multiple, e.g. a|b|c): ',
			cE: 'Transition: ',
			cG: 'Transitions',
			cH: 'Undo',
			cI: 'View',
			cJ: 'What is this app?',
			cK: 'This tool is an interactive Deterministic Finite Automaton (DFA) simulator designed for college and university students. The goal is to help learners visually and interactively understand how automata work during theoretical computer science classes — how a DFA processes an input word, when it accepts, and when it rejects.',
			cL: 'Zoom in',
			cM: 'Zoom out'
		};
	} else {
		return {
			F: 'Akceptačné stavy',
			G: 'Akcie',
			H: 'Pridať',
			I: 'Pridať stav',
			J: 'Pridať prechod',
			K: 'Abeceda',
			L: 'Automatický beh',
			M: '< Späť',
			N: 'Zrušiť',
			O: '🗑 Vymazať všetko',
			P: 'Vymazať všetko',
			Q: 'Zavrieť',
			R: 'Kód',
			U: 'Aktuálny stav: ',
			V: 'Odstrániť stav/prechod',
			dv: 'Diagram generované z kódu.',
			W: 'Kresliť',
			X: 'Zadaj testové slovo…',
			Y: '💾 .dfa',
			Z: 'Stiahnúť SVG',
			_: '💬 Spätná väzba',
			aa: 'Rada si vypočujem vaše názory! Vyplňte môj krátky formulár alebo mi napíšte e-mail.',
			ab: '💬 Spätná väzba',
			ac: 'Generovať diagram',
			ad: 'Rozumiem!',
			ae: '📖 Návod',
			af: '⊕ Pridať stav',
			ag: 'Klikni na prázdne plátno pre umiestnenie nového stavu.',
			ah: '→ Pridať prechod',
			ai: 'Klikni na zdrojový stav, potom na cieľový stav. Zadaj znak prechodu.',
			aj: '< Späť / > Krok',
			ak: 'Manuálne prechádzaj simuláciou: jeden znak dozadu alebo dopredu.',
			al: 'Odstráni všetky stavy, prechody a simulačné dáta. Túto akciu NEMOŽNO vrátiť.',
			am: '🗑 Vymazať všetko',
			an: 'Panel kódu',
			ao: 'Pole začiatočného stavu v paneli Kódu určuje počiatočný Aktuálny stav.',
			ap: 'Stav so zeleným okrajom a tmavozelenou výplňou na diagrame je aktuálny stav.',
			aq: 'Aktuálny stav',
			ar: 'Stav, v ktorom sa DKA aktuálne nachádza. Ak je zobrazené — (Nothing), DKA nemá platný prechod a je zaseknutý.',
			as: 'Začína zo začiatočného stavu po stlačení Načítať DKA, potom sa mení krok po kroku.',
			at: 'X Odstrániť stav/prechod',
			au: 'Klikni na stav alebo prechod pre jeho odstránenie. Prvky môžeš odstrániť aj v iných režimoch kreslenia — ak je kurzor nad stavom alebo prechodom, stačí kliknúť na tlačidlo Delete na klávesnici. Zvýraznený prvok sa zobrazí červenou farbou, čo znamená, že ho možno odstrániť. Nie je to chyba a kreslenie môžeš normálne používať ďalej.',
			av: ' Úprava diagramu',
			aw: 'Stavy / Abeceda / Začiatok / Akceptačné',
			ax: 'Vyplň tieto polia pre formálny popis DKA. Automaticky sa aktualizujú pri úprave diagramu.',
			ay: 'Formát',
			az: 'Jeden prechod na riadok: odkiaľ,znak,kam — napr. q0,a,q1',
			aA: 'Generovať diagram',
			aB: 'Automaticky zostaví diagram z napísaného kódu, stavy rozmiestnení do kruhu.',
			aC: 'Riadky prechodov určujú, či na každej pozícii existuje platný prechod.',
			aD: 'Aktívna šípka na diagrame ukazuje, ktorý znak bol práve prečítaný.',
			aE: 'Index',
			aF: 'Ukazuje, na ktorej pozícii vstupného slova sa simulácia nachádza (napr. 2 / 4).',
			aG: 'Počíta znaky slova zadaného v poli Testovacieho reťazca.',
			aH: 'Načítať',
			aI: 'Vyber diagram zo ULOŽENÝCH DIAGRAMOV alebo načítať .dfa súbor a bude načítaný. Načítaný diagram a kód možno upravovať, ale treba ich znova uložiť.',
			aJ: '⚙ Načítať DKA',
			aK: 'Načíta DKA a nastaví simuláciu na začiatočný stav. Stlač toto tlačidlo ako prvé.',
			aL: 'Posun',
			aM: 'Ťahaj prázdnu plochu plátna na posun pohľadu.',
			aN: '>> Prečítať všetko',
			aO: 'Spracuje celé slovo naraz a zobrazí výsledok.',
			aP: 'Zopakuje predtým vratenú akciu. Môžeš použiť aj Ctrl+Y.',
			aQ: '↪ Znova',
			aR: '✎ Premenovať',
			aS: 'Použi tlačidlo v zozname stavov alebo dvojklikni priamo na stav.',
			aT: '<< Reset',
			aU: 'Resetuje simuláciu na začiatok.',
			aV: '▶ Spustiť / ⏹ Zastaviť',
			aW: 'Spustiť: automaticky prehráva simuláciu nastavenou rýchlosťou. Zastaviť: pozastaví ju.',
			aX: 'S / A / X',
			aY: 'S = nastaviť ako začiatočný stav, A = prepnúť akceptačný stav, × = odstrániť stav.',
			aZ: 'Stiahnúť SVG',
			a_: 'Stiahne stavový diagram ako .svg súbor.',
			a$: 'Uložiť',
			a0: 'Uloží aktuálny diagram na neskoršie použitie. Môžeš ho premenovať, stiahnúť ako .dfa súbor alebo odstrániť.',
			a1: ' Uložiť a načítať',
			a2: '✋ Vybrať',
			a3: 'Ťahaj stavy na presun. Dvojklikom na stav ho premenuj.',
			a4: 'Simulácia',
			a5: '🐌 Posuvník rýchlosti 🐎',
			a6: 'Nastav rýchlosť automatického prehrávania (pomalšie ↔ rýchlejšie).',
			a7: 'Závisí od toho, či v poli prechodov existuje platný prechod pre aktuálny vstupný znak.',
			a8: 'Zvýraznený stav na plátne (zelený alebo červený okraj) ukazuje, kde sa simulácia aktuálne nachádza.',
			a9: 'Stav',
			ba: 'Textový popis aktuálnej udalosti. Zelená = PRIJATÝ, Červená = ODMIETNUTÝ, Fialová = prebieha.',
			bb: 'Zobrazený v paneli Testovacieho reťazca, priebežne sa aktualizuje počas simulácie.',
			bc: 'Čo znamenajú stavové ukazovatele?',
			bd: 'Testové slovo',
			be: 'Zadaj slovo, ktoré chceš otestovať (napr. \"aab\").',
			bf: '📖 Návod a ovládanie',
			bg: 'Vráti poslednú zmenu diagramu (až 50 krokov). Môžeš použiť aj Ctrl+Z.',
			bh: '↩ Späť',
			bi: 'Späť / Znova / Vymazať',
			bj: '+ / − / ⌂',
			bk: 'Priblížiť, oddialiť a resetovať pohľad.',
			bl: '📂 Importovať .dfa súbor',
			bm: 'Načítať diagram z počítača',
			bn: 'Index: ',
			bo: 'Načítať',
			bp: '⚙ Načítať DKA',
			br: 'X',
			bs: '↩ Načítať',
			bt: 'Načítať diagram',
			bu: 'Žiadne uložené diagramy.\nNiečo vytvor a ulož!',
			bv: '✎',
			bw: 'Uložiť',
			bx: 'Pomenuj uloženie…',
			by: 'Uložiť diagram',
			bz: 'Uložené diagramy',
			bA: 'Tvoje uložené diagramy',
			bD: '📋 Otvoriť formulár',
			bE: '>> Prečítať všetko',
			bF: 'Znova',
			bG: 'Premenovať',
			bH: 'Premenovať',
			bI: 'Premenovať stav: ',
			bJ: '<< Reset',
			bK: 'Resetovať pohľad',
			bL: '▶ Spustiť',
			bM: 'Uložiť',
			bN: 'Vybrať/Presunúť',
			bO: 'Automatické prečíslovanie stavov pri vymazaní',
			bP: 'Pri vymazaní q2 sa všetky vyššie stavy (q3, q4…) premenujú o jedna nadol.',
			bQ: 'Jazyk',
			bR: 'Nastavenia',
			bT: function (st) {
				return '✔ PRIJATÝ — akceptačný stav: ' + st;
			},
			bU: function (n) {
				return 'Stav pridaný: ' + n;
			},
			bV: 'Automatický beh obnovený...',
			bW: 'Automatický beh spustený...',
			bX: 'Späť na začiatok.',
			bY: 'Všetko vymazané.',
			bZ: function (n) {
				return 'Stav odstránený: ' + n;
			},
			b_: F2(
				function (fr, to) {
					return 'Prechod odstránený: ' + (fr + (' → ' + to));
				}),
			b$: 'Diagram vygenerovaný z kódu.',
			b0: 'Pridaj stavy kliknutím na plátno.',
			b1: 'Najprv načítaj DKA!',
			b2: function (w) {
				return 'Načítané. Pripravené na test: \"' + (w + '\"');
			},
			b3: F2(
				function (st, ch) {
					return '✘ ODMIETNUTÝ: žiadny prechod z ' + (st + (' pre \'' + (ch + '\'')));
				}),
			b4: 'Nie je čo zopakovať.',
			b5: 'Nie je čo vrátiť.',
			b6: 'Pozastavené.',
			b7: F2(
				function (ch, st) {
					return 'Prečítaný \'' + (ch + ('\' → prechod do ' + st));
				}),
			b8: 'Zopakované.',
			b9: function (st) {
				return '✘ ODMIETNUTÝ — nie je v akceptačnom stave (aktuálny: ' + (st + ')');
			},
			ca: F2(
				function (o, nw) {
					return 'Premenovaný: ' + (o + (' → ' + nw));
				}),
			cb: 'Reset. Stlač \'Načítať DKA\' pre začiatok.',
			cc: function (n) {
				return 'Začiatočný stav nastavený: ' + n;
			},
			cd: function (st) {
				return 'Krok späť do ' + st;
			},
			ce: F3(
				function (fr, ch, to) {
					return fr + (' --[' + (ch + (']--> ' + to)));
				}),
			cf: 'Vrátené.',
			cg: 'Rýchlosť',
			ch: 'Začiatočný stav',
			ci: 'Stavový diagram',
			cj: '✎ premenovať · S začiatočný · A akceptačný · X odstrániť',
			ck: function (n) {
				return 'Stavy  (' + ($elm$core$String$fromInt(n) + ')');
			},
			cl: 'Stavy',
			cm: F2(
				function (sc, tc) {
					return $elm$core$String$fromInt(sc) + (' stav' + (((sc === 1) ? '' : 'y') + ('  ·  ' + ($elm$core$String$fromInt(tc) + (' prechod' + ((tc === 1) ? '' : 'y'))))));
				}),
			cn: 'Panel kódu: ',
			co: 'Stavový diagram: ',
			cp: 'Stav: ',
			cq: 'Testovací reťazec: ',
			cr: '> Krok',
			cs: 'Krok po kroku',
			ct: '⏹ Zastaviť',
			cu: 'Testovací reťazec',
			cw: 'Odstránené',
			cx: function (n) {
				return 'Exportované \"' + (n + '.dfa\"');
			},
			cy: 'Nepodarilo sa načítať súbor.',
			cz: function (n) {
				return 'Importované \"' + (n + '\"');
			},
			cA: function (n) {
				return 'Načítané \"' + (n + '\"');
			},
			cB: 'Zatiaľ nič na uloženie.',
			cC: function (n) {
				return 'Uložené \"' + (n + '\"');
			},
			cD: 'Znak(y) pre tento prechod(použi | pre viac, napr. a|b|c):',
			cE: 'Prechod: ',
			cG: 'Prechody',
			cH: 'Späť',
			cI: 'Zobrazenie',
			cJ: 'Čo je táto aplikácia?',
			cK: 'Tento nástroj je interaktívny simulátor Deterministického Konečného Automatu (DKA) určený pre študentov vysokých škôl. Cieľom je pomôcť študentom vizuálne a interaktívne pochopiť, ako automaty fungujú v rámci predmetov teoretickej informatiky — ako DKA spracúva vstupné slovo, kedy ho prijme a kedy odmietne.',
			cL: 'Priblížiť',
			cM: 'Oddialiť'
		};
	}
};
var $author$project$Update$defaultModel = {
	cN: _List_Nil,
	$7: false,
	dp: false,
	dq: 800,
	cQ: '',
	S: '',
	dt: false,
	cR: '',
	T: '',
	cS: '',
	du: $elm$core$Maybe$Nothing,
	dx: $elm$core$Maybe$Nothing,
	dy: 1,
	dC: $elm$core$Maybe$Nothing,
	dF: false,
	dG: false,
	dH: 0,
	dI: 360,
	dP: 0,
	dQ: 0,
	dR: 0,
	dS: 0,
	dT: '',
	dU: '',
	dW: _List_Nil,
	dX: '',
	dY: '',
	dZ: $elm$core$Maybe$Nothing,
	d_: $elm$core$Maybe$Nothing,
	d0: '',
	D: _List_Nil,
	d2: false,
	d3: false,
	d4: false,
	d5: false,
	d6: false,
	d7: false,
	d8: _List_Nil,
	d9: $author$project$Lang$translations(0).b0,
	ea: 0,
	de: '',
	ec: 0,
	ed: false,
	df: $elm$core$Dict$empty,
	ei: 0,
	ej: 0,
	ek: 1.0,
	el: false,
	cv: '',
	en: '',
	E: false,
	eo: 'a',
	ep: $elm$core$Maybe$Nothing,
	cF: $elm$core$Dict$empty,
	eq: _List_Nil
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$init = function (_v0) {
	return _Utils_Tuple2($author$project$Update$defaultModel, $elm$core$Platform$Cmd$none);
};
var $author$project$Types$AutoTick = function (a) {
	return {$: 38, a: a};
};
var $author$project$Types$ImportFileContent = function (a) {
	return {$: 75, a: a};
};
var $author$project$Types$KeyDelete = {$: 53};
var $author$project$Types$NoOp = {$: 32};
var $author$project$Types$Redo = {$: 34};
var $author$project$Types$StorageLoaded = function (a) {
	return {$: 76, a: a};
};
var $author$project$Types$Undo = {$: 33};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $author$project$Types$SavedDiagram = F4(
	function (id, name, savedAt, data) {
		return {cU: data, c0: id, bB: name, d1: savedAt};
	});
var $author$project$Types$DiagramData = F5(
	function (states, alphabet, start, accept, transitions) {
		return {dl: accept, dm: alphabet, eb: start, ef: states, cF: transitions};
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$map5 = _Json_map5;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Main$decodeDiagramData = A6(
	$elm$json$Json$Decode$map5,
	$author$project$Types$DiagramData,
	A2($elm$json$Json$Decode$field, 'states', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'alphabet', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'start', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'accept', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'transitions', $elm$json$Json$Decode$string));
var $elm$json$Json$Decode$map4 = _Json_map4;
var $author$project$Main$decodeSaved = A5(
	$elm$json$Json$Decode$map4,
	$author$project$Types$SavedDiagram,
	A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'savedAt', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'data', $author$project$Main$decodeDiagramData));
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$time$Time$Every = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$State = F2(
	function (taggers, processes) {
		return {c8: processes, dh: taggers};
	});
var $elm$time$Time$init = $elm$core$Task$succeed(
	A2($elm$time$Time$State, $elm$core$Dict$empty, $elm$core$Dict$empty));
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$time$Time$addMySub = F2(
	function (_v0, state) {
		var interval = _v0.a;
		var tagger = _v0.b;
		var _v1 = A2($elm$core$Dict$get, interval, state);
		if (_v1.$ === 1) {
			return A3(
				$elm$core$Dict$insert,
				interval,
				_List_fromArray(
					[tagger]),
				state);
		} else {
			var taggers = _v1.a;
			return A3(
				$elm$core$Dict$insert,
				interval,
				A2($elm$core$List$cons, tagger, taggers),
				state);
		}
	});
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$time$Time$Name = function (a) {
	return {$: 0, a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$setInterval = _Time_setInterval;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$time$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		if (!intervals.b) {
			return $elm$core$Task$succeed(processes);
		} else {
			var interval = intervals.a;
			var rest = intervals.b;
			var spawnTimer = $elm$core$Process$spawn(
				A2(
					$elm$time$Time$setInterval,
					interval,
					A2($elm$core$Platform$sendToSelf, router, interval)));
			var spawnRest = function (id) {
				return A3(
					$elm$time$Time$spawnHelp,
					router,
					rest,
					A3($elm$core$Dict$insert, interval, id, processes));
			};
			return A2($elm$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var $elm$time$Time$onEffects = F3(
	function (router, subs, _v0) {
		var processes = _v0.c8;
		var rightStep = F3(
			function (_v6, id, _v7) {
				var spawns = _v7.a;
				var existing = _v7.b;
				var kills = _v7.c;
				return _Utils_Tuple3(
					spawns,
					existing,
					A2(
						$elm$core$Task$andThen,
						function (_v5) {
							return kills;
						},
						$elm$core$Process$kill(id)));
			});
		var newTaggers = A3($elm$core$List$foldl, $elm$time$Time$addMySub, $elm$core$Dict$empty, subs);
		var leftStep = F3(
			function (interval, taggers, _v4) {
				var spawns = _v4.a;
				var existing = _v4.b;
				var kills = _v4.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, interval, spawns),
					existing,
					kills);
			});
		var bothStep = F4(
			function (interval, taggers, id, _v3) {
				var spawns = _v3.a;
				var existing = _v3.b;
				var kills = _v3.c;
				return _Utils_Tuple3(
					spawns,
					A3($elm$core$Dict$insert, interval, id, existing),
					kills);
			});
		var _v1 = A6(
			$elm$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			processes,
			_Utils_Tuple3(
				_List_Nil,
				$elm$core$Dict$empty,
				$elm$core$Task$succeed(0)));
		var spawnList = _v1.a;
		var existingDict = _v1.b;
		var killTask = _v1.c;
		return A2(
			$elm$core$Task$andThen,
			function (newProcesses) {
				return $elm$core$Task$succeed(
					A2($elm$time$Time$State, newTaggers, newProcesses));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$time$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _v0 = A2($elm$core$Dict$get, interval, state.dh);
		if (_v0.$ === 1) {
			return $elm$core$Task$succeed(state);
		} else {
			var taggers = _v0.a;
			var tellTaggers = function (time) {
				return $elm$core$Task$sequence(
					A2(
						$elm$core$List$map,
						function (tagger) {
							return A2(
								$elm$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						taggers));
			};
			return A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$succeed(state);
				},
				A2($elm$core$Task$andThen, tellTaggers, $elm$time$Time$now));
		}
	});
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$time$Time$subMap = F2(
	function (f, _v0) {
		var interval = _v0.a;
		var tagger = _v0.b;
		return A2(
			$elm$time$Time$Every,
			interval,
			A2($elm$core$Basics$composeL, f, tagger));
	});
_Platform_effectManagers['Time'] = _Platform_createManager($elm$time$Time$init, $elm$time$Time$onEffects, $elm$time$Time$onSelfMsg, 0, $elm$time$Time$subMap);
var $elm$time$Time$subscription = _Platform_leaf('Time');
var $elm$time$Time$every = F2(
	function (interval, tagger) {
		return $elm$time$Time$subscription(
			A2($elm$time$Time$Every, interval, tagger));
	});
var $author$project$Main$fileContent = _Platform_incomingPort('fileContent', $elm$json$Json$Decode$string);
var $author$project$Main$keyboardMsg = _Platform_incomingPort('keyboardMsg', $elm$json$Json$Decode$string);
var $elm$json$Json$Decode$list = _Json_decodeList;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$Main$storageIn = _Platform_incomingPort('storageIn', $elm$json$Json$Decode$value);
var $author$project$Main$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				model.dp ? A2($elm$time$Time$every, 2100 - model.dq, $author$project$Types$AutoTick) : $elm$core$Platform$Sub$none,
				$author$project$Main$storageIn(
				function (val) {
					var _v0 = A2(
						$elm$json$Json$Decode$decodeValue,
						$elm$json$Json$Decode$list($author$project$Main$decodeSaved),
						val);
					if (!_v0.$) {
						var diagrams = _v0.a;
						return $author$project$Types$StorageLoaded(diagrams);
					} else {
						return $author$project$Types$StorageLoaded(_List_Nil);
					}
				}),
				$author$project$Main$fileContent($author$project$Types$ImportFileContent),
				$author$project$Main$keyboardMsg(
				function (key) {
					switch (key) {
						case 'undo':
							return $author$project$Types$Undo;
						case 'redo':
							return $author$project$Types$Redo;
						case 'delete':
							return $author$project$Types$KeyDelete;
						default:
							return $author$project$Types$NoOp;
					}
				})
			]));
};
var $author$project$Types$ToastTimeout = {$: 78};
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Main$downloadFile = _Platform_outgoingPort(
	'downloadFile',
	function ($) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'content',
					$elm$json$Json$Encode$string($.cT)),
					_Utils_Tuple2(
					'filename',
					$elm$json$Json$Encode$string($.cY))
				]));
	});
var $author$project$Main$encodeDiagramData = function (d) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'states',
				$elm$json$Json$Encode$string(d.ef)),
				_Utils_Tuple2(
				'alphabet',
				$elm$json$Json$Encode$string(d.dm)),
				_Utils_Tuple2(
				'start',
				$elm$json$Json$Encode$string(d.eb)),
				_Utils_Tuple2(
				'accept',
				$elm$json$Json$Encode$string(d.dl)),
				_Utils_Tuple2(
				'transitions',
				$elm$json$Json$Encode$string(d.cF))
			]));
};
var $author$project$Main$encodeSaved = function (s) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'id',
				$elm$json$Json$Encode$string(s.c0)),
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(s.bB)),
				_Utils_Tuple2(
				'savedAt',
				$elm$json$Json$Encode$string(s.d1)),
				_Utils_Tuple2(
				'data',
				$author$project$Main$encodeDiagramData(s.cU))
			]));
};
var $author$project$Main$exportSvg = _Platform_outgoingPort('exportSvg', $elm$json$Json$Encode$string);
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $author$project$Update$formatDfaText = function (d) {
	return A2(
		$elm$core$String$join,
		'\n',
		_List_fromArray(
			['states: ' + d.ef, 'alphabet: ' + d.dm, 'start: ' + d.eb, 'accept: ' + d.dl, 'transitions:', d.cF]));
};
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $elm$core$Basics$not = _Basics_not;
var $author$project$Main$savesToStorage = _Platform_outgoingPort('savesToStorage', $elm$core$Basics$identity);
var $author$project$Main$sendLanguage = _Platform_outgoingPort('sendLanguage', $elm$json$Json$Encode$string);
var $elm$core$Process$sleep = _Process_sleep;
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$Main$triggerFileInput = _Platform_outgoingPort(
	'triggerFileInput',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Types$LoadDFAFromSave = F5(
	function (a, b, c, d, e) {
		return {$: 50, a: a, b: b, c: c, d: d, e: e};
	});
var $author$project$Lang$SK = 1;
var $author$project$Types$SelectTool = 0;
var $author$project$Update$applySnapshot = F2(
	function (snap, model) {
		return _Utils_update(
			model,
			{cN: snap.cN, de: snap.de, ec: snap.ec, df: snap.df, cF: snap.cF});
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $author$project$Simulation$checkAcceptance = F2(
	function (t, model) {
		var _v0 = model.du;
		if (_v0.$ === 1) {
			return model;
		} else {
			var current = _v0.a;
			return A2($elm$core$List$member, current, model.cN) ? _Utils_update(
				model,
				{
					d9: t.bT(current)
				}) : _Utils_update(
				model,
				{
					d9: t.b9(current)
				});
		}
	});
var $elm$core$Basics$clamp = F3(
	function (low, high, number) {
		return (_Utils_cmp(number, low) < 0) ? low : ((_Utils_cmp(number, high) > 0) ? high : number);
	});
var $author$project$Update$diagramDataFromModel = function (model) {
	return {dl: model.cQ, dm: model.S, eb: model.cR, ef: model.T, cF: model.cS};
};
var $elm$core$Dict$filter = F2(
	function (isGood, dict) {
		return A3(
			$elm$core$Dict$foldl,
			F3(
				function (k, v, d) {
					return A2(isGood, k, v) ? A3($elm$core$Dict$insert, k, v, d) : d;
				}),
			$elm$core$Dict$empty,
			dict);
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$core$Basics$cos = _Basics_cos;
var $elm$core$String$lines = _String_lines;
var $author$project$Helpers$listUnique = A2(
	$elm$core$List$foldr,
	F2(
		function (x, acc) {
			return A2($elm$core$List$member, x, acc) ? acc : A2($elm$core$List$cons, x, acc);
		}),
	_List_Nil);
var $elm$core$Basics$pi = _Basics_pi;
var $elm$core$Basics$sin = _Basics_sin;
var $elm$core$String$trim = _String_trim;
var $author$project$CodeSync$generateDiagramFromCode = function (model) {
	var t = $author$project$Lang$translations(model.dH);
	var parseTransLine = function (line) {
		var parts = A2(
			$elm$core$List$map,
			$elm$core$String$trim,
			A2($elm$core$String$split, ',', line));
		if (((parts.b && parts.b.b) && parts.b.b.b) && (!parts.b.b.b.b)) {
			var fr = parts.a;
			var _v4 = parts.b;
			var ch = _v4.a;
			var _v5 = _v4.b;
			var to = _v5.a;
			if ((fr !== '') && ((ch !== '') && (to !== ''))) {
				var symbols = A2(
					$elm$core$List$filter,
					$elm$core$Basics$neq(''),
					A2(
						$elm$core$List$map,
						$elm$core$String$trim,
						A2($elm$core$String$split, '|', ch)));
				return $elm$core$Maybe$Just(
					_Utils_Tuple3(fr, symbols, to));
			} else {
				return $elm$core$Maybe$Nothing;
			}
		} else {
			return $elm$core$Maybe$Nothing;
		}
	};
	var parsedLines = A2(
		$elm$core$List$filterMap,
		parseTransLine,
		$elm$core$String$lines(model.cS));
	var parsedTrans = $elm$core$Dict$fromList(
		A2(
			$elm$core$List$concatMap,
			function (_v2) {
				var fr = _v2.a;
				var syms = _v2.b;
				var to = _v2.c;
				return A2(
					$elm$core$List$map,
					function (sym) {
						return _Utils_Tuple2(
							_Utils_Tuple2(fr, sym),
							to);
					},
					syms);
			},
			parsedLines));
	var newStart = $elm$core$String$trim(model.cR);
	var startStates = (newStart !== '') ? _List_fromArray(
		[newStart]) : _List_Nil;
	var impliedFromTransitions = A2(
		$elm$core$List$concatMap,
		function (_v1) {
			var fr = _v1.a;
			var to = _v1.c;
			return _List_fromArray(
				[fr, to]);
		},
		parsedLines);
	var impliedAlphabet = A2(
		$elm$core$List$concatMap,
		function (_v0) {
			var syms = _v0.b;
			return syms;
		},
		parsedLines);
	var explicitStates = A2(
		$elm$core$List$filter,
		$elm$core$Basics$neq(''),
		A2(
			$elm$core$List$map,
			$elm$core$String$trim,
			A2($elm$core$String$split, ',', model.T)));
	var explicitAlphabet = A2(
		$elm$core$List$filter,
		$elm$core$Basics$neq(''),
		A2(
			$elm$core$List$map,
			$elm$core$String$trim,
			A2($elm$core$String$split, ',', model.S)));
	var extraAlphabet = $author$project$Helpers$listUnique(
		A2(
			$elm$core$List$filter,
			function (s) {
				return !A2($elm$core$List$member, s, explicitAlphabet);
			},
			impliedAlphabet));
	var mergedAlphabet = _Utils_ap(explicitAlphabet, extraAlphabet);
	var cyC = 260;
	var cxC = 450;
	var acceptList = A2(
		$elm$core$List$filter,
		$elm$core$Basics$neq(''),
		A2(
			$elm$core$List$map,
			$elm$core$String$trim,
			A2($elm$core$String$split, ',', model.cQ)));
	var allMentioned = _Utils_ap(
		startStates,
		_Utils_ap(acceptList, impliedFromTransitions));
	var extraStates = $author$project$Helpers$listUnique(
		A2(
			$elm$core$List$filter,
			function (s) {
				return !A2($elm$core$List$member, s, explicitStates);
			},
			allMentioned));
	var stateNames = _Utils_ap(explicitStates, extraStates);
	var n = $elm$core$List$length(stateNames);
	var radius = (n <= 1) ? 0 : 190;
	var positions = $elm$core$Dict$fromList(
		A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, name) {
					var angle = (((2 * $elm$core$Basics$pi) * i) / n) - ($elm$core$Basics$pi / 2);
					var x = cxC + (radius * $elm$core$Basics$cos(angle));
					var y = cyC + (radius * $elm$core$Basics$sin(angle));
					return _Utils_Tuple2(
						name,
						{et: x, eu: y});
				}),
			stateNames));
	return _Utils_update(
		model,
		{
			cN: acceptList,
			S: A2($elm$core$String$join, ', ', mergedAlphabet),
			T: A2($elm$core$String$join, ', ', stateNames),
			du: $elm$core$Maybe$Nothing,
			d8: _List_Nil,
			d9: t.dv,
			ea: 0,
			de: newStart,
			ec: $elm$core$List$length(stateNames),
			df: positions,
			cF: parsedTrans
		});
};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $elm$core$String$replace = F3(
	function (before, after, string) {
		return A2(
			$elm$core$String$join,
			after,
			A2($elm$core$String$split, before, string));
	});
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Update$parseDfaText = function (text) {
	var ls = $elm$core$String$lines(
		A3($elm$core$String$replace, '\r', '', text));
	var transStart = A2(
		$elm$core$Maybe$withDefault,
		-1,
		A2(
			$elm$core$Maybe$map,
			$elm$core$Tuple$first,
			$elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (_v0) {
						var l = _v0.b;
						return $elm$core$String$trim(l) === 'transitions:';
					},
					A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, ls)))));
	var transitions = (transStart >= 0) ? $elm$core$String$trim(
		A2(
			$elm$core$String$join,
			'\n',
			A2($elm$core$List$drop, transStart + 1, ls))) : '';
	var get = function (prefix) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2(
				$elm$core$Maybe$map,
				A2(
					$elm$core$Basics$composeR,
					$elm$core$String$dropLeft(
						$elm$core$String$length(prefix)),
					$elm$core$String$trim),
				$elm$core$List$head(
					A2(
						$elm$core$List$filter,
						$elm$core$String$startsWith(prefix),
						ls))));
	};
	return {
		dl: get('accept: '),
		dm: get('alphabet: '),
		eb: get('start: '),
		ef: get('states: '),
		cF: transitions
	};
};
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $author$project$Update$renameStateEverywhere = F3(
	function (old, newStateName, model) {
		var renameKey = function (k) {
			return _Utils_eq(k, old) ? newStateName : k;
		};
		var newTransitions = $elm$core$Dict$fromList(
			A2(
				$elm$core$List$map,
				function (_v1) {
					var _v2 = _v1.a;
					var fr = _v2.a;
					var ch = _v2.b;
					var to = _v1.b;
					return _Utils_Tuple2(
						_Utils_Tuple2(
							renameKey(fr),
							ch),
						renameKey(to));
				},
				$elm$core$Dict$toList(model.cF)));
		var newStart = renameKey(model.de);
		var newPositions = $elm$core$Dict$fromList(
			A2(
				$elm$core$List$map,
				function (_v0) {
					var k = _v0.a;
					var v = _v0.b;
					return _Utils_Tuple2(
						renameKey(k),
						v);
				},
				$elm$core$Dict$toList(model.df)));
		var newAccept = A2($elm$core$List$map, renameKey, model.cN);
		return _Utils_update(
			model,
			{cN: newAccept, de: newStart, df: newPositions, cF: newTransitions});
	});
var $author$project$Update$reorderAfterDelete = F2(
	function (deleted, model) {
		var _v0 = $elm$core$String$toInt(
			A2($elm$core$String$dropLeft, 1, deleted));
		if (_v0.$ === 1) {
			return model;
		} else {
			var deletedIdx = _v0.a;
			var maxIdx = A2(
				$elm$core$Maybe$withDefault,
				-1,
				$elm$core$List$maximum(
					A2(
						$elm$core$List$filterMap,
						function (k) {
							return $elm$core$String$toInt(
								A2($elm$core$String$dropLeft, 1, k));
						},
						$elm$core$Dict$keys(model.df))));
			var indicesToShift = A2($elm$core$List$range, deletedIdx + 1, maxIdx + 1);
			return A3(
				$elm$core$List$foldl,
				F2(
					function (idx, m) {
						var oldName = 'q' + $elm$core$String$fromInt(idx);
						var newName = 'q' + $elm$core$String$fromInt(idx - 1);
						return A2($elm$core$Dict$member, oldName, m.df) ? A3($author$project$Update$renameStateEverywhere, oldName, newName, m) : m;
					}),
				model,
				indicesToShift);
		}
	});
var $author$project$Simulation$stepOnce = F2(
	function (t, model) {
		var _v0 = model.du;
		if (_v0.$ === 1) {
			return _Utils_update(
				model,
				{d9: t.b1});
		} else {
			var current = _v0.a;
			if (_Utils_cmp(
				model.ea,
				$elm$core$String$length(model.cv)) > -1) {
				return A2($author$project$Simulation$checkAcceptance, t, model);
			} else {
				var ch = A3($elm$core$String$slice, model.ea, model.ea + 1, model.cv);
				var next = A2(
					$elm$core$Dict$get,
					_Utils_Tuple2(current, ch),
					model.cF);
				if (!next.$) {
					var nextState = next.a;
					return _Utils_update(
						model,
						{
							du: $elm$core$Maybe$Just(nextState),
							d8: _Utils_ap(
								model.d8,
								_List_fromArray(
									[
										_Utils_Tuple2(nextState, model.ea + 1)
									])),
							d9: A2(t.b7, ch, nextState),
							ea: model.ea + 1
						});
				} else {
					return _Utils_update(
						model,
						{
							du: $elm$core$Maybe$Nothing,
							d9: A2(t.b3, current, ch)
						});
				}
			}
		}
	});
var $author$project$Simulation$runToEnd = F2(
	function (t, model) {
		var helper = function (m) {
			helper:
			while (true) {
				if (_Utils_cmp(
					m.ea,
					$elm$core$String$length(m.cv)) > -1) {
					return A2($author$project$Simulation$checkAcceptance, t, m);
				} else {
					var _v0 = m.du;
					if (_v0.$ === 1) {
						return m;
					} else {
						var stepped = A2($author$project$Simulation$stepOnce, t, m);
						if (_Utils_eq(stepped.du, $elm$core$Maybe$Nothing)) {
							return stepped;
						} else {
							var $temp$m = stepped;
							m = $temp$m;
							continue helper;
						}
					}
				}
			}
		};
		return helper(model);
	});
var $author$project$Update$snapshotDiagram = function (model) {
	return {cN: model.cN, de: model.de, ec: model.ec, df: model.df, cF: model.cF};
};
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$Update$saveUndo = function (model) {
	return _Utils_update(
		model,
		{
			dW: _List_Nil,
			eq: A2(
				$elm$core$List$take,
				50,
				A2(
					$elm$core$List$cons,
					$author$project$Update$snapshotDiagram(model),
					model.eq))
		});
};
var $author$project$Update$showToast = F2(
	function (msg, model) {
		return _Utils_update(
			model,
			{en: msg, E: true});
	});
var $author$project$Helpers$listLast = function (list) {
	listLast:
	while (true) {
		if (!list.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!list.b.b) {
				var x = list.a;
				return $elm$core$Maybe$Just(x);
			} else {
				var rest = list.b;
				var $temp$list = rest;
				list = $temp$list;
				continue listLast;
			}
		}
	}
};
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $author$project$Simulation$stepBack = F2(
	function (t, model) {
		var histLen = $elm$core$List$length(model.d8);
		if (histLen <= 1) {
			return _Utils_update(
				model,
				{
					du: $elm$core$Maybe$Just(model.de),
					d8: _List_fromArray(
						[
							_Utils_Tuple2(model.de, 0)
						]),
					d9: t.bX,
					ea: 0
				});
		} else {
			var newHistory = A2($elm$core$List$take, histLen - 1, model.d8);
			var prev = A2(
				$elm$core$Maybe$withDefault,
				_Utils_Tuple2(model.de, 0),
				$author$project$Helpers$listLast(newHistory));
			return _Utils_update(
				model,
				{
					du: $elm$core$Maybe$Just(prev.a),
					d8: newHistory,
					d9: t.cd(prev.a),
					ea: prev.b
				});
		}
	});
var $author$project$CodeSync$syncCodeFromDiagram = function (model) {
	var transStr = A2(
		$elm$core$String$join,
		'\n',
		A2(
			$elm$core$List$map,
			function (_v3) {
				var _v4 = _v3.a;
				var fr = _v4.a;
				var to = _v4.b;
				var syms = _v3.b;
				return fr + (',' + (A2($elm$core$String$join, '|', syms) + (',' + to)));
			},
			$elm$core$Dict$toList(
				A3(
					$elm$core$List$foldr,
					F2(
						function (_v0, acc) {
							var _v1 = _v0.a;
							var fr = _v1.a;
							var ch = _v1.b;
							var to = _v0.b;
							var key = _Utils_Tuple2(fr, to);
							var _v2 = A2($elm$core$Dict$get, key, acc);
							if (!_v2.$) {
								var syms = _v2.a;
								return A3(
									$elm$core$Dict$insert,
									key,
									A2($elm$core$List$cons, ch, syms),
									acc);
							} else {
								return A3(
									$elm$core$Dict$insert,
									key,
									_List_fromArray(
										[ch]),
									acc);
							}
						}),
					$elm$core$Dict$empty,
					$elm$core$Dict$toList(model.cF)))));
	var stateNames = $elm$core$Dict$keys(model.df);
	var alphabet = A2(
		$elm$core$String$join,
		', ',
		$author$project$Helpers$listUnique(
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$second,
				$elm$core$Dict$keys(model.cF))));
	var acceptStr = A2($elm$core$String$join, ', ', model.cN);
	return _Utils_update(
		model,
		{
			cQ: acceptStr,
			S: alphabet,
			cR: model.de,
			T: A2($elm$core$String$join, ', ', stateNames),
			cS: transStr
		});
};
var $author$project$Update$update = F2(
	function (msg, model) {
		update:
		while (true) {
			var t = $author$project$Lang$translations(model.dH);
			var loadedModel = (!_Utils_eq(model.du, $elm$core$Maybe$Nothing)) ? model : _Utils_update(
				model,
				{
					du: $elm$core$Maybe$Just(model.de),
					d8: _List_fromArray(
						[
							_Utils_Tuple2(model.de, 0)
						]),
					d9: t.b2(model.cv),
					ea: 0
				});
			switch (msg.$) {
				case 49:
					var newLang = function () {
						var _v1 = model.dH;
						if (!_v1) {
							return 1;
						} else {
							return 0;
						}
					}();
					return _Utils_update(
						model,
						{dH: newLang});
				case 50:
					var states = msg.a;
					var alphabet = msg.b;
					var start = msg.c;
					var accept = msg.d;
					var trans = msg.e;
					var loaded = _Utils_update(
						model,
						{cQ: accept, S: alphabet, cR: start, T: states, cS: trans});
					return $author$project$CodeSync$generateDiagramFromCode(
						$author$project$Update$saveUndo(loaded));
				case 0:
					var x = msg.a;
					var y = msg.b;
					var _v2 = model.dy;
					if (_v2 === 1) {
						var m0 = $author$project$Update$saveUndo(model);
						var nextIdx = A2(
							$elm$core$Maybe$withDefault,
							0,
							A2(
								$elm$core$Maybe$map,
								function (n) {
									return n + 1;
								},
								$elm$core$List$maximum(
									A2(
										$elm$core$List$filterMap,
										function (k) {
											return A2($elm$core$String$startsWith, 'q', k) ? $elm$core$String$toInt(
												A2($elm$core$String$dropLeft, 1, k)) : $elm$core$Maybe$Nothing;
										},
										$elm$core$Dict$keys(m0.df)))));
						var name = 'q' + $elm$core$String$fromInt(nextIdx);
						var newPositions = A3(
							$elm$core$Dict$insert,
							name,
							{et: x, eu: y},
							m0.df);
						var newStart = (m0.de === '') ? name : m0.de;
						return $author$project$CodeSync$syncCodeFromDiagram(
							_Utils_update(
								m0,
								{
									d9: t.bU(name),
									de: newStart,
									ec: nextIdx + 1,
									df: newPositions
								}));
					} else {
						return model;
					}
				case 1:
					var stateName = msg.a;
					var _v3 = model.dy;
					switch (_v3) {
						case 2:
							var _v4 = model.ep;
							if (_v4.$ === 1) {
								return _Utils_update(
									model,
									{
										d9: function () {
											var _v5 = model.dH;
											if (!_v5) {
												return 'Now click the target state (from: ';
											} else {
												return 'Klikni na cieľový stav (od: ';
											}
										}() + (stateName + ')'),
										ep: $elm$core$Maybe$Just(stateName)
									});
							} else {
								var fromState = _v4.a;
								return _Utils_update(
									model,
									{dT: fromState, dU: stateName, d7: true, ep: $elm$core$Maybe$Nothing});
							}
						case 3:
							var m0 = $author$project$Update$saveUndo(model);
							var newAccept = A2(
								$elm$core$List$filter,
								$elm$core$Basics$neq(stateName),
								m0.cN);
							var newPos = A2($elm$core$Dict$remove, stateName, m0.df);
							var newStart = _Utils_eq(m0.de, stateName) ? '' : m0.de;
							var newTrans = A2(
								$elm$core$Dict$filter,
								F2(
									function (_v6, to) {
										var fr = _v6.a;
										return (!_Utils_eq(fr, stateName)) && (!_Utils_eq(to, stateName));
									}),
								m0.cF);
							var m1 = _Utils_update(
								m0,
								{
									cN: newAccept,
									d9: t.bZ(stateName),
									de: newStart,
									df: newPos,
									cF: newTrans
								});
							return $author$project$CodeSync$syncCodeFromDiagram(
								model.$7 ? A2($author$project$Update$reorderAfterDelete, stateName, m1) : m1);
						case 0:
							return model;
						default:
							return model;
					}
				case 2:
					var tool = msg.a;
					return _Utils_update(
						model,
						{
							dx: $elm$core$Maybe$Nothing,
							dy: tool,
							d9: function () {
								switch (tool) {
									case 1:
										return t.I;
									case 2:
										return t.J;
									case 0:
										return t.bN;
									default:
										return t.V;
								}
							}(),
							ep: $elm$core$Maybe$Nothing
						});
				case 3:
					var stateName = msg.a;
					var mouseX = msg.b;
					var mouseY = msg.c;
					if (!model.dy) {
						var _v8 = A2($elm$core$Dict$get, stateName, model.df);
						if (!_v8.$) {
							var pos = _v8.a;
							var m0 = $author$project$Update$saveUndo(model);
							return _Utils_update(
								m0,
								{
									dx: $elm$core$Maybe$Just(
										{dK: 0, dL: 0, ee: stateName})
								});
						} else {
							return model;
						}
					} else {
						return model;
					}
				case 4:
					var mouseX = msg.a;
					var mouseY = msg.b;
					var _v9 = model.dx;
					if (_v9.$ === 1) {
						return model;
					} else {
						var drag = _v9.a;
						return _Utils_update(
							model,
							{
								df: A3(
									$elm$core$Dict$insert,
									drag.ee,
									{et: mouseX, eu: mouseY},
									model.df)
							});
					}
				case 5:
					return _Utils_update(
						model,
						{dx: $elm$core$Maybe$Nothing, dG: false});
				case 39:
					var mx = msg.a;
					var my = msg.b;
					return _Utils_update(
						model,
						{dG: true, dP: model.ei, dQ: model.ej, dR: mx, dS: my});
				case 40:
					var mx = msg.a;
					var my = msg.b;
					return model.dG ? _Utils_update(
						model,
						{ei: model.dP + (mx - model.dR), ej: model.dQ + (my - model.dS)}) : model;
				case 41:
					return _Utils_update(
						model,
						{dG: false});
				case 42:
					var newZoom = A3($elm$core$Basics$clamp, 0.15, 8.0, model.ek * 1.25);
					var cy = 260.0;
					var newPanY = cy - ((cy - model.ej) * (newZoom / model.ek));
					var cx = 450.0;
					var newPanX = cx - ((cx - model.ei) * (newZoom / model.ek));
					return _Utils_update(
						model,
						{ei: newPanX, ej: newPanY, ek: newZoom});
				case 43:
					var newZoom = A3($elm$core$Basics$clamp, 0.15, 8.0, model.ek * 0.8);
					var cy = 260.0;
					var newPanY = cy - ((cy - model.ej) * (newZoom / model.ek));
					var cx = 450.0;
					var newPanX = cx - ((cx - model.ei) * (newZoom / model.ek));
					return _Utils_update(
						model,
						{ei: newPanX, ej: newPanY, ek: newZoom});
				case 44:
					return _Utils_update(
						model,
						{ei: 0, ej: 0, ek: 1.0});
				case 45:
					return _Utils_update(
						model,
						{el: !model.el});
				case 46:
					return _Utils_update(
						model,
						{dt: !model.dt});
				case 47:
					return _Utils_update(
						model,
						{ed: !model.ed});
				case 48:
					var from = msg.a;
					var to = msg.b;
					var m0 = $author$project$Update$saveUndo(model);
					var newTrans = A2(
						$elm$core$Dict$filter,
						F2(
							function (_v10, tgt) {
								var fr = _v10.a;
								return !(_Utils_eq(fr, from) && _Utils_eq(tgt, to));
							}),
						m0.cF);
					return $author$project$CodeSync$syncCodeFromDiagram(
						_Utils_update(
							m0,
							{
								d9: A2(t.b_, from, to),
								cF: newTrans
							}));
				case 6:
					var stateName = msg.a;
					return _Utils_update(
						model,
						{
							dY: stateName,
							d_: $elm$core$Maybe$Just(stateName)
						});
				case 7:
					var v = msg.a;
					return _Utils_update(
						model,
						{dY: v});
				case 8:
					var _v11 = model.d_;
					if (_v11.$ === 1) {
						return model;
					} else {
						var oldName = _v11.a;
						var newName = $elm$core$String$trim(model.dY);
						if ((newName === '') || _Utils_eq(newName, oldName)) {
							return _Utils_update(
								model,
								{dY: '', d_: $elm$core$Maybe$Nothing});
						} else {
							if (A2($elm$core$Dict$member, newName, model.df)) {
								return _Utils_update(
									model,
									{dY: '', d_: $elm$core$Maybe$Nothing});
							} else {
								var m0 = $author$project$Update$saveUndo(model);
								var newAccept = A2(
									$elm$core$List$map,
									function (s) {
										return _Utils_eq(s, oldName) ? newName : s;
									},
									m0.cN);
								var newStart = _Utils_eq(m0.de, oldName) ? newName : m0.de;
								var newTransitions = $elm$core$Dict$fromList(
									A2(
										$elm$core$List$map,
										function (_v12) {
											var _v13 = _v12.a;
											var fr = _v13.a;
											var ch = _v13.b;
											var to = _v12.b;
											return _Utils_Tuple2(
												_Utils_Tuple2(
													_Utils_eq(fr, oldName) ? newName : fr,
													ch),
												_Utils_eq(to, oldName) ? newName : to);
										},
										$elm$core$Dict$toList(m0.cF)));
								var pos = A2(
									$elm$core$Maybe$withDefault,
									{et: 0, eu: 0},
									A2($elm$core$Dict$get, oldName, m0.df));
								var newPositions = A3(
									$elm$core$Dict$insert,
									newName,
									pos,
									A2($elm$core$Dict$remove, oldName, m0.df));
								return $author$project$CodeSync$syncCodeFromDiagram(
									_Utils_update(
										m0,
										{
											cN: newAccept,
											dY: '',
											d_: $elm$core$Maybe$Nothing,
											d9: A2(t.ca, oldName, newName),
											de: newStart,
											df: newPositions,
											cF: newTransitions
										}));
							}
						}
					}
				case 9:
					return _Utils_update(
						model,
						{dY: '', d_: $elm$core$Maybe$Nothing});
				case 10:
					var state = msg.a;
					return $author$project$CodeSync$syncCodeFromDiagram(
						function (m0) {
							return _Utils_update(
								m0,
								{
									d9: t.cc(state),
									de: state
								});
						}(
							$author$project$Update$saveUndo(model)));
				case 11:
					var state = msg.a;
					var m0 = $author$project$Update$saveUndo(model);
					var newAccept = A2($elm$core$List$member, state, m0.cN) ? A2(
						$elm$core$List$filter,
						$elm$core$Basics$neq(state),
						m0.cN) : A2($elm$core$List$cons, state, m0.cN);
					return $author$project$CodeSync$syncCodeFromDiagram(
						_Utils_update(
							m0,
							{cN: newAccept}));
				case 12:
					var state = msg.a;
					var m0 = $author$project$Update$saveUndo(model);
					var newAccept = A2(
						$elm$core$List$filter,
						$elm$core$Basics$neq(state),
						m0.cN);
					var newPos = A2($elm$core$Dict$remove, state, m0.df);
					var newStart = _Utils_eq(m0.de, state) ? '' : m0.de;
					var newTrans = A2(
						$elm$core$Dict$filter,
						F2(
							function (_v14, to) {
								var fr = _v14.a;
								return (!_Utils_eq(fr, state)) && (!_Utils_eq(to, state));
							}),
						m0.cF);
					var m1 = _Utils_update(
						m0,
						{
							cN: newAccept,
							d9: t.bZ(state),
							de: newStart,
							df: newPos,
							cF: newTrans
						});
					return $author$project$CodeSync$syncCodeFromDiagram(
						model.$7 ? A2($author$project$Update$reorderAfterDelete, state, m1) : m1);
				case 13:
					var c = msg.a;
					return _Utils_update(
						model,
						{eo: c});
				case 14:
					var m0 = $author$project$Update$saveUndo(model);
					var chars = A2(
						$elm$core$List$filter,
						$elm$core$Basics$neq(''),
						A2(
							$elm$core$List$map,
							$elm$core$String$trim,
							A2($elm$core$String$split, '|', model.eo)));
					var newTrans = A3(
						$elm$core$List$foldl,
						F2(
							function (ch, acc) {
								return A3(
									$elm$core$Dict$insert,
									_Utils_Tuple2(m0.dT, ch),
									m0.dU,
									acc);
							}),
						m0.cF,
						chars);
					var charDisplay = A2($elm$core$String$join, '|', chars);
					return $author$project$CodeSync$syncCodeFromDiagram(
						_Utils_update(
							m0,
							{
								d7: false,
								d9: A3(t.ce, model.dT, charDisplay, model.dU),
								cF: newTrans
							}));
				case 15:
					return _Utils_update(
						model,
						{d7: false, ep: $elm$core$Maybe$Nothing});
				case 16:
					var w = msg.a;
					return _Utils_update(
						model,
						{cv: w});
				case 17:
					return _Utils_update(
						model,
						{
							du: $elm$core$Maybe$Just(model.de),
							d8: _List_fromArray(
								[
									_Utils_Tuple2(model.de, 0)
								]),
							d9: t.b2(model.cv),
							ea: 0
						});
				case 18:
					return A2($author$project$Simulation$stepOnce, t, loadedModel);
				case 19:
					return A2($author$project$Simulation$stepBack, t, loadedModel);
				case 20:
					return A2($author$project$Simulation$runToEnd, t, loadedModel);
				case 21:
					return _Utils_update(
						model,
						{
							dp: false,
							du: $elm$core$Maybe$Just(model.de),
							d8: _List_fromArray(
								[
									_Utils_Tuple2(model.de, 0)
								]),
							d9: t.b2(model.cv),
							ea: 0
						});
				case 22:
					var v = msg.a;
					return _Utils_update(
						model,
						{T: v});
				case 23:
					var v = msg.a;
					return _Utils_update(
						model,
						{S: v});
				case 24:
					var v = msg.a;
					return _Utils_update(
						model,
						{cR: v});
				case 25:
					var v = msg.a;
					return _Utils_update(
						model,
						{cQ: v});
				case 26:
					var v = msg.a;
					return _Utils_update(
						model,
						{cS: v});
				case 27:
					return $author$project$CodeSync$generateDiagramFromCode(
						$author$project$Update$saveUndo(model));
				case 28:
					return $author$project$CodeSync$syncCodeFromDiagram(model);
				case 29:
					return _Utils_update(
						model,
						{d3: !model.d3});
				case 30:
					return _Utils_update(
						model,
						{d2: !model.d2});
				case 31:
					return _Utils_update(
						$author$project$Update$defaultModel,
						{
							$7: model.$7,
							dH: model.dH,
							dI: model.dI,
							D: model.D,
							d6: model.d6,
							d9: $author$project$Lang$translations(model.dH).bY
						});
				case 32:
					return model;
				case 33:
					var _v15 = model.eq;
					if (!_v15.b) {
						return _Utils_update(
							model,
							{d9: t.b5});
					} else {
						var snap = _v15.a;
						var rest = _v15.b;
						return $author$project$CodeSync$syncCodeFromDiagram(
							A2(
								$author$project$Update$applySnapshot,
								snap,
								_Utils_update(
									model,
									{
										dW: A2(
											$elm$core$List$take,
											50,
											A2(
												$elm$core$List$cons,
												$author$project$Update$snapshotDiagram(model),
												model.dW)),
										d9: t.cf,
										eq: rest
									})));
					}
				case 34:
					var _v16 = model.dW;
					if (!_v16.b) {
						return _Utils_update(
							model,
							{d9: t.b4});
					} else {
						var snap = _v16.a;
						var rest = _v16.b;
						return $author$project$CodeSync$syncCodeFromDiagram(
							A2(
								$author$project$Update$applySnapshot,
								snap,
								_Utils_update(
									model,
									{
										dW: rest,
										d9: t.b8,
										eq: A2(
											$elm$core$List$take,
											50,
											A2(
												$elm$core$List$cons,
												$author$project$Update$snapshotDiagram(model),
												model.eq))
									})));
					}
				case 35:
					return _Utils_update(
						loadedModel,
						{dp: true, d9: t.bW});
				case 36:
					return _Utils_update(
						model,
						{dp: false, d9: t.b6});
				case 37:
					var ms = msg.a;
					return _Utils_update(
						model,
						{dq: ms});
				case 51:
					var target = msg.a;
					return _Utils_update(
						model,
						{
							dC: $elm$core$Maybe$Just(target)
						});
				case 52:
					return _Utils_update(
						model,
						{dC: $elm$core$Maybe$Nothing});
				case 53:
					var _v17 = model.dC;
					if (!_v17.$) {
						if (!_v17.a.$) {
							var name = _v17.a.a;
							var m0 = $author$project$Update$saveUndo(model);
							var newAccept = A2(
								$elm$core$List$filter,
								$elm$core$Basics$neq(name),
								m0.cN);
							var newPositions = A2($elm$core$Dict$remove, name, m0.df);
							var newStart = _Utils_eq(m0.de, name) ? '' : m0.de;
							var newTrans = A2(
								$elm$core$Dict$filter,
								F2(
									function (_v18, to) {
										var fr = _v18.a;
										return (!_Utils_eq(fr, name)) && (!_Utils_eq(to, name));
									}),
								m0.cF);
							var m1 = _Utils_update(
								m0,
								{
									cN: newAccept,
									dC: $elm$core$Maybe$Nothing,
									d9: t.bZ(name),
									de: newStart,
									df: newPositions,
									cF: newTrans
								});
							return $author$project$CodeSync$syncCodeFromDiagram(
								model.$7 ? A2($author$project$Update$reorderAfterDelete, name, m1) : m1);
						} else {
							var _v19 = _v17.a;
							var from = _v19.a;
							var to = _v19.b;
							var m0 = $author$project$Update$saveUndo(model);
							return $author$project$CodeSync$syncCodeFromDiagram(
								_Utils_update(
									m0,
									{
										dC: $elm$core$Maybe$Nothing,
										d9: A2(t.b_, from, to),
										cF: A2(
											$elm$core$Dict$filter,
											F2(
												function (_v20, tgt) {
													var fr = _v20.a;
													return !(_Utils_eq(fr, from) && _Utils_eq(tgt, to));
												}),
											m0.cF)
									}));
						}
					} else {
						return model;
					}
				case 54:
					var $temp$msg = $author$project$Types$Undo,
						$temp$model = model;
					msg = $temp$msg;
					model = $temp$model;
					continue update;
				case 55:
					var $temp$msg = $author$project$Types$Redo,
						$temp$model = model;
					msg = $temp$msg;
					model = $temp$model;
					continue update;
				case 56:
					return _Utils_update(
						model,
						{d6: !model.d6});
				case 57:
					return _Utils_update(
						model,
						{$7: !model.$7});
				case 58:
					return _Utils_update(
						model,
						{dF: true});
				case 59:
					var x = msg.a;
					return model.dF ? _Utils_update(
						model,
						{
							dI: A2(
								$elm$core$Basics$max,
								40,
								A2($elm$core$Basics$min, 700, x))
						}) : model;
				case 60:
					return _Utils_update(
						model,
						{dF: false});
				case 61:
					return _Utils_update(
						model,
						{
							d0: (model.d0 === '') ? 'DFA' : model.d0,
							d5: true,
							d6: false
						});
				case 62:
					return _Utils_update(
						model,
						{dZ: $elm$core$Maybe$Nothing, d5: false});
				case 65:
					var s = msg.a;
					return _Utils_update(
						model,
						{d0: s});
				case 66:
					var name = $elm$core$String$trim(model.d0);
					var data = $author$project$Update$diagramDataFromModel(model);
					var newSave = {
						cU: data,
						c0: _Utils_ap(
							$elm$core$String$fromInt(
								$elm$core$List$length(model.D)),
							model.d0),
						bB: (name === '') ? 'DFA' : name,
						d1: ''
					};
					return ((model.T === '') && (model.cS === '')) ? A2(
						$author$project$Update$showToast,
						$author$project$Lang$translations(model.dH).cB,
						model) : A2(
						$author$project$Update$showToast,
						$author$project$Lang$translations(model.dH).cC(newSave.bB),
						_Utils_update(
							model,
							{
								d0: '',
								D: _Utils_ap(
									model.D,
									_List_fromArray(
										[newSave]))
							}));
				case 67:
					var id = msg.a;
					return A2(
						$author$project$Update$showToast,
						$author$project$Lang$translations(model.dH).cw,
						_Utils_update(
							model,
							{
								D: A2(
									$elm$core$List$filter,
									function (s) {
										return !_Utils_eq(s.c0, id);
									},
									model.D)
							}));
				case 68:
					var id = msg.a;
					var _v21 = $elm$core$List$head(
						A2(
							$elm$core$List$filter,
							function (s) {
								return _Utils_eq(s.c0, id);
							},
							model.D));
					if (_v21.$ === 1) {
						return model;
					} else {
						var saved = _v21.a;
						return A2(
							$author$project$Update$showToast,
							$author$project$Lang$translations(model.dH).cA(saved.bB),
							A2(
								$author$project$Update$update,
								A5($author$project$Types$LoadDFAFromSave, saved.cU.ef, saved.cU.dm, saved.cU.eb, saved.cU.dl, saved.cU.cF),
								_Utils_update(
									model,
									{d4: false})));
					}
				case 63:
					return _Utils_update(
						model,
						{d4: true, d6: false});
				case 64:
					return _Utils_update(
						model,
						{d4: false});
				case 69:
					var id = msg.a;
					var current = A2(
						$elm$core$Maybe$withDefault,
						'',
						A2(
							$elm$core$Maybe$map,
							function ($) {
								return $.bB;
							},
							$elm$core$List$head(
								A2(
									$elm$core$List$filter,
									function (s) {
										return _Utils_eq(s.c0, id);
									},
									model.D))));
					return _Utils_update(
						model,
						{
							dX: current,
							dZ: $elm$core$Maybe$Just(id)
						});
				case 70:
					var v = msg.a;
					return _Utils_update(
						model,
						{dX: v});
				case 71:
					var _v22 = model.dZ;
					if (_v22.$ === 1) {
						return model;
					} else {
						var id = _v22.a;
						var newName = $elm$core$String$trim(model.dX);
						return _Utils_update(
							model,
							{
								dX: '',
								dZ: $elm$core$Maybe$Nothing,
								D: A2(
									$elm$core$List$map,
									function (s) {
										return _Utils_eq(s.c0, id) ? _Utils_update(
											s,
											{
												bB: (newName === '') ? s.bB : newName
											}) : s;
									},
									model.D)
							});
					}
				case 72:
					return _Utils_update(
						model,
						{dX: '', dZ: $elm$core$Maybe$Nothing});
				case 73:
					var id = msg.a;
					return model;
				case 74:
					return model;
				case 75:
					var text = msg.a;
					var data = $author$project$Update$parseDfaText(text);
					return A2(
						$author$project$Update$showToast,
						t.cz('file'),
						A2(
							$author$project$Update$update,
							A5($author$project$Types$LoadDFAFromSave, data.ef, data.dm, data.eb, data.dl, data.cF),
							_Utils_update(
								model,
								{d4: false})));
				case 76:
					var diagrams = msg.a;
					return _Utils_update(
						model,
						{D: diagrams});
				case 77:
					return _Utils_update(
						model,
						{E: false});
				case 78:
					return _Utils_update(
						model,
						{E: false});
				case 79:
					return model;
				default:
					return (!model.dp) ? model : (((_Utils_cmp(
						model.ea,
						$elm$core$String$length(model.cv)) > -1) || _Utils_eq(model.du, $elm$core$Maybe$Nothing)) ? A2(
						$author$project$Simulation$checkAcceptance,
						t,
						_Utils_update(
							model,
							{dp: false})) : A2($author$project$Simulation$stepOnce, t, model));
			}
		}
	});
var $author$project$Main$updateWithPorts = F2(
	function (msg, model) {
		switch (msg.$) {
			case 66:
				var newModel = A2($author$project$Update$update, msg, model);
				return _Utils_Tuple2(
					newModel,
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								$author$project$Main$savesToStorage(
								A2($elm$json$Json$Encode$list, $author$project$Main$encodeSaved, newModel.D)),
								A2(
								$elm$core$Task$perform,
								function (_v1) {
									return $author$project$Types$ToastTimeout;
								},
								$elm$core$Process$sleep(2400))
							])));
			case 67:
				var newModel = A2($author$project$Update$update, msg, model);
				return _Utils_Tuple2(
					newModel,
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								$author$project$Main$savesToStorage(
								A2($elm$json$Json$Encode$list, $author$project$Main$encodeSaved, newModel.D)),
								A2(
								$elm$core$Task$perform,
								function (_v2) {
									return $author$project$Types$ToastTimeout;
								},
								$elm$core$Process$sleep(2400))
							])));
			case 71:
				var newModel = A2($author$project$Update$update, msg, model);
				return _Utils_Tuple2(
					newModel,
					$author$project$Main$savesToStorage(
						A2($elm$json$Json$Encode$list, $author$project$Main$encodeSaved, newModel.D)));
			case 68:
				var newModel = A2($author$project$Update$update, msg, model);
				return _Utils_Tuple2(
					newModel,
					A2(
						$elm$core$Task$perform,
						function (_v3) {
							return $author$project$Types$ToastTimeout;
						},
						$elm$core$Process$sleep(2400)));
			case 73:
				var id = msg.a;
				var newModel = A2($author$project$Update$update, msg, model);
				var maybeSave = $elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (s) {
							return _Utils_eq(s.c0, id);
						},
						model.D));
				if (maybeSave.$ === 1) {
					return _Utils_Tuple2(newModel, $elm$core$Platform$Cmd$none);
				} else {
					var saved = maybeSave.a;
					return _Utils_Tuple2(
						_Utils_update(
							newModel,
							{
								en: $author$project$Lang$translations(model.dH).cx(saved.bB),
								E: true
							}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Main$downloadFile(
									{
										cT: $author$project$Update$formatDfaText(saved.cU),
										cY: saved.bB + '.dfa'
									}),
									A2(
									$elm$core$Task$perform,
									function (_v5) {
										return $author$project$Types$ToastTimeout;
									},
									$elm$core$Process$sleep(2400))
								])));
				}
			case 74:
				return _Utils_Tuple2(
					model,
					$author$project$Main$triggerFileInput(0));
			case 77:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{E: false}),
					$elm$core$Platform$Cmd$none);
			case 75:
				var newModel = A2($author$project$Update$update, msg, model);
				return _Utils_Tuple2(
					newModel,
					A2(
						$elm$core$Task$perform,
						function (_v6) {
							return $author$project$Types$ToastTimeout;
						},
						$elm$core$Process$sleep(2400)));
			case 79:
				return _Utils_Tuple2(
					model,
					$author$project$Main$exportSvg('dfa-diagram.svg'));
			case 49:
				var newModel = A2($author$project$Update$update, msg, model);
				var langStr = function () {
					var _v7 = newModel.dH;
					if (!_v7) {
						return 'EN';
					} else {
						return 'SK';
					}
				}();
				return _Utils_Tuple2(
					newModel,
					$author$project$Main$sendLanguage(langStr));
			default:
				var newModel = A2($author$project$Update$update, msg, model);
				var needsDismiss = newModel.E && (!model.E);
				return _Utils_Tuple2(
					newModel,
					needsDismiss ? A2(
						$elm$core$Task$perform,
						function (_v8) {
							return $author$project$Types$ToastTimeout;
						},
						$elm$core$Process$sleep(2400)) : $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Types$DragSidebarEnd = {$: 60};
var $author$project$Types$DragSidebarMove = function (a) {
	return {$: 59, a: a};
};
var $author$project$Types$DragSidebarStart = {$: 58};
var $author$project$Types$MouseUp = {$: 5};
var $author$project$Types$ToggleCodePanel = {$: 46};
var $author$project$Types$ToggleTestPanel = {$: 45};
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$title = $elm$html$Html$Attributes$stringProperty('title');
var $author$project$View$collapsedPanelBtn = F3(
	function (icon, label, msg) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick(msg),
					$elm$html$Html$Attributes$title(label),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'gap', '8px'),
					A2($elm$html$Html$Attributes$style, 'width', '100%'),
					A2($elm$html$Html$Attributes$style, 'padding', '8px 12px'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '10px'),
					A2($elm$html$Html$Attributes$style, 'background', 'rgba(124,77,255,0.15)'),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid rgba(124,77,255,0.35)'),
					A2($elm$html$Html$Attributes$style, 'color', '#ce93d8'),
					A2($elm$html$Html$Attributes$style, 'font-size', '0.82rem'),
					A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
					A2($elm$html$Html$Attributes$style, 'font-family', 'inherit'),
					A2($elm$html$Html$Attributes$style, 'flex-shrink', '0')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(icon)
						])),
					A2(
					$elm$html$Html$span,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(label)
						])),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'margin-left', 'auto'),
							A2($elm$html$Html$Attributes$style, 'opacity', '0.6'),
							A2($elm$html$Html$Attributes$style, 'font-size', '0.7rem')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('▶')
						]))
				]));
	});
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $elm$core$String$fromFloat = _String_fromNumber;
var $author$project$Types$GenerateDiagramFromCode = {$: 27};
var $author$project$Types$SetCodeAccept = function (a) {
	return {$: 25, a: a};
};
var $author$project$Types$SetCodeAlphabet = function (a) {
	return {$: 23, a: a};
};
var $author$project$Types$SetCodeStart = function (a) {
	return {$: 24, a: a};
};
var $author$project$Types$SetCodeStates = function (a) {
	return {$: 22, a: a};
};
var $author$project$Types$SetCodeTransitions = function (a) {
	return {$: 26, a: a};
};
var $author$project$View$Panels$codeFieldLabel = function (lbl) {
	return A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'font-size', '0.68rem'),
				A2($elm$html$Html$Attributes$style, 'color', '#7c4dff'),
				A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
				A2($elm$html$Html$Attributes$style, 'letter-spacing', '0.8px'),
				A2($elm$html$Html$Attributes$style, 'text-transform', 'uppercase'),
				A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
				A2($elm$html$Html$Attributes$style, 'top', '-8px'),
				A2($elm$html$Html$Attributes$style, 'left', '10px'),
				A2($elm$html$Html$Attributes$style, 'background', '#1a1a2e'),
				A2($elm$html$Html$Attributes$style, 'padding', '0 4px'),
				A2($elm$html$Html$Attributes$style, 'z-index', '1')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(lbl)
			]));
};
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$View$Panels$codeField = F4(
	function (lbl, val, handler, ph) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'relative')
				]),
			_List_fromArray(
				[
					$author$project$View$Panels$codeFieldLabel(lbl),
					A2(
					$elm$html$Html$input,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$value(val),
							$elm$html$Html$Events$onInput(handler),
							$elm$html$Html$Attributes$placeholder(ph),
							A2($elm$html$Html$Attributes$style, 'width', '100%'),
							A2($elm$html$Html$Attributes$style, 'background', 'rgba(255,255,255,0.04)'),
							A2($elm$html$Html$Attributes$style, 'border', '1.5px solid rgba(124,77,255,0.4)'),
							A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
							A2($elm$html$Html$Attributes$style, 'padding', '10px 12px'),
							A2($elm$html$Html$Attributes$style, 'color', '#e8eaf6'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
							A2($elm$html$Html$Attributes$style, 'font-size', '0.82rem'),
							A2($elm$html$Html$Attributes$style, 'outline', 'none'),
							A2($elm$html$Html$Attributes$style, 'box-sizing', 'border-box')
						]),
					_List_Nil)
				]));
	});
var $author$project$View$Widgets$collapsibleHeader = F3(
	function (title, isCollapsed, toggleMsg) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick(toggleMsg),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
					A2($elm$html$Html$Attributes$style, 'user-select', 'none'),
					A2($elm$html$Html$Attributes$style, '-webkit-user-select', 'none')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'font-size', '0.78rem'),
							A2($elm$html$Html$Attributes$style, 'font-weight', '700'),
							A2($elm$html$Html$Attributes$style, 'letter-spacing', '1px'),
							A2($elm$html$Html$Attributes$style, 'text-transform', 'uppercase'),
							A2($elm$html$Html$Attributes$style, 'color', '#9fa8da')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(title)
						])),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'font-size', '0.85rem'),
							A2($elm$html$Html$Attributes$style, 'color', '#9fa8da'),
							A2($elm$html$Html$Attributes$style, 'transition', 'transform 0.2s'),
							A2($elm$html$Html$Attributes$style, 'display', 'inline-block'),
							A2(
							$elm$html$Html$Attributes$style,
							'transform',
							isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('▾')
						]))
				]));
	});
var $author$project$View$Widgets$panel = F2(
	function (attrs, children) {
		return A2(
			$elm$html$Html$div,
			_Utils_ap(
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'background', 'rgba(255,255,255,0.04)'),
						A2($elm$html$Html$Attributes$style, 'border', '1px solid rgba(255,255,255,0.08)'),
						A2($elm$html$Html$Attributes$style, 'border-radius', '16px'),
						A2($elm$html$Html$Attributes$style, 'padding', '18px')
					]),
				attrs),
			children);
	});
var $author$project$View$Widgets$pinkGrad = 'linear-gradient(135deg, #ff4081, #f06292)';
var $author$project$View$Widgets$styledBtn = F5(
	function (label, msg, bg, w, padding) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick(msg),
					A2($elm$html$Html$Attributes$style, 'background', bg),
					A2($elm$html$Html$Attributes$style, 'color', 'white'),
					A2($elm$html$Html$Attributes$style, 'border', 'none'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '10px'),
					A2($elm$html$Html$Attributes$style, 'padding', padding),
					A2($elm$html$Html$Attributes$style, 'width', w),
					A2($elm$html$Html$Attributes$style, 'font-family', 'inherit'),
					A2($elm$html$Html$Attributes$style, 'font-size', '0.85rem'),
					A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
					A2($elm$html$Html$Attributes$style, 'margin-top', '8px'),
					A2($elm$html$Html$Attributes$style, 'display', 'block'),
					A2($elm$html$Html$Attributes$style, 'text-align', 'center')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(label)
				]));
	});
var $elm$html$Html$textarea = _VirtualDom_node('textarea');
var $author$project$View$Panels$viewCodePanel = F2(
	function (t, model) {
		return A2(
			$author$project$View$Widgets$panel,
			_List_Nil,
			_List_fromArray(
				[
					A3($author$project$View$Widgets$collapsibleHeader, t.R, model.dt, $author$project$Types$ToggleCodePanel),
					model.dt ? $elm$html$Html$text('') : A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'margin-top', '10px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
									A2($elm$html$Html$Attributes$style, 'gap', '12px')
								]),
							_List_fromArray(
								[
									A4($author$project$View$Panels$codeField, t.cl, model.T, $author$project$Types$SetCodeStates, 'q0, q1, q2'),
									A4($author$project$View$Panels$codeField, t.K, model.S, $author$project$Types$SetCodeAlphabet, 'a, b'),
									A4($author$project$View$Panels$codeField, t.ch, model.cR, $author$project$Types$SetCodeStart, 'q0'),
									A4($author$project$View$Panels$codeField, t.F, model.cQ, $author$project$Types$SetCodeAccept, 'q2'),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'position', 'relative')
										]),
									_List_fromArray(
										[
											$author$project$View$Panels$codeFieldLabel(t.cG),
											A2(
											$elm$html$Html$textarea,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$value(model.cS),
													$elm$html$Html$Events$onInput($author$project$Types$SetCodeTransitions),
													$elm$html$Html$Attributes$placeholder('q0,a,q1\nq1,a|b,q2\nq2,a|b,q2'),
													A2($elm$html$Html$Attributes$style, 'width', '100%'),
													A2($elm$html$Html$Attributes$style, 'background', 'rgba(255,255,255,0.04)'),
													A2($elm$html$Html$Attributes$style, 'border', '1.5px solid rgba(124,77,255,0.4)'),
													A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
													A2($elm$html$Html$Attributes$style, 'padding', '14px 12px 10px'),
													A2($elm$html$Html$Attributes$style, 'color', '#e8eaf6'),
													A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
													A2($elm$html$Html$Attributes$style, 'font-size', '0.82rem'),
													A2($elm$html$Html$Attributes$style, 'outline', 'none'),
													A2($elm$html$Html$Attributes$style, 'resize', 'vertical'),
													A2($elm$html$Html$Attributes$style, 'min-height', '90px'),
													A2($elm$html$Html$Attributes$style, 'line-height', '1.6'),
													A2($elm$html$Html$Attributes$style, 'box-sizing', 'border-box')
												]),
											_List_Nil)
										]))
								])),
							A5($author$project$View$Widgets$styledBtn, t.ac, $author$project$Types$GenerateDiagramFromCode, $author$project$View$Widgets$pinkGrad, '100%', '9px 0')
						]))
				]));
	});
var $author$project$View$stripIconBtn = F3(
	function (icon, tooltip, msg) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick(msg),
					$elm$html$Html$Attributes$title(tooltip),
					A2($elm$html$Html$Attributes$style, 'width', '36px'),
					A2($elm$html$Html$Attributes$style, 'height', '36px'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '10px'),
					A2($elm$html$Html$Attributes$style, 'background', 'rgba(124,77,255,0.25)'),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid rgba(124,77,255,0.4)'),
					A2($elm$html$Html$Attributes$style, 'color', '#ce93d8'),
					A2($elm$html$Html$Attributes$style, 'font-size', '0.85rem'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
					A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(icon)
				]));
	});
var $author$project$View$viewCollapsedStrip = F2(
	function (t, model) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'gap', '6px'),
					A2($elm$html$Html$Attributes$style, 'padding-top', '8px'),
					A2($elm$html$Html$Attributes$style, 'width', '44px'),
					A2($elm$html$Html$Attributes$style, 'flex-shrink', '0')
				]),
			_List_fromArray(
				[
					A3($author$project$View$stripIconBtn, '📝', t.cu, $author$project$Types$ToggleTestPanel),
					A3($author$project$View$stripIconBtn, '{ }', t.R, $author$project$Types$ToggleCodePanel)
				]));
	});
var $author$project$Types$AddTransitionTool = 2;
var $author$project$Types$ClickedCanvas = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Types$DeleteTool = 3;
var $author$project$Types$ExportSvg = {$: 79};
var $author$project$Types$MouseMove = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $author$project$Types$PanMove = F2(
	function (a, b) {
		return {$: 40, a: a, b: b};
	});
var $author$project$Types$PanStart = F2(
	function (a, b) {
		return {$: 39, a: a, b: b};
	});
var $author$project$Types$ResetView = {$: 44};
var $author$project$Types$SetDrawTool = function (a) {
	return {$: 2, a: a};
};
var $author$project$Types$ZoomIn = {$: 42};
var $author$project$Types$ZoomOut = {$: 43};
var $elm$virtual_dom$VirtualDom$Custom = function (a) {
	return {$: 3, a: a};
};
var $elm$html$Html$Events$custom = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Custom(decoder));
	});
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$defs = $elm$svg$Svg$trustedNode('defs');
var $author$project$Types$DeleteTransition = F2(
	function (a, b) {
		return {$: 48, a: a, b: b};
	});
var $author$project$Types$HoverEnter = function (a) {
	return {$: 51, a: a};
};
var $author$project$Types$HoverLeave = {$: 52};
var $author$project$Types$HoverTransition = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$svg$Svg$Attributes$cursor = _VirtualDom_attribute('cursor');
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$core$Basics$pow = _Basics_pow;
var $author$project$Helpers$mySqrt = function (x) {
	return A2($elm$core$Basics$pow, x, 0.5);
};
var $author$project$View$Canvas$ellipseEdge = F5(
	function (pos, dx, dy, rx, ry) {
		var dist = $author$project$Helpers$mySqrt((dx * dx) + (dy * dy));
		if (dist < 0.001) {
			return _Utils_Tuple2(pos.et, pos.eu);
		} else {
			var uy = dy / dist;
			var ux = dx / dist;
			var denom = $author$project$Helpers$mySqrt(((ux * ux) / (rx * rx)) + ((uy * uy) / (ry * ry)));
			var scale = 1 / denom;
			return _Utils_Tuple2(pos.et + (ux * scale), pos.eu + (uy * scale));
		}
	});
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $author$project$Helpers$flt = $elm$core$String$fromFloat;
var $elm$svg$Svg$line = $elm$svg$Svg$trustedNode('line');
var $elm$svg$Svg$Attributes$markerEnd = _VirtualDom_attribute('marker-end');
var $elm$svg$Svg$Events$onMouseOut = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseout',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$svg$Svg$Events$onMouseOver = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseover',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $elm$svg$Svg$Attributes$pointerEvents = _VirtualDom_attribute('pointer-events');
var $author$project$View$Canvas$stateRy = 22;
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $elm$svg$Svg$Attributes$fontFamily = _VirtualDom_attribute('font-family');
var $elm$svg$Svg$Attributes$fontSize = _VirtualDom_attribute('font-size');
var $elm$svg$Svg$Attributes$fontWeight = _VirtualDom_attribute('font-weight');
var $elm$svg$Svg$text = $elm$virtual_dom$VirtualDom$text;
var $elm$svg$Svg$Attributes$textAnchor = _VirtualDom_attribute('text-anchor');
var $elm$svg$Svg$text_ = $elm$svg$Svg$trustedNode('text');
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $author$project$View$Canvas$transLabel = F5(
	function (x, y, label, isActive, isHovered) {
		return A2(
			$elm$svg$Svg$text_,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x(
					$author$project$Helpers$flt(x)),
					$elm$svg$Svg$Attributes$y(
					$author$project$Helpers$flt(y)),
					$elm$svg$Svg$Attributes$textAnchor('middle'),
					$elm$svg$Svg$Attributes$fontSize('12'),
					$elm$svg$Svg$Attributes$fontWeight('bold'),
					$elm$svg$Svg$Attributes$fontFamily('monospace'),
					$elm$svg$Svg$Attributes$fill(
					isHovered ? '#ef5350' : (isActive ? '#69f0ae' : '#f48fb1')),
					$elm$svg$Svg$Attributes$pointerEvents('none')
				]),
			_List_fromArray(
				[
					$elm$svg$Svg$text(label)
				]));
	});
var $elm$svg$Svg$Attributes$x1 = _VirtualDom_attribute('x1');
var $elm$svg$Svg$Attributes$x2 = _VirtualDom_attribute('x2');
var $elm$svg$Svg$Attributes$y1 = _VirtualDom_attribute('y1');
var $elm$svg$Svg$Attributes$y2 = _VirtualDom_attribute('y2');
var $author$project$View$Canvas$drawArrow = function (label) {
	return function (p1) {
		return function (p2) {
			return function (rx1) {
				return function (rx2) {
					return function (curved) {
						return function (isActive) {
							return function (drawTool) {
								return function (hoveredObject) {
									return function (from) {
										return function (to) {
											var strokeW = isActive ? '2.5' : '2';
											var ry = $author$project$View$Canvas$stateRy;
											var markerUrl = isActive ? 'url(#arrow-active)' : 'url(#arrow)';
											var isHovered = _Utils_eq(
												hoveredObject,
												$elm$core$Maybe$Just(
													A2($author$project$Types$HoverTransition, from, to)));
											var isDeleteMode = drawTool === 3;
											var strokeColor = (isDeleteMode || isHovered) ? '#ef5350' : (isActive ? '#69f0ae' : '#9fa8da');
											var hitPath = function (path_) {
												var clickAttr = isDeleteMode ? _List_fromArray(
													[
														A2(
														$elm$html$Html$Events$custom,
														'click',
														$elm$json$Json$Decode$succeed(
															{
																dJ: A2($author$project$Types$DeleteTransition, from, to),
																dV: false,
																eg: true
															}))
													]) : _List_Nil;
												return _List_fromArray(
													[
														A2(
														$elm$svg$Svg$path,
														_Utils_ap(
															_List_fromArray(
																[
																	$elm$svg$Svg$Attributes$d(path_),
																	$elm$svg$Svg$Attributes$stroke('transparent'),
																	$elm$svg$Svg$Attributes$strokeWidth('14'),
																	$elm$svg$Svg$Attributes$fill('none'),
																	$elm$svg$Svg$Attributes$cursor(
																	isDeleteMode ? 'pointer' : 'default'),
																	$elm$svg$Svg$Events$onMouseOver(
																	$author$project$Types$HoverEnter(
																		A2($author$project$Types$HoverTransition, from, to))),
																	$elm$svg$Svg$Events$onMouseOut($author$project$Types$HoverLeave)
																]),
															clickAttr),
														_List_Nil)
													]);
											};
											var dy = p2.eu - p1.eu;
											var dx = p2.et - p1.et;
											var dist = $author$project$Helpers$mySqrt((dx * dx) + (dy * dy));
											if (curved) {
												var offset = 20;
												var ny = dx / dist;
												var nx = -(dy / dist);
												var _v0 = A5($author$project$View$Canvas$ellipseEdge, p1, dx + (nx * offset), dy + (ny * offset), rx1, ry);
												var sx = _v0.a;
												var sy = _v0.b;
												var _v1 = A5($author$project$View$Canvas$ellipseEdge, p2, -(dx - (nx * offset)), -(dy - (ny * offset)), rx2, ry);
												var ex = _v1.a;
												var ey = _v1.b;
												var cpx = ((sx + ex) / 2) + (nx * 35);
												var lx = ((sx + (2 * cpx)) + ex) / 4;
												var cpy = ((sy + ey) / 2) + (ny * 35);
												var ly = (((sy + (2 * cpy)) + ey) / 4) - 8;
												var pathStr = 'M ' + ($author$project$Helpers$flt(sx) + (' ' + ($author$project$Helpers$flt(sy) + (' Q ' + ($author$project$Helpers$flt(cpx) + (' ' + ($author$project$Helpers$flt(cpy) + (' ' + ($author$project$Helpers$flt(ex) + (' ' + $author$project$Helpers$flt(ey)))))))))));
												return _Utils_ap(
													_List_fromArray(
														[
															A2(
															$elm$svg$Svg$path,
															_List_fromArray(
																[
																	$elm$svg$Svg$Attributes$d(pathStr),
																	$elm$svg$Svg$Attributes$stroke(strokeColor),
																	$elm$svg$Svg$Attributes$strokeWidth(strokeW),
																	$elm$svg$Svg$Attributes$fill('none'),
																	$elm$svg$Svg$Attributes$markerEnd(markerUrl),
																	$elm$svg$Svg$Attributes$pointerEvents('none')
																]),
															_List_Nil),
															A5($author$project$View$Canvas$transLabel, lx, ly, label, isActive, isHovered)
														]),
													hitPath(pathStr));
											} else {
												var _v2 = A5($author$project$View$Canvas$ellipseEdge, p1, dx, dy, rx1, ry);
												var sx = _v2.a;
												var sy = _v2.b;
												var _v3 = A5($author$project$View$Canvas$ellipseEdge, p2, -dx, -dy, rx2, ry);
												var ex = _v3.a;
												var ey = _v3.b;
												var mx = (sx + ex) / 2;
												var my = ((sy + ey) / 2) - 10;
												var pathStr = 'M ' + ($author$project$Helpers$flt(sx) + (' ' + ($author$project$Helpers$flt(sy) + (' L ' + ($author$project$Helpers$flt(ex) + (' ' + $author$project$Helpers$flt(ey)))))));
												return _Utils_ap(
													_List_fromArray(
														[
															A2(
															$elm$svg$Svg$line,
															_List_fromArray(
																[
																	$elm$svg$Svg$Attributes$x1(
																	$author$project$Helpers$flt(sx)),
																	$elm$svg$Svg$Attributes$y1(
																	$author$project$Helpers$flt(sy)),
																	$elm$svg$Svg$Attributes$x2(
																	$author$project$Helpers$flt(ex)),
																	$elm$svg$Svg$Attributes$y2(
																	$author$project$Helpers$flt(ey)),
																	$elm$svg$Svg$Attributes$stroke(strokeColor),
																	$elm$svg$Svg$Attributes$strokeWidth(strokeW),
																	$elm$svg$Svg$Attributes$markerEnd(markerUrl),
																	$elm$svg$Svg$Attributes$pointerEvents('none')
																]),
															_List_Nil),
															A5($author$project$View$Canvas$transLabel, mx, my, label, isActive, isHovered)
														]),
													hitPath(pathStr));
											}
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$View$Canvas$drawSelfLoop = F8(
	function (label, pos, rx, isActive, drawTool, hoveredObject, from, to) {
		var strokeW = isActive ? '2.5' : '2';
		var ry = $author$project$View$Canvas$stateRy;
		var markerUrl = isActive ? 'url(#arrow-active)' : 'url(#arrow)';
		var loopR = 13.0;
		var lcy = ((pos.eu - ry) - loopR) - 1.0;
		var ly = (lcy - loopR) - 5;
		var sy = lcy + loopR;
		var lcx = pos.et;
		var lx = lcx;
		var isHovered = _Utils_eq(
			hoveredObject,
			$elm$core$Maybe$Just(
				A2($author$project$Types$HoverTransition, from, to)));
		var isDeleteMode = drawTool === 3;
		var strokeColor = (isDeleteMode || isHovered) ? '#ef5350' : (isActive ? '#69f0ae' : '#9fa8da');
		var gap = 4.0;
		var sx = lcx + gap;
		var ey = lcy + loopR;
		var ex = lcx - gap;
		var pathD = 'M ' + ($author$project$Helpers$flt(sx) + (' ' + ($author$project$Helpers$flt(sy) + (' A ' + ($author$project$Helpers$flt(loopR) + (' ' + ($author$project$Helpers$flt(loopR) + (' 0 1 0 ' + ($author$project$Helpers$flt(ex) + (' ' + $author$project$Helpers$flt(ey)))))))))));
		var clickAttr = isDeleteMode ? _List_fromArray(
			[
				A2(
				$elm$html$Html$Events$custom,
				'click',
				$elm$json$Json$Decode$succeed(
					{
						dJ: A2($author$project$Types$DeleteTransition, from, to),
						dV: false,
						eg: true
					}))
			]) : _List_Nil;
		return _List_fromArray(
			[
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$d(pathD),
						$elm$svg$Svg$Attributes$stroke(strokeColor),
						$elm$svg$Svg$Attributes$strokeWidth(strokeW),
						$elm$svg$Svg$Attributes$fill('none'),
						$elm$svg$Svg$Attributes$markerEnd(markerUrl),
						$elm$svg$Svg$Attributes$pointerEvents('none')
					]),
				_List_Nil),
				A5($author$project$View$Canvas$transLabel, lx, ly, label, isActive, isHovered),
				A2(
				$elm$svg$Svg$path,
				_Utils_ap(
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$d(pathD),
							$elm$svg$Svg$Attributes$stroke('transparent'),
							$elm$svg$Svg$Attributes$strokeWidth('14'),
							$elm$svg$Svg$Attributes$fill('none'),
							$elm$svg$Svg$Attributes$cursor(
							isDeleteMode ? 'pointer' : 'default'),
							$elm$svg$Svg$Events$onMouseOver(
							$author$project$Types$HoverEnter(
								A2($author$project$Types$HoverTransition, from, to))),
							$elm$svg$Svg$Events$onMouseOut($author$project$Types$HoverLeave)
						]),
					clickAttr),
				_List_Nil)
			]);
	});
var $author$project$Types$ClickedState = function (a) {
	return {$: 1, a: a};
};
var $author$project$Types$HoverState = function (a) {
	return {$: 0, a: a};
};
var $author$project$Types$MouseDownOnState = F3(
	function (a, b, c) {
		return {$: 3, a: a, b: b, c: c};
	});
var $author$project$Types$StartRename = function (a) {
	return {$: 6, a: a};
};
var $elm$svg$Svg$Attributes$cx = _VirtualDom_attribute('cx');
var $elm$svg$Svg$Attributes$cy = _VirtualDom_attribute('cy');
var $elm$svg$Svg$Attributes$dominantBaseline = _VirtualDom_attribute('dominant-baseline');
var $elm$svg$Svg$ellipse = $elm$svg$Svg$trustedNode('ellipse');
var $elm$svg$Svg$Attributes$rx = _VirtualDom_attribute('rx');
var $elm$svg$Svg$Attributes$ry = _VirtualDom_attribute('ry');
var $author$project$View$Canvas$stateRx = function (name) {
	return A2(
		$elm$core$Basics$max,
		28,
		($elm$core$String$length(name) * 7.5) + 14);
};
var $author$project$View$Canvas$drawState = F7(
	function (model, name, pos, isStart, isAccept, isCurrent, isPending) {
		var textFill = isCurrent ? '#69f0ae' : '#e8eaf6';
		var strokeW = (isCurrent || isPending) ? '4' : '2.5';
		var ry = $author$project$View$Canvas$stateRy;
		var rx = $author$project$View$Canvas$stateRx(name);
		var startArrow = isStart ? _List_fromArray(
			[
				A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1(
						$author$project$Helpers$flt((pos.et - rx) - 30)),
						$elm$svg$Svg$Attributes$y1(
						$author$project$Helpers$flt(pos.eu)),
						$elm$svg$Svg$Attributes$x2(
						$author$project$Helpers$flt((pos.et - rx) - 4)),
						$elm$svg$Svg$Attributes$y2(
						$author$project$Helpers$flt(pos.eu)),
						$elm$svg$Svg$Attributes$stroke('#ffb74d'),
						$elm$svg$Svg$Attributes$strokeWidth('2.5'),
						$elm$svg$Svg$Attributes$markerEnd('url(#arrow)'),
						$elm$svg$Svg$Attributes$pointerEvents('none')
					]),
				_List_Nil)
			]) : _List_Nil;
		var isHovered = _Utils_eq(
			model.dC,
			$elm$core$Maybe$Just(
				$author$project$Types$HoverState(name)));
		var strokeColor = isCurrent ? '#69f0ae' : (isPending ? '#ffb74d' : (((model.dy === 3) || isHovered) ? '#ef5350' : (isAccept ? '#4fc3f7' : (isStart ? '#ffb74d' : '#9fa8da'))));
		var innerEllipse = isAccept ? _List_fromArray(
			[
				A2(
				$elm$svg$Svg$ellipse,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$cx(
						$author$project$Helpers$flt(pos.et)),
						$elm$svg$Svg$Attributes$cy(
						$author$project$Helpers$flt(pos.eu)),
						$elm$svg$Svg$Attributes$rx(
						$author$project$Helpers$flt(rx - 5)),
						$elm$svg$Svg$Attributes$ry(
						$author$project$Helpers$flt(ry - 4)),
						$elm$svg$Svg$Attributes$fill('none'),
						$elm$svg$Svg$Attributes$stroke(strokeColor),
						$elm$svg$Svg$Attributes$strokeWidth('1.5'),
						$elm$svg$Svg$Attributes$pointerEvents('none')
					]),
				_List_Nil)
			]) : _List_Nil;
		var fillColor = isCurrent ? '#1b5e20' : (((model.dy === 3) || isHovered) ? 'rgba(239,83,80,0.15)' : (isPending ? 'rgba(255,183,77,0.2)' : (isAccept ? 'rgba(79,195,247,0.15)' : 'rgba(255,255,255,0.07)')));
		var cursorStr = function () {
			var _v0 = model.dy;
			switch (_v0) {
				case 0:
					var _v1 = model.dx;
					if (!_v1.$) {
						var d = _v1.a;
						return _Utils_eq(d.ee, name) ? 'grabbing' : 'grab';
					} else {
						return 'grab';
					}
				case 2:
					return 'crosshair';
				case 1:
					return 'default';
				default:
					return 'pointer';
			}
		}();
		return _Utils_ap(
			startArrow,
			_Utils_ap(
				_List_fromArray(
					[
						A2(
						$elm$svg$Svg$ellipse,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$cx(
								$author$project$Helpers$flt(pos.et)),
								$elm$svg$Svg$Attributes$cy(
								$author$project$Helpers$flt(pos.eu)),
								$elm$svg$Svg$Attributes$rx(
								$author$project$Helpers$flt(rx)),
								$elm$svg$Svg$Attributes$ry(
								$author$project$Helpers$flt(ry)),
								$elm$svg$Svg$Attributes$fill(fillColor),
								$elm$svg$Svg$Attributes$stroke(strokeColor),
								$elm$svg$Svg$Attributes$strokeWidth(strokeW),
								$elm$svg$Svg$Attributes$cursor(cursorStr),
								$elm$svg$Svg$Events$onMouseOver(
								$author$project$Types$HoverEnter(
									$author$project$Types$HoverState(name))),
								$elm$svg$Svg$Events$onMouseOut($author$project$Types$HoverLeave),
								A2(
								$elm$html$Html$Events$custom,
								'click',
								$elm$json$Json$Decode$succeed(
									{
										dJ: $author$project$Types$ClickedState(name),
										dV: false,
										eg: true
									})),
								A2(
								$elm$html$Html$Events$custom,
								'dblclick',
								$elm$json$Json$Decode$succeed(
									{
										dJ: $author$project$Types$StartRename(name),
										dV: false,
										eg: true
									})),
								A2(
								$elm$html$Html$Events$custom,
								'mousedown',
								$elm$json$Json$Decode$succeed(
									{
										dJ: A3($author$project$Types$MouseDownOnState, name, 0, 0),
										dV: false,
										eg: true
									}))
							]),
						_List_Nil)
					]),
				_Utils_ap(
					innerEllipse,
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$text_,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$x(
									$author$project$Helpers$flt(pos.et)),
									$elm$svg$Svg$Attributes$y(
									$author$project$Helpers$flt(pos.eu)),
									$elm$svg$Svg$Attributes$textAnchor('middle'),
									$elm$svg$Svg$Attributes$dominantBaseline('middle'),
									$elm$svg$Svg$Attributes$fontSize('13'),
									$elm$svg$Svg$Attributes$fontWeight('bold'),
									$elm$svg$Svg$Attributes$fontFamily('monospace'),
									$elm$svg$Svg$Attributes$fill(textFill),
									$elm$svg$Svg$Attributes$pointerEvents('none')
								]),
							_List_fromArray(
								[
									$elm$svg$Svg$text(name)
								]))
						]))));
	});
var $elm$svg$Svg$Attributes$id = _VirtualDom_attribute('id');
var $elm$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		if (ma.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				return $elm$core$Maybe$Just(
					A2(func, a, b));
			}
		}
	});
var $elm$svg$Svg$marker = $elm$svg$Svg$trustedNode('marker');
var $elm$svg$Svg$Attributes$markerHeight = _VirtualDom_attribute('markerHeight');
var $elm$svg$Svg$Attributes$markerUnits = _VirtualDom_attribute('markerUnits');
var $elm$svg$Svg$Attributes$markerWidth = _VirtualDom_attribute('markerWidth');
var $elm$svg$Svg$Attributes$orient = _VirtualDom_attribute('orient');
var $elm$svg$Svg$Attributes$points = _VirtualDom_attribute('points');
var $elm$svg$Svg$polygon = $elm$svg$Svg$trustedNode('polygon');
var $elm$svg$Svg$Attributes$refX = _VirtualDom_attribute('refX');
var $elm$svg$Svg$Attributes$refY = _VirtualDom_attribute('refY');
var $author$project$View$Canvas$drawDFA = function (model) {
	var transitionList = $elm$core$Dict$toList(model.cF);
	var stateElements = A2(
		$elm$core$List$concatMap,
		function (_v6) {
			var name = _v6.a;
			var pos = _v6.b;
			return A7(
				$author$project$View$Canvas$drawState,
				model,
				name,
				pos,
				_Utils_eq(name, model.de),
				A2($elm$core$List$member, name, model.cN),
				_Utils_eq(
					model.du,
					$elm$core$Maybe$Just(name)),
				_Utils_eq(
					model.ep,
					$elm$core$Maybe$Just(name)));
		},
		$elm$core$Dict$toList(model.df));
	var hasBidirectional = F2(
		function (from, to) {
			return A2(
				$elm$core$List$any,
				function (_v4) {
					var _v5 = _v4.a;
					var fr = _v5.a;
					var tgt = _v4.b;
					return _Utils_eq(fr, to) && _Utils_eq(tgt, from);
				},
				transitionList);
		});
	var groupedLabels = A3(
		$elm$core$List$foldl,
		F2(
			function (_v2, acc) {
				var _v3 = _v2.a;
				var fr = _v3.a;
				var ch = _v3.b;
				var to = _v2.b;
				var key = fr + ('__' + to);
				var existing = A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					A2($elm$core$Dict$get, key, acc));
				return A3(
					$elm$core$Dict$insert,
					key,
					_Utils_ap(
						existing,
						_List_fromArray(
							[ch])),
					acc);
			}),
		$elm$core$Dict$empty,
		transitionList);
	var transitionElements = $elm$core$List$concat(
		A2(
			$elm$core$List$filterMap,
			function (pairKey) {
				var parts = A2($elm$core$String$split, '__', pairKey);
				var chars = A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					A2($elm$core$Dict$get, pairKey, groupedLabels));
				var label = A2($elm$core$String$join, ',', chars);
				if ((parts.b && parts.b.b) && (!parts.b.b.b)) {
					var from = parts.a;
					var _v1 = parts.b;
					var to = _v1.a;
					return A3(
						$elm$core$Maybe$map2,
						F2(
							function (fromPos, toPos) {
								var toRx = $author$project$View$Canvas$stateRx(to);
								var isActive = _Utils_eq(
									model.du,
									$elm$core$Maybe$Just(from));
								var fromRx = $author$project$View$Canvas$stateRx(from);
								return _Utils_eq(from, to) ? A8($author$project$View$Canvas$drawSelfLoop, label, fromPos, fromRx, isActive, model.dy, model.dC, from, to) : $author$project$View$Canvas$drawArrow(label)(fromPos)(toPos)(fromRx)(toRx)(
									A2(hasBidirectional, from, to))(isActive)(model.dy)(model.dC)(from)(to);
							}),
						A2($elm$core$Dict$get, from, model.df),
						A2($elm$core$Dict$get, to, model.df));
				} else {
					return $elm$core$Maybe$Nothing;
				}
			},
			$elm$core$Dict$keys(groupedLabels)));
	var arrowDef = A2(
		$elm$svg$Svg$defs,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$marker,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$id('arrow'),
						$elm$svg$Svg$Attributes$markerWidth('10'),
						$elm$svg$Svg$Attributes$markerHeight('10'),
						$elm$svg$Svg$Attributes$refX('8'),
						$elm$svg$Svg$Attributes$refY('3'),
						$elm$svg$Svg$Attributes$orient('auto'),
						$elm$svg$Svg$Attributes$markerUnits('strokeWidth')
					]),
				_List_fromArray(
					[
						A2(
						$elm$svg$Svg$polygon,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$points('0,0 0,6 9,3'),
								$elm$svg$Svg$Attributes$fill('#9fa8da')
							]),
						_List_Nil)
					])),
				A2(
				$elm$svg$Svg$marker,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$id('arrow-active'),
						$elm$svg$Svg$Attributes$markerWidth('10'),
						$elm$svg$Svg$Attributes$markerHeight('10'),
						$elm$svg$Svg$Attributes$refX('8'),
						$elm$svg$Svg$Attributes$refY('3'),
						$elm$svg$Svg$Attributes$orient('auto'),
						$elm$svg$Svg$Attributes$markerUnits('strokeWidth')
					]),
				_List_fromArray(
					[
						A2(
						$elm$svg$Svg$polygon,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$points('0,0 0,6 9,3'),
								$elm$svg$Svg$Attributes$fill('#69f0ae')
							]),
						_List_Nil)
					]))
			]));
	return A2(
		$elm$core$List$cons,
		arrowDef,
		_Utils_ap(transitionElements, stateElements));
};
var $elm$svg$Svg$g = $elm$svg$Svg$trustedNode('g');
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $elm$core$Dict$isEmpty = function (dict) {
	if (dict.$ === -2) {
		return true;
	} else {
		return false;
	}
};
var $elm$svg$Svg$Events$on = $elm$html$Html$Events$on;
var $author$project$View$Widgets$panelTitle = function (t) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'font-size', '1.35rem'),
				A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
				A2($elm$html$Html$Attributes$style, 'margin-bottom', '14px'),
				A2($elm$html$Html$Attributes$style, 'color', '#fff')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(t)
			]));
};
var $elm$svg$Svg$rect = $elm$svg$Svg$trustedNode('rect');
var $elm$core$Basics$round = _Basics_round;
var $elm$svg$Svg$Attributes$style = _VirtualDom_attribute('style');
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $author$project$View$Widgets$toolBtn = F4(
	function (icon, isActive, msg, titleText) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick(msg),
					$elm$html$Html$Attributes$title(titleText),
					A2($elm$html$Html$Attributes$style, 'width', '40px'),
					A2($elm$html$Html$Attributes$style, 'height', '40px'),
					A2(
					$elm$html$Html$Attributes$style,
					'background',
					isActive ? 'rgba(79,195,247,0.25)' : 'rgba(255,255,255,0.08)'),
					A2(
					$elm$html$Html$Attributes$style,
					'border',
					'1px solid ' + (isActive ? '#4fc3f7' : 'rgba(255,255,255,0.1)')),
					A2($elm$html$Html$Attributes$style, 'border-radius', '10px'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
					A2($elm$html$Html$Attributes$style, 'font-size', '1.1rem'),
					A2(
					$elm$html$Html$Attributes$style,
					'color',
					isActive ? '#4fc3f7' : '#e8eaf6')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(icon)
				]));
	});
var $author$project$View$Widgets$toolGroup = F2(
	function (label, children) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
					A2($elm$html$Html$Attributes$style, 'gap', '5px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'font-size', '0.72rem'),
							A2($elm$html$Html$Attributes$style, 'color', '#9fa8da'),
							A2($elm$html$Html$Attributes$style, 'font-weight', '500')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(label)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'gap', '6px')
						]),
					children)
				]));
	});
var $elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var $author$project$View$Widgets$undoRedoBtn = F4(
	function (icon, msg, enabled, titleText) {
		return A2(
			$elm$html$Html$button,
			_Utils_ap(
				_List_fromArray(
					[
						$elm$html$Html$Attributes$title(titleText),
						A2($elm$html$Html$Attributes$style, 'width', '40px'),
						A2($elm$html$Html$Attributes$style, 'height', '40px'),
						A2(
						$elm$html$Html$Attributes$style,
						'background',
						enabled ? 'rgba(224,64,251,0.18)' : 'rgba(255,255,255,0.04)'),
						A2(
						$elm$html$Html$Attributes$style,
						'border',
						'1px solid ' + (enabled ? '#e040fb' : 'rgba(255,255,255,0.08)')),
						A2($elm$html$Html$Attributes$style, 'border-radius', '10px'),
						A2($elm$html$Html$Attributes$style, 'font-size', '1.2rem'),
						A2(
						$elm$html$Html$Attributes$style,
						'color',
						enabled ? '#e040fb' : 'rgba(255,255,255,0.25)'),
						A2(
						$elm$html$Html$Attributes$style,
						'cursor',
						enabled ? 'pointer' : 'default')
					]),
				enabled ? _List_fromArray(
					[
						$elm$html$Html$Events$onClick(msg)
					]) : _List_Nil),
			_List_fromArray(
				[
					$elm$html$Html$text(icon)
				]));
	});
var $author$project$Types$ToggleStateList = {$: 47};
var $elm$core$Dict$sizeHelp = F2(
	function (n, dict) {
		sizeHelp:
		while (true) {
			if (dict.$ === -2) {
				return n;
			} else {
				var left = dict.d;
				var right = dict.e;
				var $temp$n = A2($elm$core$Dict$sizeHelp, n + 1, right),
					$temp$dict = left;
				n = $temp$n;
				dict = $temp$dict;
				continue sizeHelp;
			}
		}
	});
var $elm$core$Dict$size = function (dict) {
	return A2($elm$core$Dict$sizeHelp, 0, dict);
};
var $elm$core$List$sortWith = _List_sortWith;
var $author$project$Types$DeleteState = function (a) {
	return {$: 12, a: a};
};
var $author$project$Types$SetStartState = function (a) {
	return {$: 10, a: a};
};
var $author$project$Types$ToggleAcceptState = function (a) {
	return {$: 11, a: a};
};
var $author$project$View$Widgets$miniBtn = F4(
	function (label, msg, isActive, color) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick(msg),
					A2($elm$html$Html$Attributes$style, 'padding', '2px 7px'),
					A2($elm$html$Html$Attributes$style, 'font-size', '0.72rem'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + color),
					A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
					A2($elm$html$Html$Attributes$style, 'font-weight', '700'),
					A2(
					$elm$html$Html$Attributes$style,
					'background',
					isActive ? color : 'transparent'),
					A2(
					$elm$html$Html$Attributes$style,
					'color',
					isActive ? '#fff' : color)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(label)
				]));
	});
var $author$project$View$Panels$viewStateRow = F3(
	function (t, model, state) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
					A2($elm$html$Html$Attributes$style, 'padding', '4px 6px'),
					A2($elm$html$Html$Attributes$style, 'margin-bottom', '3px'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '6px'),
					A2(
					$elm$html$Html$Attributes$style,
					'border-left',
					'3px solid ' + (_Utils_eq(state, model.de) ? '#ffb74d' : (A2($elm$core$List$member, state, model.cN) ? '#4fc3f7' : '#444'))),
					A2($elm$html$Html$Attributes$style, 'background', 'rgba(255,255,255,0.03)')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
							A2($elm$html$Html$Attributes$style, 'font-size', '0.85rem')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(state)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'gap', '4px')
						]),
					_List_fromArray(
						[
							A4(
							$author$project$View$Widgets$miniBtn,
							'✎',
							$author$project$Types$StartRename(state),
							false,
							'#e040fb'),
							A4(
							$author$project$View$Widgets$miniBtn,
							'S',
							$author$project$Types$SetStartState(state),
							_Utils_eq(state, model.de),
							'#ffb74d'),
							A4(
							$author$project$View$Widgets$miniBtn,
							'A',
							$author$project$Types$ToggleAcceptState(state),
							A2($elm$core$List$member, state, model.cN),
							'#4fc3f7'),
							A4(
							$author$project$View$Widgets$miniBtn,
							'X',
							$author$project$Types$DeleteState(state),
							false,
							'#ef5350')
						]))
				]));
	});
var $author$project$View$Panels$viewStateList = F2(
	function (t, model) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'margin-top', '12px'),
					A2($elm$html$Html$Attributes$style, 'flex-shrink', '0'),
					A2($elm$html$Html$Attributes$style, 'background', 'rgba(255,255,255,0.04)'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '10px'),
					A2($elm$html$Html$Attributes$style, 'padding', '10px 12px')
				]),
			_List_fromArray(
				[
					A3(
					$author$project$View$Widgets$collapsibleHeader,
					t.ck(
						$elm$core$Dict$size(model.df)),
					model.ed,
					$author$project$Types$ToggleStateList),
					model.ed ? $elm$html$Html$text('') : A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'margin-top', '8px'),
							A2($elm$html$Html$Attributes$style, 'max-height', '160px'),
							A2($elm$html$Html$Attributes$style, 'overflow-y', 'auto')
						]),
					_Utils_ap(
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'font-size', '0.68rem'),
										A2($elm$html$Html$Attributes$style, 'color', '#9fa8da'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '6px'),
										A2($elm$html$Html$Attributes$style, 'letter-spacing', '0.3px')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(t.cj)
									]))
							]),
						A2(
							$elm$core$List$map,
							A2($author$project$View$Panels$viewStateRow, t, model),
							A2(
								$elm$core$List$sortWith,
								F2(
									function (a, b) {
										var idx = function (s) {
											return A2($elm$core$String$startsWith, 'q', s) ? A2(
												$elm$core$Maybe$withDefault,
												-1,
												$elm$core$String$toInt(
													A2($elm$core$String$dropLeft, 1, s))) : (-1);
										};
										return A2(
											$elm$core$Basics$compare,
											idx(a),
											idx(b));
									}),
								$elm$core$Dict$keys(model.df)))))
				]));
	});
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $author$project$View$viewDiagramPanel = F2(
	function (t, model) {
		return A2(
			$author$project$View$Widgets$panel,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
					A2($elm$html$Html$Attributes$style, 'min-height', '0'),
					A2($elm$html$Html$Attributes$style, 'min-width', '0')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
							A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
							A2($elm$html$Html$Attributes$style, 'margin-bottom', '12px'),
							A2($elm$html$Html$Attributes$style, 'flex-shrink', '0')
						]),
					_List_fromArray(
						[
							$author$project$View$Widgets$panelTitle(t.ci)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'flex', '1'),
							A2($elm$html$Html$Attributes$style, 'position', 'relative'),
							A2($elm$html$Html$Attributes$style, 'background', 'rgba(255,255,255,0.025)'),
							A2($elm$html$Html$Attributes$style, 'border', '1px dashed rgba(255,255,255,0.12)'),
							A2($elm$html$Html$Attributes$style, 'border-radius', '12px'),
							A2($elm$html$Html$Attributes$style, 'overflow', 'hidden'),
							A2($elm$html$Html$Attributes$style, 'min-height', '0')
						]),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$svg,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$width('100%'),
									$elm$svg$Svg$Attributes$height('100%'),
									$elm$svg$Svg$Attributes$style(
									'display:block; cursor: ' + function () {
										if (model.dG) {
											return 'grabbing';
										} else {
											var _v0 = model.dy;
											switch (_v0) {
												case 1:
													return 'crosshair';
												case 2:
													return 'cell';
												case 0:
													var _v1 = model.dx;
													if (!_v1.$) {
														return 'grabbing';
													} else {
														return 'grab';
													}
												default:
													return 'pointer';
											}
										}
									}()),
									A2(
									$elm$svg$Svg$Events$on,
									'mousemove',
									A3(
										$elm$json$Json$Decode$map2,
										F2(
											function (ox, oy) {
												return model.dG ? A2($author$project$Types$PanMove, ox, oy) : A2($author$project$Types$MouseMove, (ox - model.ei) / model.ek, (oy - model.ej) / model.ek);
											}),
										A2($elm$json$Json$Decode$field, 'offsetX', $elm$json$Json$Decode$float),
										A2($elm$json$Json$Decode$field, 'offsetY', $elm$json$Json$Decode$float))),
									A2(
									$elm$svg$Svg$Events$on,
									'mouseup',
									$elm$json$Json$Decode$succeed($author$project$Types$MouseUp))
								]),
							_List_fromArray(
								[
									A2(
									$elm$svg$Svg$rect,
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$x('0'),
											$elm$svg$Svg$Attributes$y('0'),
											$elm$svg$Svg$Attributes$width('100%'),
											$elm$svg$Svg$Attributes$height('100%'),
											$elm$svg$Svg$Attributes$fill('transparent'),
											A2(
											$elm$html$Html$Events$custom,
											'click',
											A3(
												$elm$json$Json$Decode$map2,
												F2(
													function (ox, oy) {
														return {
															dJ: A2($author$project$Types$ClickedCanvas, (ox - model.ei) / model.ek, (oy - model.ej) / model.ek),
															dV: false,
															eg: false
														};
													}),
												A2($elm$json$Json$Decode$field, 'offsetX', $elm$json$Json$Decode$float),
												A2($elm$json$Json$Decode$field, 'offsetY', $elm$json$Json$Decode$float))),
											A2(
											$elm$svg$Svg$Events$on,
											'mousedown',
											A3(
												$elm$json$Json$Decode$map2,
												$author$project$Types$PanStart,
												A2($elm$json$Json$Decode$field, 'offsetX', $elm$json$Json$Decode$float),
												A2($elm$json$Json$Decode$field, 'offsetY', $elm$json$Json$Decode$float)))
										]),
									_List_Nil),
									A2(
									$elm$svg$Svg$g,
									_List_fromArray(
										[
											$elm$svg$Svg$Attributes$transform(
											'translate(' + ($author$project$Helpers$flt(model.ei) + (',' + ($author$project$Helpers$flt(model.ej) + (') scale(' + ($author$project$Helpers$flt(model.ek) + ')'))))))
										]),
									$author$project$View$Canvas$drawDFA(model))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'gap', '24px'),
							A2($elm$html$Html$Attributes$style, 'margin-top', '12px'),
							A2($elm$html$Html$Attributes$style, 'align-items', 'flex-start')
						]),
					_List_fromArray(
						[
							A2(
							$author$project$View$Widgets$toolGroup,
							t.W,
							_List_fromArray(
								[
									A4(
									$author$project$View$Widgets$toolBtn,
									'✋',
									!model.dy,
									$author$project$Types$SetDrawTool(0),
									t.bN),
									A4(
									$author$project$View$Widgets$toolBtn,
									'⊕',
									model.dy === 1,
									$author$project$Types$SetDrawTool(1),
									t.I),
									A4(
									$author$project$View$Widgets$toolBtn,
									'→',
									model.dy === 2,
									$author$project$Types$SetDrawTool(2),
									t.J),
									A4(
									$author$project$View$Widgets$toolBtn,
									'X',
									model.dy === 3,
									$author$project$Types$SetDrawTool(3),
									t.V)
								])),
							A2(
							$author$project$View$Widgets$toolGroup,
							t.G,
							_List_fromArray(
								[
									A4(
									$author$project$View$Widgets$undoRedoBtn,
									'↩',
									$author$project$Types$Undo,
									!_Utils_eq(model.eq, _List_Nil),
									t.cH),
									A4(
									$author$project$View$Widgets$undoRedoBtn,
									'↪',
									$author$project$Types$Redo,
									!_Utils_eq(model.dW, _List_Nil),
									t.bF)
								])),
							A2(
							$author$project$View$Widgets$toolGroup,
							t.cI,
							_List_fromArray(
								[
									A4($author$project$View$Widgets$toolBtn, '+', false, $author$project$Types$ZoomIn, t.cL),
									A4($author$project$View$Widgets$toolBtn, '−', false, $author$project$Types$ZoomOut, t.cM),
									A4($author$project$View$Widgets$toolBtn, '⌂', false, $author$project$Types$ResetView, t.bK),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'font-size', '0.68rem'),
											A2($elm$html$Html$Attributes$style, 'color', '#9fa8da'),
											A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
											A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
											A2($elm$html$Html$Attributes$style, 'min-width', '36px'),
											A2($elm$html$Html$Attributes$style, 'line-height', '40px')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$elm$core$String$fromInt(
												$elm$core$Basics$round(model.ek * 100)) + '%')
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick($author$project$Types$ExportSvg),
											$elm$html$Html$Attributes$title(t.Z),
											A2($elm$html$Html$Attributes$style, 'background', 'rgba(38,166,154,0.2)'),
											A2($elm$html$Html$Attributes$style, 'border', '1.5px solid rgba(38,166,154,0.6)'),
											A2($elm$html$Html$Attributes$style, 'color', '#80cbc4'),
											A2($elm$html$Html$Attributes$style, 'width', '40px'),
											A2($elm$html$Html$Attributes$style, 'height', '40px'),
											A2($elm$html$Html$Attributes$style, 'border-radius', '10px'),
											A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
											A2($elm$html$Html$Attributes$style, 'font-size', '0.72rem'),
											A2($elm$html$Html$Attributes$style, 'font-weight', '700'),
											A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
											A2($elm$html$Html$Attributes$style, 'display', 'flex'),
											A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
											A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
											A2($elm$html$Html$Attributes$style, 'padding', '0')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('SVG')
										]))
								]))
						])),
					(!$elm$core$Dict$isEmpty(model.df)) ? A2($author$project$View$Panels$viewStateList, t, model) : $elm$html$Html$text('')
				]));
	});
var $author$project$Types$ToggleFeedback = {$: 30};
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$html$Html$Attributes$target = $elm$html$Html$Attributes$stringProperty('target');
var $author$project$View$Panels$viewFeedbackModal = function (t) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
				A2($elm$html$Html$Attributes$style, 'inset', '0'),
				A2($elm$html$Html$Attributes$style, 'background', 'rgba(0,0,0,0.7)'),
				A2($elm$html$Html$Attributes$style, 'z-index', '300'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
				A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
				$elm$html$Html$Events$onClick($author$project$Types$ToggleFeedback)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'background', '#1e1e3a'),
						A2($elm$html$Html$Attributes$style, 'border', '1px solid rgba(224,64,251,0.4)'),
						A2($elm$html$Html$Attributes$style, 'border-radius', '16px'),
						A2($elm$html$Html$Attributes$style, 'padding', '26px 28px'),
						A2($elm$html$Html$Attributes$style, 'max-width', '400px'),
						A2($elm$html$Html$Attributes$style, 'width', '90%'),
						A2($elm$html$Html$Attributes$style, 'box-shadow', '0 8px 32px rgba(0,0,0,0.5)'),
						A2(
						$elm$html$Html$Events$custom,
						'click',
						$elm$json$Json$Decode$succeed(
							{dJ: $author$project$Types$NoOp, dV: false, eg: true}))
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h3,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-top', '0'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '6px'),
								A2($elm$html$Html$Attributes$style, 'font-size', '1.1rem')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(t.ab)
							])),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'font-size', '0.83rem'),
								A2($elm$html$Html$Attributes$style, 'color', '#c5cae9'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '18px'),
								A2($elm$html$Html$Attributes$style, 'line-height', '1.6')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(t.aa)
							])),
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$href('https://forms.gle/kP81UtQw5daQhpiH7'),
								$elm$html$Html$Attributes$target('_blank'),
								A2($elm$html$Html$Attributes$style, 'display', 'block'),
								A2($elm$html$Html$Attributes$style, 'background', 'linear-gradient(135deg, #7c4dff, #e040fb)'),
								A2($elm$html$Html$Attributes$style, 'color', 'white'),
								A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
								A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
								A2($elm$html$Html$Attributes$style, 'padding', '10px 0'),
								A2($elm$html$Html$Attributes$style, 'border-radius', '10px'),
								A2($elm$html$Html$Attributes$style, 'font-size', '0.85rem'),
								A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '12px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(t.bD)
							])),
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$href('mailto:florakanuch@gmail.com'),
								A2($elm$html$Html$Attributes$style, 'display', 'block'),
								A2($elm$html$Html$Attributes$style, 'background', 'rgba(255,255,255,0.07)'),
								A2($elm$html$Html$Attributes$style, 'color', '#c5cae9'),
								A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
								A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
								A2($elm$html$Html$Attributes$style, 'padding', '10px 0'),
								A2($elm$html$Html$Attributes$style, 'border-radius', '10px'),
								A2($elm$html$Html$Attributes$style, 'font-size', '0.85rem'),
								A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '16px'),
								A2($elm$html$Html$Attributes$style, 'border', '1px solid rgba(255,255,255,0.1)')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('✉️ florakanuch@gmail.com')
							])),
						A5($author$project$View$Widgets$styledBtn, t.Q, $author$project$Types$ToggleFeedback, 'rgba(255,255,255,0.1)', '100%', '9px 0')
					]))
			]));
};
var $author$project$Types$ToggleHelp = {$: 29};
var $author$project$View$Widgets$helpLine = F2(
	function (title, body) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'margin-bottom', '8px'),
					A2($elm$html$Html$Attributes$style, 'font-size', '0.83rem'),
					A2($elm$html$Html$Attributes$style, 'line-height', '1.5')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', '#e040fb'),
							A2($elm$html$Html$Attributes$style, 'font-weight', '700')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(title + ': ')
						])),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', '#c5cae9')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(body)
						]))
				]));
	});
var $author$project$View$Panels$helpSectionTitle = function (t) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'font-size', '0.78rem'),
				A2($elm$html$Html$Attributes$style, 'font-weight', '700'),
				A2($elm$html$Html$Attributes$style, 'color', '#7c4dff'),
				A2($elm$html$Html$Attributes$style, 'letter-spacing', '0.8px'),
				A2($elm$html$Html$Attributes$style, 'text-transform', 'uppercase'),
				A2($elm$html$Html$Attributes$style, 'margin-top', '16px'),
				A2($elm$html$Html$Attributes$style, 'margin-bottom', '6px'),
				A2($elm$html$Html$Attributes$style, 'border-bottom', '1px solid rgba(124,77,255,0.25)'),
				A2($elm$html$Html$Attributes$style, 'padding-bottom', '4px')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(t)
			]));
};
var $author$project$View$Widgets$purpleGrad = 'linear-gradient(135deg, #7c4dff, #e040fb)';
var $author$project$View$Panels$statusExplain = F6(
	function (t, fieldName, general, testPanel, codePanel, diagram) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'margin-bottom', '12px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'font-weight', '700'),
							A2($elm$html$Html$Attributes$style, 'color', '#e040fb'),
							A2($elm$html$Html$Attributes$style, 'margin-bottom', '3px')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(fieldName)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', '#c5cae9'),
							A2($elm$html$Html$Attributes$style, 'margin-bottom', '4px')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(general)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
							A2($elm$html$Html$Attributes$style, 'gap', '2px'),
							A2($elm$html$Html$Attributes$style, 'padding-left', '8px'),
							A2($elm$html$Html$Attributes$style, 'border-left', '2px solid rgba(124,77,255,0.3)')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'color', '#9fa8da'),
											A2($elm$html$Html$Attributes$style, 'font-size', '0.75rem')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(t.cq)
										])),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'color', '#e8eaf6'),
											A2($elm$html$Html$Attributes$style, 'font-size', '0.75rem')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(testPanel)
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'color', '#9fa8da'),
											A2($elm$html$Html$Attributes$style, 'font-size', '0.75rem')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(t.cn)
										])),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'color', '#e8eaf6'),
											A2($elm$html$Html$Attributes$style, 'font-size', '0.75rem')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(codePanel)
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'color', '#9fa8da'),
											A2($elm$html$Html$Attributes$style, 'font-size', '0.75rem')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(t.co)
										])),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'color', '#e8eaf6'),
											A2($elm$html$Html$Attributes$style, 'font-size', '0.75rem')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(diagram)
										]))
								]))
						]))
				]));
	});
var $author$project$View$Panels$viewHelpModal = function (t) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
				A2($elm$html$Html$Attributes$style, 'inset', '0'),
				A2($elm$html$Html$Attributes$style, 'background', 'rgba(0,0,0,0.7)'),
				A2($elm$html$Html$Attributes$style, 'z-index', '300'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
				A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
				$elm$html$Html$Events$onClick($author$project$Types$ToggleHelp)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'background', '#1e1e3a'),
						A2($elm$html$Html$Attributes$style, 'border', '1px solid rgba(124,77,255,0.4)'),
						A2($elm$html$Html$Attributes$style, 'border-radius', '16px'),
						A2($elm$html$Html$Attributes$style, 'padding', '26px 28px'),
						A2($elm$html$Html$Attributes$style, 'max-width', '700px'),
						A2($elm$html$Html$Attributes$style, 'width', '90%'),
						A2($elm$html$Html$Attributes$style, 'max-height', '88vh'),
						A2($elm$html$Html$Attributes$style, 'overflow-y', 'auto'),
						A2($elm$html$Html$Attributes$style, 'box-shadow', '0 8px 32px rgba(0,0,0,0.5)'),
						A2(
						$elm$html$Html$Events$custom,
						'click',
						$elm$json$Json$Decode$succeed(
							{dJ: $author$project$Types$NoOp, dV: false, eg: true}))
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h3,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-top', '0'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '6px'),
								A2($elm$html$Html$Attributes$style, 'font-size', '1.2rem'),
								A2($elm$html$Html$Attributes$style, 'color', '#fff')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(t.bf)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'background', 'rgba(124,77,255,0.12)'),
								A2($elm$html$Html$Attributes$style, 'border', '1px solid rgba(124,77,255,0.35)'),
								A2($elm$html$Html$Attributes$style, 'border-radius', '10px'),
								A2($elm$html$Html$Attributes$style, 'padding', '12px 14px'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '18px'),
								A2($elm$html$Html$Attributes$style, 'font-size', '0.83rem'),
								A2($elm$html$Html$Attributes$style, 'color', '#c5cae9'),
								A2($elm$html$Html$Attributes$style, 'line-height', '1.65')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'margin', '0 0 6px 0'),
										A2($elm$html$Html$Attributes$style, 'font-weight', '700'),
										A2($elm$html$Html$Attributes$style, 'color', '#e8eaf6')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(t.cJ)
									])),
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'margin', '0')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(t.cK)
									]))
							])),
						$author$project$View$Panels$helpSectionTitle(t.a1),
						A2($author$project$View$Widgets$helpLine, t.a$, t.a0),
						A2($author$project$View$Widgets$helpLine, t.aH, t.aI),
						$author$project$View$Panels$helpSectionTitle(t.av),
						A2($author$project$View$Widgets$helpLine, t.a2, t.a3),
						A2($author$project$View$Widgets$helpLine, t.af, t.ag),
						A2($author$project$View$Widgets$helpLine, t.ah, t.ai),
						A2($author$project$View$Widgets$helpLine, t.at, t.au),
						A2($author$project$View$Widgets$helpLine, t.aR, t.aS),
						A2($author$project$View$Widgets$helpLine, t.aX, t.aY),
						A2($author$project$View$Widgets$helpLine, t.aL, t.aM),
						A2($author$project$View$Widgets$helpLine, t.bj, t.bk),
						A2($author$project$View$Widgets$helpLine, t.aZ, t.a_),
						$author$project$View$Panels$helpSectionTitle(t.bi),
						A2($author$project$View$Widgets$helpLine, t.bh, t.bg),
						A2($author$project$View$Widgets$helpLine, t.aQ, t.aP),
						A2($author$project$View$Widgets$helpLine, t.am, t.al),
						$author$project$View$Panels$helpSectionTitle(t.an),
						A2($author$project$View$Widgets$helpLine, t.ay, t.az),
						A2($author$project$View$Widgets$helpLine, t.aA, t.aB),
						A2($author$project$View$Widgets$helpLine, t.aw, t.ax),
						$author$project$View$Panels$helpSectionTitle(t.a4),
						A2($author$project$View$Widgets$helpLine, t.bd, t.be),
						A2($author$project$View$Widgets$helpLine, t.aJ, t.aK),
						A2($author$project$View$Widgets$helpLine, t.aV, t.aW),
						A2($author$project$View$Widgets$helpLine, t.a5, t.a6),
						A2($author$project$View$Widgets$helpLine, t.aj, t.ak),
						A2($author$project$View$Widgets$helpLine, t.aN, t.aO),
						A2($author$project$View$Widgets$helpLine, t.aT, t.aU),
						$author$project$View$Panels$helpSectionTitle(t.bc),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'background', 'rgba(255,255,255,0.04)'),
								A2($elm$html$Html$Attributes$style, 'border-radius', '10px'),
								A2($elm$html$Html$Attributes$style, 'padding', '12px 14px'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '6px'),
								A2($elm$html$Html$Attributes$style, 'font-size', '0.8rem'),
								A2($elm$html$Html$Attributes$style, 'line-height', '1.7')
							]),
						_List_fromArray(
							[
								A6($author$project$View$Panels$statusExplain, t, t.a9, t.ba, t.bb, t.a7, t.a8),
								A6($author$project$View$Panels$statusExplain, t, t.aE, t.aF, t.aG, t.aC, t.aD),
								A6($author$project$View$Panels$statusExplain, t, t.aq, t.ar, t.as, t.ao, t.ap)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-top', '18px')
							]),
						_List_fromArray(
							[
								A5($author$project$View$Widgets$styledBtn, t.ad, $author$project$Types$ToggleHelp, $author$project$View$Widgets$purpleGrad, '100%', '9px 0')
							]))
					]))
			]));
};
var $author$project$Types$CloseLoadModal = {$: 64};
var $author$project$Types$RequestImportFile = {$: 74};
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $author$project$View$modalBackdrop = F2(
	function (closeMsg, children) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
					A2($elm$html$Html$Attributes$style, 'inset', '0'),
					A2($elm$html$Html$Attributes$style, 'background', 'rgba(0,0,0,0.65)'),
					A2($elm$html$Html$Attributes$style, 'z-index', '9999'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
					$elm$html$Html$Events$onClick(closeMsg)
				]),
			children);
	});
var $author$project$View$modalCard = function (children) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'background', '#1e1e3a'),
				A2($elm$html$Html$Attributes$style, 'border', '1px solid rgba(124,77,255,0.4)'),
				A2($elm$html$Html$Attributes$style, 'border-radius', '18px'),
				A2($elm$html$Html$Attributes$style, 'padding', '28px 32px'),
				A2($elm$html$Html$Attributes$style, 'width', '560px'),
				A2($elm$html$Html$Attributes$style, 'max-width', '95vw'),
				A2($elm$html$Html$Attributes$style, 'max-height', '82vh'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
				A2($elm$html$Html$Attributes$style, 'box-shadow', '0 8px 48px rgba(0,0,0,0.7)'),
				A2($elm$html$Html$Attributes$style, 'font-family', '\'Segoe UI\', Arial, sans-serif'),
				A2($elm$html$Html$Attributes$style, 'color', '#e8eaf6'),
				A2(
				$elm$html$Html$Events$stopPropagationOn,
				'click',
				$elm$json$Json$Decode$succeed(
					_Utils_Tuple2($author$project$Types$NoOp, true)))
			]),
		children);
};
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $author$project$View$modalHeader = F2(
	function (title, closeMsg) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h2,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'font-size', '1.25rem'),
							A2($elm$html$Html$Attributes$style, 'font-weight', '700'),
							A2($elm$html$Html$Attributes$style, 'color', '#fff'),
							A2($elm$html$Html$Attributes$style, 'margin', '0')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(title)
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Events$onClick(closeMsg),
							A2($elm$html$Html$Attributes$style, 'margin-left', 'auto'),
							A2($elm$html$Html$Attributes$style, 'background', 'transparent'),
							A2($elm$html$Html$Attributes$style, 'border', 'none'),
							A2($elm$html$Html$Attributes$style, 'color', '#9fa8da'),
							A2($elm$html$Html$Attributes$style, 'font-size', '1.3rem'),
							A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
							A2($elm$html$Html$Attributes$style, 'line-height', '1'),
							A2($elm$html$Html$Attributes$style, 'padding', '0 4px')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('✕')
						]))
				]));
	});
var $author$project$View$modalSectionLabel = function (lbl) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'font-size', '0.72rem'),
				A2($elm$html$Html$Attributes$style, 'color', '#7986cb'),
				A2($elm$html$Html$Attributes$style, 'letter-spacing', '0.5px'),
				A2($elm$html$Html$Attributes$style, 'text-transform', 'uppercase'),
				A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
				A2($elm$html$Html$Attributes$style, 'margin-bottom', '10px')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(lbl)
			]));
};
var $author$project$Types$DeleteSavedDiagram = function (a) {
	return {$: 67, a: a};
};
var $author$project$Types$ExportDiagram = function (a) {
	return {$: 73, a: a};
};
var $author$project$Types$LoadSavedDiagram = function (a) {
	return {$: 68, a: a};
};
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $author$project$View$savedBtn = F7(
	function (lbl, cursor, msg, bg, border, color, cssClass) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick(msg),
					$elm$html$Html$Attributes$class(cssClass),
					A2($elm$html$Html$Attributes$style, 'background', bg),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + border),
					A2($elm$html$Html$Attributes$style, 'color', color),
					A2($elm$html$Html$Attributes$style, 'padding', '5px 12px'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
					A2($elm$html$Html$Attributes$style, 'cursor', cursor),
					A2($elm$html$Html$Attributes$style, 'font-family', 'inherit'),
					A2($elm$html$Html$Attributes$style, 'font-size', '0.78rem'),
					A2($elm$html$Html$Attributes$style, 'font-weight', '600')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(lbl)
				]));
	});
var $author$project$View$savedItemMeta = F2(
	function (t, saved) {
		var tc = $elm$core$List$length(
			A2(
				$elm$core$List$filter,
				A2(
					$elm$core$Basics$composeR,
					$elm$core$String$trim,
					$elm$core$Basics$neq('')),
				$elm$core$String$lines(saved.cU.cF)));
		var sc = $elm$core$List$length(
			A2(
				$elm$core$List$filter,
				A2(
					$elm$core$Basics$composeR,
					$elm$core$String$trim,
					$elm$core$Basics$neq('')),
				A2($elm$core$String$split, ',', saved.cU.ef)));
		return _Utils_ap(
			(saved.d1 !== '') ? (saved.d1 + '  ·  ') : '',
			A2(t.cm, sc, tc));
	});
var $author$project$View$savedItemName = function (name) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
				A2($elm$html$Html$Attributes$style, 'font-size', '0.92rem'),
				A2($elm$html$Html$Attributes$style, 'color', '#fff'),
				A2($elm$html$Html$Attributes$style, 'white-space', 'nowrap'),
				A2($elm$html$Html$Attributes$style, 'overflow', 'hidden'),
				A2($elm$html$Html$Attributes$style, 'text-overflow', 'ellipsis')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(name)
			]));
};
var $author$project$View$viewLoadItem = F2(
	function (t, saved) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'background', 'rgba(255,255,255,0.05)'),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid rgba(255,255,255,0.1)'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '12px'),
					A2($elm$html$Html$Attributes$style, 'padding', '12px 16px'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'gap', '12px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'flex', '1'),
							A2($elm$html$Html$Attributes$style, 'min-width', '0')
						]),
					_List_fromArray(
						[
							$author$project$View$savedItemName(saved.bB),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'font-size', '0.73rem'),
									A2($elm$html$Html$Attributes$style, 'color', '#7986cb'),
									A2($elm$html$Html$Attributes$style, 'margin-top', '3px')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									A2($author$project$View$savedItemMeta, t, saved))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'gap', '6px'),
							A2($elm$html$Html$Attributes$style, 'flex-shrink', '0')
						]),
					_List_fromArray(
						[
							A7(
							$author$project$View$savedBtn,
							t.bs,
							'pointer',
							$author$project$Types$LoadSavedDiagram(saved.c0),
							'rgba(124,77,255,0.2)',
							'rgba(124,77,255,0.5)',
							'#ce93d8',
							'dfa-btn-purple'),
							A7(
							$author$project$View$savedBtn,
							t.Y,
							'pointer',
							$author$project$Types$ExportDiagram(saved.c0),
							'rgba(38,166,154,0.18)',
							'rgba(38,166,154,0.5)',
							'#80cbc4',
							'dfa-btn-teal'),
							A7(
							$author$project$View$savedBtn,
							t.br,
							'pointer',
							$author$project$Types$DeleteSavedDiagram(saved.c0),
							'rgba(239,83,80,0.15)',
							'rgba(239,83,80,0.4)',
							'#ef9a9a',
							'dfa-btn-red')
						]))
				]));
	});
var $author$project$View$viewLoadModal = F2(
	function (t, model) {
		return A2(
			$author$project$View$modalBackdrop,
			$author$project$Types$CloseLoadModal,
			_List_fromArray(
				[
					$author$project$View$modalCard(
					_List_fromArray(
						[
							A2($author$project$View$modalHeader, t.bt, $author$project$Types$CloseLoadModal),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
									A2($elm$html$Html$Attributes$style, 'gap', '10px'),
									A2($elm$html$Html$Attributes$style, 'margin-bottom', '14px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick($author$project$Types$RequestImportFile),
											A2($elm$html$Html$Attributes$style, 'background', 'rgba(38,166,154,0.18)'),
											A2($elm$html$Html$Attributes$style, 'border', '1px solid rgba(38,166,154,0.5)'),
											A2($elm$html$Html$Attributes$style, 'color', '#80cbc4'),
											A2($elm$html$Html$Attributes$style, 'padding', '8px 18px'),
											A2($elm$html$Html$Attributes$style, 'border-radius', '10px'),
											A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
											A2($elm$html$Html$Attributes$style, 'font-family', 'inherit'),
											A2($elm$html$Html$Attributes$style, 'font-size', '0.85rem'),
											A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
											A2($elm$html$Html$Attributes$style, 'white-space', 'nowrap')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(t.bl)
										])),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'font-size', '0.75rem'),
											A2($elm$html$Html$Attributes$style, 'color', '#5c6bc0')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(t.bm)
										]))
								])),
							$author$project$View$modalSectionLabel(t.bA),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
									A2($elm$html$Html$Attributes$style, 'gap', '8px'),
									A2($elm$html$Html$Attributes$style, 'overflow-y', 'auto'),
									A2($elm$html$Html$Attributes$style, 'max-height', '360px')
								]),
							$elm$core$List$isEmpty(model.D) ? _List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
											A2($elm$html$Html$Attributes$style, 'color', '#5c6bc0'),
											A2($elm$html$Html$Attributes$style, 'font-size', '0.85rem'),
											A2($elm$html$Html$Attributes$style, 'padding', '32px 0')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(t.bu)
										]))
								]) : A2(
								$elm$core$List$map,
								$author$project$View$viewLoadItem(t),
								$elm$core$List$reverse(model.D)))
						]))
				]));
	});
var $author$project$Types$CancelRename = {$: 9};
var $author$project$Types$ConfirmRename = {$: 8};
var $author$project$Types$SetRenameValue = function (a) {
	return {$: 7, a: a};
};
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$fail = _Json_fail;
var $author$project$View$Panels$viewRenamePopup = F3(
	function (t, stateName, currentVal) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
					A2($elm$html$Html$Attributes$style, 'inset', '0'),
					A2($elm$html$Html$Attributes$style, 'background', 'rgba(0,0,0,0.6)'),
					A2($elm$html$Html$Attributes$style, 'z-index', '200'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'background', '#1e1e3a'),
							A2($elm$html$Html$Attributes$style, 'border', '2px solid #e040fb'),
							A2($elm$html$Html$Attributes$style, 'border-radius', '14px'),
							A2($elm$html$Html$Attributes$style, 'padding', '22px 24px'),
							A2($elm$html$Html$Attributes$style, 'min-width', '260px'),
							A2($elm$html$Html$Attributes$style, 'box-shadow', '0 8px 32px rgba(0,0,0,0.5)')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'font-size', '0.9rem'),
									A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
									A2($elm$html$Html$Attributes$style, 'margin-bottom', '6px')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									_Utils_ap(t.bI, stateName))
								])),
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$value(currentVal),
									$elm$html$Html$Events$onInput($author$project$Types$SetRenameValue),
									A2(
									$elm$html$Html$Events$on,
									'keydown',
									A2(
										$elm$json$Json$Decode$andThen,
										function (k) {
											return (k === 'Enter') ? $elm$json$Json$Decode$succeed($author$project$Types$ConfirmRename) : ((k === 'Escape') ? $elm$json$Json$Decode$succeed($author$project$Types$CancelRename) : $elm$json$Json$Decode$fail('other key'));
										},
										A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string))),
									A2($elm$html$Html$Attributes$style, 'width', '100%'),
									A2($elm$html$Html$Attributes$style, 'background', 'rgba(255,255,255,0.06)'),
									A2($elm$html$Html$Attributes$style, 'border', '1px solid #e040fb'),
									A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
									A2($elm$html$Html$Attributes$style, 'padding', '8px 12px'),
									A2($elm$html$Html$Attributes$style, 'color', '#e8eaf6'),
									A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
									A2($elm$html$Html$Attributes$style, 'font-size', '0.9rem'),
									A2($elm$html$Html$Attributes$style, 'outline', 'none'),
									A2($elm$html$Html$Attributes$style, 'box-sizing', 'border-box'),
									A2($elm$html$Html$Attributes$style, 'margin-bottom', '12px')
								]),
							_List_Nil),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'gap', '10px')
								]),
							_List_fromArray(
								[
									A5($author$project$View$Widgets$styledBtn, t.bG, $author$project$Types$ConfirmRename, $author$project$View$Widgets$purpleGrad, '50%', '8px 0'),
									A5($author$project$View$Widgets$styledBtn, t.N, $author$project$Types$CancelRename, 'rgba(255,255,255,0.1)', '50%', '8px 0')
								]))
						]))
				]));
	});
var $author$project$Types$CloseSaveModal = {$: 62};
var $author$project$Types$ConfirmSave = {$: 66};
var $author$project$Types$SetSaveNameInput = function (a) {
	return {$: 65, a: a};
};
var $author$project$View$modalPrimaryBtn = F2(
	function (lbl, msg) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick(msg),
					A2($elm$html$Html$Attributes$style, 'background', 'linear-gradient(135deg, #7c4dff, #e040fb)'),
					A2($elm$html$Html$Attributes$style, 'border', 'none'),
					A2($elm$html$Html$Attributes$style, 'color', '#fff'),
					A2($elm$html$Html$Attributes$style, 'padding', '9px 22px'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '10px'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
					A2($elm$html$Html$Attributes$style, 'font-family', 'inherit'),
					A2($elm$html$Html$Attributes$style, 'font-size', '0.88rem'),
					A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
					A2($elm$html$Html$Attributes$style, 'white-space', 'nowrap')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(lbl)
				]));
	});
var $author$project$Types$CancelRenameDiagram = {$: 72};
var $author$project$Types$ConfirmRenameDiagram = {$: 71};
var $author$project$Types$SetRenameDiagramValue = function (a) {
	return {$: 70, a: a};
};
var $author$project$Types$StartRenameDiagram = function (a) {
	return {$: 69, a: a};
};
var $author$project$View$viewSaveItem = F3(
	function (t, model, saved) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'background', 'rgba(255,255,255,0.05)'),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid rgba(255,255,255,0.1)'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '12px'),
					A2($elm$html$Html$Attributes$style, 'padding', '12px 16px'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'gap', '12px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'flex', '1'),
							A2($elm$html$Html$Attributes$style, 'min-width', '0')
						]),
					_List_fromArray(
						[
							function () {
							var _v0 = model.dZ;
							if (!_v0.$) {
								var rid = _v0.a;
								return _Utils_eq(rid, saved.c0) ? A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'display', 'flex'),
											A2($elm$html$Html$Attributes$style, 'gap', '6px')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$input,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$value(model.dX),
													$elm$html$Html$Events$onInput($author$project$Types$SetRenameDiagramValue),
													A2(
													$elm$html$Html$Events$on,
													'keydown',
													A2(
														$elm$json$Json$Decode$andThen,
														function (k) {
															return (k === 'Enter') ? $elm$json$Json$Decode$succeed($author$project$Types$ConfirmRenameDiagram) : ((k === 'Escape') ? $elm$json$Json$Decode$succeed($author$project$Types$CancelRenameDiagram) : $elm$json$Json$Decode$fail(''));
														},
														A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string))),
													A2($elm$html$Html$Attributes$style, 'flex', '1'),
													A2($elm$html$Html$Attributes$style, 'background', 'rgba(255,255,255,0.1)'),
													A2($elm$html$Html$Attributes$style, 'border', '1.5px solid #7c4dff'),
													A2($elm$html$Html$Attributes$style, 'border-radius', '6px'),
													A2($elm$html$Html$Attributes$style, 'padding', '3px 8px'),
													A2($elm$html$Html$Attributes$style, 'color', '#fff'),
													A2($elm$html$Html$Attributes$style, 'font-family', 'inherit'),
													A2($elm$html$Html$Attributes$style, 'font-size', '0.88rem'),
													A2($elm$html$Html$Attributes$style, 'outline', 'none')
												]),
											_List_Nil),
											A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Events$onClick($author$project$Types$ConfirmRenameDiagram),
													A2($elm$html$Html$Attributes$style, 'background', 'none'),
													A2($elm$html$Html$Attributes$style, 'border', 'none'),
													A2($elm$html$Html$Attributes$style, 'color', '#9fa8da'),
													A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
													A2($elm$html$Html$Attributes$style, 'font-size', '1rem')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('✔')
												])),
											A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Events$onClick($author$project$Types$CancelRenameDiagram),
													A2($elm$html$Html$Attributes$style, 'background', 'none'),
													A2($elm$html$Html$Attributes$style, 'border', 'none'),
													A2($elm$html$Html$Attributes$style, 'color', '#9fa8da'),
													A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
													A2($elm$html$Html$Attributes$style, 'font-size', '1rem')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('✕')
												]))
										])) : $author$project$View$savedItemName(saved.bB);
							} else {
								return $author$project$View$savedItemName(saved.bB);
							}
						}(),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'font-size', '0.73rem'),
									A2($elm$html$Html$Attributes$style, 'color', '#7986cb'),
									A2($elm$html$Html$Attributes$style, 'margin-top', '3px')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									A2($author$project$View$savedItemMeta, t, saved))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'gap', '6px'),
							A2($elm$html$Html$Attributes$style, 'flex-shrink', '0')
						]),
					_List_fromArray(
						[
							A7(
							$author$project$View$savedBtn,
							t.bv,
							'pointer',
							$author$project$Types$StartRenameDiagram(saved.c0),
							'rgba(124,77,255,0.2)',
							'rgba(124,77,255,0.5)',
							'#ce93d8',
							'dfa-btn-purple'),
							A7(
							$author$project$View$savedBtn,
							t.Y,
							'pointer',
							$author$project$Types$ExportDiagram(saved.c0),
							'rgba(38,166,154,0.18)',
							'rgba(38,166,154,0.5)',
							'#80cbc4',
							'dfa-btn-teal'),
							A7(
							$author$project$View$savedBtn,
							t.br,
							'pointer',
							$author$project$Types$DeleteSavedDiagram(saved.c0),
							'rgba(239,83,80,0.15)',
							'rgba(239,83,80,0.4)',
							'#ef9a9a',
							'dfa-btn-red')
						]))
				]));
	});
var $author$project$View$viewSaveModal = F2(
	function (t, model) {
		return A2(
			$author$project$View$modalBackdrop,
			$author$project$Types$CloseSaveModal,
			_List_fromArray(
				[
					$author$project$View$modalCard(
					_List_fromArray(
						[
							A2($author$project$View$modalHeader, t.by, $author$project$Types$CloseSaveModal),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'gap', '10px'),
									A2($elm$html$Html$Attributes$style, 'margin-bottom', '16px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value(model.d0),
											$elm$html$Html$Events$onInput($author$project$Types$SetSaveNameInput),
											$elm$html$Html$Attributes$placeholder(t.bx),
											A2(
											$elm$html$Html$Events$on,
											'keydown',
											A2(
												$elm$json$Json$Decode$andThen,
												function (k) {
													return (k === 'Enter') ? $elm$json$Json$Decode$succeed($author$project$Types$ConfirmSave) : $elm$json$Json$Decode$fail('');
												},
												A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string))),
											A2($elm$html$Html$Attributes$style, 'flex', '1'),
											A2($elm$html$Html$Attributes$style, 'background', 'rgba(255,255,255,0.07)'),
											A2($elm$html$Html$Attributes$style, 'border', '1.5px solid rgba(124,77,255,0.5)'),
											A2($elm$html$Html$Attributes$style, 'border-radius', '10px'),
											A2($elm$html$Html$Attributes$style, 'padding', '9px 14px'),
											A2($elm$html$Html$Attributes$style, 'color', '#e8eaf6'),
											A2($elm$html$Html$Attributes$style, 'font-family', 'inherit'),
											A2($elm$html$Html$Attributes$style, 'font-size', '0.9rem'),
											A2($elm$html$Html$Attributes$style, 'outline', 'none')
										]),
									_List_Nil),
									A2($author$project$View$modalPrimaryBtn, t.bw, $author$project$Types$ConfirmSave)
								])),
							$author$project$View$modalSectionLabel(t.bz),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
									A2($elm$html$Html$Attributes$style, 'gap', '8px'),
									A2($elm$html$Html$Attributes$style, 'overflow-y', 'auto'),
									A2($elm$html$Html$Attributes$style, 'max-height', '340px')
								]),
							$elm$core$List$isEmpty(model.D) ? _List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
											A2($elm$html$Html$Attributes$style, 'color', '#5c6bc0'),
											A2($elm$html$Html$Attributes$style, 'font-size', '0.85rem'),
											A2($elm$html$Html$Attributes$style, 'padding', '32px 0')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(t.bu)
										]))
								]) : A2(
								$elm$core$List$map,
								A2($author$project$View$viewSaveItem, t, model),
								$elm$core$List$reverse(model.D)))
						]))
				]));
	});
var $author$project$Types$ToggleAutoReorder = {$: 57};
var $author$project$Types$ToggleSettings = {$: 56};
var $author$project$Types$ToggleLanguage = {$: 49};
var $author$project$View$langChoiceBtn = F3(
	function (current, target, label) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick(
					_Utils_eq(current, target) ? $author$project$Types$NoOp : $author$project$Types$ToggleLanguage),
					A2(
					$elm$html$Html$Attributes$style,
					'background',
					_Utils_eq(current, target) ? 'linear-gradient(135deg,#7c4dff,#e040fb)' : 'rgba(255,255,255,0.08)'),
					A2(
					$elm$html$Html$Attributes$style,
					'border',
					_Utils_eq(current, target) ? '1.5px solid #7c4dff' : '1.5px solid rgba(255,255,255,0.2)'),
					A2($elm$html$Html$Attributes$style, 'color', '#fff'),
					A2($elm$html$Html$Attributes$style, 'padding', '6px 18px'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '20px'),
					A2(
					$elm$html$Html$Attributes$style,
					'cursor',
					_Utils_eq(current, target) ? 'default' : 'pointer'),
					A2($elm$html$Html$Attributes$style, 'font-family', 'inherit'),
					A2($elm$html$Html$Attributes$style, 'font-size', '0.83rem'),
					A2($elm$html$Html$Attributes$style, 'font-weight', '600')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(label)
				]));
	});
var $author$project$View$viewSettingsModal = F2(
	function (t, model) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
					A2($elm$html$Html$Attributes$style, 'inset', '0'),
					A2($elm$html$Html$Attributes$style, 'background', 'rgba(0,0,0,0.7)'),
					A2($elm$html$Html$Attributes$style, 'z-index', '9999'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
					$elm$html$Html$Events$onClick($author$project$Types$ToggleSettings)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'background', '#1e1e3a'),
							A2($elm$html$Html$Attributes$style, 'border', '1px solid rgba(124,77,255,0.4)'),
							A2($elm$html$Html$Attributes$style, 'border-radius', '16px'),
							A2($elm$html$Html$Attributes$style, 'padding', '26px 28px'),
							A2($elm$html$Html$Attributes$style, 'width', '340px'),
							A2($elm$html$Html$Attributes$style, 'max-width', '90vw'),
							A2($elm$html$Html$Attributes$style, 'box-shadow', '0 8px 32px rgba(0,0,0,0.5)'),
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
							A2($elm$html$Html$Attributes$style, 'gap', '16px'),
							A2(
							$elm$html$Html$Events$stopPropagationOn,
							'click',
							$elm$json$Json$Decode$succeed(
								_Utils_Tuple2($author$project$Types$NoOp, true)))
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
									A2($elm$html$Html$Attributes$style, 'margin-bottom', '4px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h3,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'margin', '0'),
											A2($elm$html$Html$Attributes$style, 'font-size', '1.1rem'),
											A2($elm$html$Html$Attributes$style, 'color', '#fff')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(t.bR)
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick($author$project$Types$ToggleSettings),
											A2($elm$html$Html$Attributes$style, 'margin-left', 'auto'),
											A2($elm$html$Html$Attributes$style, 'background', 'transparent'),
											A2($elm$html$Html$Attributes$style, 'border', 'none'),
											A2($elm$html$Html$Attributes$style, 'color', '#9fa8da'),
											A2($elm$html$Html$Attributes$style, 'font-size', '1.2rem'),
											A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('✕')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'font-size', '0.72rem'),
											A2($elm$html$Html$Attributes$style, 'color', '#7986cb'),
											A2($elm$html$Html$Attributes$style, 'letter-spacing', '0.5px'),
											A2($elm$html$Html$Attributes$style, 'text-transform', 'uppercase'),
											A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
											A2($elm$html$Html$Attributes$style, 'margin-bottom', '8px')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(t.bQ)
										])),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'display', 'flex'),
											A2($elm$html$Html$Attributes$style, 'gap', '8px')
										]),
									_List_fromArray(
										[
											A3($author$project$View$langChoiceBtn, model.dH, 0, 'EN'),
											A3($author$project$View$langChoiceBtn, model.dH, 1, 'SK')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'height', '1px'),
									A2($elm$html$Html$Attributes$style, 'background', 'rgba(255,255,255,0.08)')
								]),
							_List_Nil),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'align-items', 'flex-start'),
									A2($elm$html$Html$Attributes$style, 'gap', '12px'),
									A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
									$elm$html$Html$Events$onClick($author$project$Types$ToggleAutoReorder)
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'width', '36px'),
											A2($elm$html$Html$Attributes$style, 'height', '20px'),
											A2($elm$html$Html$Attributes$style, 'border-radius', '10px'),
											A2(
											$elm$html$Html$Attributes$style,
											'background',
											model.$7 ? 'linear-gradient(135deg,#7c4dff,#e040fb)' : 'rgba(255,255,255,0.15)'),
											A2($elm$html$Html$Attributes$style, 'position', 'relative'),
											A2($elm$html$Html$Attributes$style, 'flex-shrink', '0'),
											A2($elm$html$Html$Attributes$style, 'margin-top', '2px'),
											A2($elm$html$Html$Attributes$style, 'transition', 'background 0.2s')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
													A2($elm$html$Html$Attributes$style, 'top', '3px'),
													A2(
													$elm$html$Html$Attributes$style,
													'left',
													model.$7 ? '19px' : '3px'),
													A2($elm$html$Html$Attributes$style, 'width', '14px'),
													A2($elm$html$Html$Attributes$style, 'height', '14px'),
													A2($elm$html$Html$Attributes$style, 'border-radius', '50%'),
													A2($elm$html$Html$Attributes$style, 'background', '#fff'),
													A2($elm$html$Html$Attributes$style, 'transition', 'left 0.2s')
												]),
											_List_Nil)
										])),
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'font-size', '0.88rem'),
													A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
													A2($elm$html$Html$Attributes$style, 'color', '#e8eaf6'),
													A2($elm$html$Html$Attributes$style, 'margin-bottom', '3px')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(t.bO)
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'font-size', '0.74rem'),
													A2($elm$html$Html$Attributes$style, 'color', '#7986cb'),
													A2($elm$html$Html$Attributes$style, 'line-height', '1.4')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(t.bP)
												]))
										]))
								]))
						]))
				]));
	});
var $author$project$Types$LoadDFA = {$: 17};
var $author$project$Types$ResetSim = {$: 21};
var $author$project$Types$RunAll = {$: 20};
var $author$project$Types$SetAutoSpeed = function (a) {
	return {$: 37, a: a};
};
var $author$project$Types$SetTestWord = function (a) {
	return {$: 16, a: a};
};
var $author$project$Types$StepBack = {$: 19};
var $author$project$Types$StepForward = {$: 18};
var $author$project$Types$StartAutoRun = {$: 35};
var $author$project$View$Widgets$autoRunBtn = F2(
	function (t, model) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick($author$project$Types$StartAutoRun),
					A2($elm$html$Html$Attributes$style, 'flex', '1'),
					A2(
					$elm$html$Html$Attributes$style,
					'background',
					model.dp ? 'linear-gradient(135deg, #388e3c, #66bb6a)' : 'rgba(255,255,255,0.07)'),
					A2(
					$elm$html$Html$Attributes$style,
					'border',
					model.dp ? '1px solid #66bb6a' : '1px solid rgba(255,255,255,0.1)'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
					A2($elm$html$Html$Attributes$style, 'padding', '7px 10px'),
					A2($elm$html$Html$Attributes$style, 'font-size', '0.78rem'),
					A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
					A2(
					$elm$html$Html$Attributes$style,
					'color',
					model.dp ? '#fff' : '#9fa8da'),
					A2($elm$html$Html$Attributes$style, 'font-family', 'inherit')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(t.bL)
				]));
	});
var $author$project$Types$StopAutoRun = {$: 36};
var $author$project$View$Widgets$autoStopBtn = F2(
	function (t, model) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick($author$project$Types$StopAutoRun),
					A2($elm$html$Html$Attributes$style, 'flex', '1'),
					A2($elm$html$Html$Attributes$style, 'background', 'rgba(255,255,255,0.07)'),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid rgba(255,255,255,0.1)'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
					A2($elm$html$Html$Attributes$style, 'padding', '7px 10px'),
					A2($elm$html$Html$Attributes$style, 'font-size', '0.78rem'),
					A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
					A2($elm$html$Html$Attributes$style, 'color', '#9fa8da'),
					A2($elm$html$Html$Attributes$style, 'font-family', 'inherit')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(t.ct)
				]));
	});
var $elm$html$Html$Attributes$max = $elm$html$Html$Attributes$stringProperty('max');
var $elm$html$Html$Attributes$min = $elm$html$Html$Attributes$stringProperty('min');
var $author$project$View$Widgets$rowLabel = function (t) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'font-size', '0.75rem'),
				A2($elm$html$Html$Attributes$style, 'color', '#9fa8da'),
				A2($elm$html$Html$Attributes$style, 'font-weight', '500'),
				A2($elm$html$Html$Attributes$style, 'margin-top', '10px')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(t)
			]));
};
var $elm$html$Html$Attributes$step = function (n) {
	return A2($elm$html$Html$Attributes$stringProperty, 'step', n);
};
var $author$project$View$Widgets$stepBtn = F2(
	function (label, msg) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick(msg),
					A2($elm$html$Html$Attributes$style, 'flex', '1'),
					A2($elm$html$Html$Attributes$style, 'background', 'rgba(255,255,255,0.07)'),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid rgba(255,255,255,0.1)'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
					A2($elm$html$Html$Attributes$style, 'padding', '8px 4px'),
					A2($elm$html$Html$Attributes$style, 'font-size', '0.73rem'),
					A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
					A2($elm$html$Html$Attributes$style, 'color', '#e8eaf6'),
					A2($elm$html$Html$Attributes$style, 'font-family', 'inherit')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(label)
				]));
	});
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $author$project$View$Panels$viewTestStringPanel = F2(
	function (t, model) {
		return A2(
			$author$project$View$Widgets$panel,
			_List_Nil,
			_List_fromArray(
				[
					A3($author$project$View$Widgets$collapsibleHeader, t.cu, model.el, $author$project$Types$ToggleTestPanel),
					model.el ? $elm$html$Html$text('') : A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'margin-top', '10px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('')
								])),
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$value(model.cv),
									$elm$html$Html$Events$onInput($author$project$Types$SetTestWord),
									$elm$html$Html$Attributes$placeholder(t.X),
									A2($elm$html$Html$Attributes$style, 'width', '100%'),
									A2($elm$html$Html$Attributes$style, 'background', 'rgba(255,255,255,0.06)'),
									A2($elm$html$Html$Attributes$style, 'border', '2px solid #7c4dff'),
									A2($elm$html$Html$Attributes$style, 'border-radius', '10px'),
									A2($elm$html$Html$Attributes$style, 'padding', '10px 14px'),
									A2($elm$html$Html$Attributes$style, 'color', '#e8eaf6'),
									A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
									A2($elm$html$Html$Attributes$style, 'font-size', '0.9rem'),
									A2($elm$html$Html$Attributes$style, 'outline', 'none'),
									A2($elm$html$Html$Attributes$style, 'box-sizing', 'border-box')
								]),
							_List_Nil),
							A5($author$project$View$Widgets$styledBtn, t.bp, $author$project$Types$LoadDFA, $author$project$View$Widgets$purpleGrad, '100%', '9px 0'),
							$author$project$View$Widgets$rowLabel(t.L),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'gap', '8px'),
									A2($elm$html$Html$Attributes$style, 'margin-top', '6px')
								]),
							_List_fromArray(
								[
									A2($author$project$View$Widgets$autoRunBtn, t, model),
									A2($author$project$View$Widgets$autoStopBtn, t, model)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'margin-top', '8px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'display', 'flex'),
											A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
											A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
											A2($elm$html$Html$Attributes$style, 'margin-bottom', '4px')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'font-size', '0.72rem'),
													A2($elm$html$Html$Attributes$style, 'color', '#9fa8da')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(t.cg)
												])),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'font-size', '0.72rem'),
													A2($elm$html$Html$Attributes$style, 'color', '#9fa8da'),
													A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(
													function () {
														var tenths = $elm$core$Basics$round((2100 - model.dq) / 100);
														var whole = (tenths / 10) | 0;
														var frac = tenths % 10;
														return $elm$core$String$fromInt(whole) + ('.' + ($elm$core$String$fromInt(frac) + ' s/step'));
													}())
												]))
										])),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'display', 'flex'),
											A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
											A2($elm$html$Html$Attributes$style, 'gap', '8px')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'font-size', '1rem')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('🐌')
												])),
											A2(
											$elm$html$Html$input,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$type_('range'),
													$elm$html$Html$Attributes$min('100'),
													$elm$html$Html$Attributes$max('2000'),
													$elm$html$Html$Attributes$step('100'),
													$elm$html$Html$Attributes$value(
													$elm$core$String$fromInt(model.dq)),
													$elm$html$Html$Events$onInput(
													function (v) {
														return $author$project$Types$SetAutoSpeed(
															A2(
																$elm$core$Maybe$withDefault,
																800,
																$elm$core$String$toInt(v)));
													}),
													A2($elm$html$Html$Attributes$style, 'flex', '1'),
													A2($elm$html$Html$Attributes$style, 'accent-color', '#7c4dff'),
													A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
												]),
											_List_Nil),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'font-size', '1rem')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('🐎')
												]))
										]))
								])),
							$author$project$View$Widgets$rowLabel(t.cs),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'gap', '6px'),
									A2($elm$html$Html$Attributes$style, 'margin-top', '6px')
								]),
							_List_fromArray(
								[
									A2($author$project$View$Widgets$stepBtn, t.bJ, $author$project$Types$ResetSim),
									A2($author$project$View$Widgets$stepBtn, t.M, $author$project$Types$StepBack),
									A2($author$project$View$Widgets$stepBtn, t.cr, $author$project$Types$StepForward),
									A2($author$project$View$Widgets$stepBtn, t.bE, $author$project$Types$RunAll)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'background', 'rgba(255,255,255,0.05)'),
									A2($elm$html$Html$Attributes$style, 'border-radius', '10px'),
									A2($elm$html$Html$Attributes$style, 'padding', '12px 14px'),
									A2($elm$html$Html$Attributes$style, 'margin-top', '12px'),
									A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
									A2($elm$html$Html$Attributes$style, 'font-size', '0.78rem'),
									A2($elm$html$Html$Attributes$style, 'line-height', '1.8'),
									A2(
									$elm$html$Html$Attributes$style,
									'border-left',
									A2($elm$core$String$contains, 'ACCEPTED', model.d9) ? '3px solid #69f0ae' : (A2($elm$core$String$contains, 'PRIJATÝ', model.d9) ? '3px solid #69f0ae' : (A2($elm$core$String$contains, 'REJECTED', model.d9) ? '3px solid #ef5350' : (A2($elm$core$String$contains, 'ODMIETNUTÝ', model.d9) ? '3px solid #ef5350' : '3px solid #7c4dff'))))
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'color', '#9fa8da')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(t.cp)
												])),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'color', '#e040fb'),
													A2($elm$html$Html$Attributes$style, 'font-weight', '700')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(model.d9)
												]))
										])),
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'color', '#9fa8da')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(t.bn)
												])),
											A2(
											$elm$html$Html$span,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(
													$elm$core$String$fromInt(model.ea) + (' / ' + $elm$core$String$fromInt(
														$elm$core$String$length(model.cv))))
												]))
										])),
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'color', '#9fa8da')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(t.U)
												])),
											A2(
											$elm$html$Html$span,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(
													A2($elm$core$Maybe$withDefault, '—', model.du))
												]))
										]))
								]))
						]))
				]));
	});
var $author$project$View$viewToast = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
				A2($elm$html$Html$Attributes$style, 'bottom', '32px'),
				A2($elm$html$Html$Attributes$style, 'left', '50%'),
				A2(
				$elm$html$Html$Attributes$style,
				'transform',
				model.E ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(80px)'),
				A2(
				$elm$html$Html$Attributes$style,
				'opacity',
				model.E ? '1' : '0'),
				A2($elm$html$Html$Attributes$style, 'background', 'linear-gradient(135deg, #7c4dff, #e040fb)'),
				A2($elm$html$Html$Attributes$style, 'color', '#fff'),
				A2($elm$html$Html$Attributes$style, 'padding', '10px 28px'),
				A2($elm$html$Html$Attributes$style, 'border-radius', '24px'),
				A2($elm$html$Html$Attributes$style, 'font-family', '\'Segoe UI\', Arial, sans-serif'),
				A2($elm$html$Html$Attributes$style, 'font-size', '0.88rem'),
				A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
				A2($elm$html$Html$Attributes$style, 'z-index', '99999'),
				A2($elm$html$Html$Attributes$style, 'box-shadow', '0 4px 24px rgba(0,0,0,0.5)'),
				A2($elm$html$Html$Attributes$style, 'transition', 'transform 0.35s cubic-bezier(.22,1,.36,1), opacity 0.35s'),
				A2($elm$html$Html$Attributes$style, 'pointer-events', 'none')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(model.en)
			]));
};
var $author$project$Types$ClearAll = {$: 31};
var $author$project$Types$OpenLoadModal = {$: 63};
var $author$project$Types$OpenSaveModal = {$: 61};
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $author$project$View$settingsBtn = F2(
	function (t, model) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick($author$project$Types$ToggleSettings),
					A2($elm$html$Html$Attributes$style, 'background', 'rgba(255,255,255,0.15)'),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid rgba(255,255,255,0.3)'),
					A2($elm$html$Html$Attributes$style, 'color', 'white'),
					A2($elm$html$Html$Attributes$style, 'padding', '7px 14px'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '20px'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
					A2($elm$html$Html$Attributes$style, 'font-family', 'inherit'),
					A2($elm$html$Html$Attributes$style, 'font-size', '0.85rem'),
					A2($elm$html$Html$Attributes$style, 'font-weight', '600')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(t.bR)
				]));
	});
var $author$project$View$Widgets$topBarBtn = F2(
	function (label, msg) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick(msg),
					A2($elm$html$Html$Attributes$style, 'background', 'rgba(255,255,255,0.15)'),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid rgba(255,255,255,0.3)'),
					A2($elm$html$Html$Attributes$style, 'color', 'white'),
					A2($elm$html$Html$Attributes$style, 'padding', '7px 18px'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '20px'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
					A2($elm$html$Html$Attributes$style, 'font-family', 'inherit'),
					A2($elm$html$Html$Attributes$style, 'font-size', '0.85rem'),
					A2($elm$html$Html$Attributes$style, 'font-weight', '500')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(label)
				]));
	});
var $author$project$View$viewTopBar = F2(
	function (t, model) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'background', 'linear-gradient(135deg, #4a0080, #6a0dad, #7c4dff)'),
					A2($elm$html$Html$Attributes$style, 'padding', '12px 28px'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
					A2($elm$html$Html$Attributes$style, 'box-shadow', '0 2px 20px rgba(124,77,255,0.5)'),
					A2($elm$html$Html$Attributes$style, 'position', 'relative')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h1,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
							A2($elm$html$Html$Attributes$style, 'font-size', '1.6rem'),
							A2($elm$html$Html$Attributes$style, 'color', '#fff'),
							A2($elm$html$Html$Attributes$style, 'margin', '0'),
							A2($elm$html$Html$Attributes$style, 'letter-spacing', '1px')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('DFA Simulator')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'gap', '10px'),
							A2($elm$html$Html$Attributes$style, 'align-items', 'center')
						]),
					_List_fromArray(
						[
							A2($author$project$View$settingsBtn, t, model),
							A2($author$project$View$Widgets$topBarBtn, t.bM, $author$project$Types$OpenSaveModal),
							A2($author$project$View$Widgets$topBarBtn, t.bo, $author$project$Types$OpenLoadModal),
							A2($author$project$View$Widgets$topBarBtn, t.ae, $author$project$Types$ToggleHelp),
							A2($author$project$View$Widgets$topBarBtn, t._, $author$project$Types$ToggleFeedback),
							A2($author$project$View$Widgets$topBarBtn, t.O, $author$project$Types$ClearAll)
						]))
				]));
	});
var $author$project$Types$CancelTransition = {$: 15};
var $author$project$Types$ConfirmTransition = {$: 14};
var $author$project$Types$SetTransitionChar = function (a) {
	return {$: 13, a: a};
};
var $author$project$View$Panels$viewTransCharPopup = F2(
	function (t, model) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
					A2($elm$html$Html$Attributes$style, 'inset', '0'),
					A2($elm$html$Html$Attributes$style, 'background', 'rgba(0,0,0,0.6)'),
					A2($elm$html$Html$Attributes$style, 'z-index', '200'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'center')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'background', '#1e1e3a'),
							A2($elm$html$Html$Attributes$style, 'border', '2px solid #7c4dff'),
							A2($elm$html$Html$Attributes$style, 'border-radius', '14px'),
							A2($elm$html$Html$Attributes$style, 'padding', '22px 24px'),
							A2($elm$html$Html$Attributes$style, 'min-width', '260px'),
							A2($elm$html$Html$Attributes$style, 'box-shadow', '0 8px 32px rgba(0,0,0,0.5)')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'font-size', '0.9rem'),
									A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
									A2($elm$html$Html$Attributes$style, 'margin-bottom', '6px')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(t.cE + (model.dT + (' → ' + model.dU)))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'font-size', '0.78rem'),
									A2($elm$html$Html$Attributes$style, 'color', '#9fa8da'),
									A2($elm$html$Html$Attributes$style, 'margin-bottom', '10px')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(t.cD)
								])),
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$value(model.eo),
									$elm$html$Html$Events$onInput($author$project$Types$SetTransitionChar),
									$elm$html$Html$Attributes$placeholder('e.g.  a'),
									A2(
									$elm$html$Html$Events$on,
									'keydown',
									A2(
										$elm$json$Json$Decode$andThen,
										function (k) {
											return (k === 'Enter') ? $elm$json$Json$Decode$succeed($author$project$Types$ConfirmTransition) : ((k === 'Escape') ? $elm$json$Json$Decode$succeed($author$project$Types$CancelTransition) : $elm$json$Json$Decode$fail('other key'));
										},
										A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string))),
									A2($elm$html$Html$Attributes$style, 'width', '100%'),
									A2($elm$html$Html$Attributes$style, 'background', 'rgba(255,255,255,0.06)'),
									A2($elm$html$Html$Attributes$style, 'border', '1px solid #7c4dff'),
									A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
									A2($elm$html$Html$Attributes$style, 'padding', '8px 12px'),
									A2($elm$html$Html$Attributes$style, 'color', '#e8eaf6'),
									A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
									A2($elm$html$Html$Attributes$style, 'font-size', '0.9rem'),
									A2($elm$html$Html$Attributes$style, 'outline', 'none'),
									A2($elm$html$Html$Attributes$style, 'box-sizing', 'border-box'),
									A2($elm$html$Html$Attributes$style, 'margin-bottom', '12px')
								]),
							_List_Nil),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'gap', '10px')
								]),
							_List_fromArray(
								[
									A5($author$project$View$Widgets$styledBtn, t.H, $author$project$Types$ConfirmTransition, $author$project$View$Widgets$purpleGrad, '50%', '8px 0'),
									A5($author$project$View$Widgets$styledBtn, t.N, $author$project$Types$CancelTransition, 'rgba(255,255,255,0.1)', '50%', '8px 0')
								]))
						]))
				]));
	});
var $author$project$View$view = function (model) {
	var t = $author$project$Lang$translations(model.dH);
	var bothCollapsed = model.el && model.dt;
	var sidebarWidth = bothCollapsed ? 44 : model.dI;
	var gridCols = bothCollapsed ? '44px 1fr' : ($elm$core$String$fromFloat(sidebarWidth) + 'px 6px 1fr');
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'font-family', '\'Segoe UI\', Arial, sans-serif'),
				A2($elm$html$Html$Attributes$style, 'background', '#1a1a2e'),
				A2($elm$html$Html$Attributes$style, 'height', '100vh'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
				A2($elm$html$Html$Attributes$style, 'overflow', 'hidden'),
				A2($elm$html$Html$Attributes$style, 'color', '#e8eaf6'),
				A2(
				$elm$html$Html$Events$on,
				'mouseup',
				$elm$json$Json$Decode$succeed($author$project$Types$MouseUp)),
				A2(
				$elm$html$Html$Events$on,
				'mouseup',
				$elm$json$Json$Decode$succeed($author$project$Types$DragSidebarEnd)),
				A2(
				$elm$html$Html$Events$on,
				'mousemove',
				A2(
					$elm$json$Json$Decode$map,
					$author$project$Types$DragSidebarMove,
					A2($elm$json$Json$Decode$field, 'clientX', $elm$json$Json$Decode$float)))
			]),
		_List_fromArray(
			[
				A2($author$project$View$viewTopBar, t, model),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'grid'),
						A2($elm$html$Html$Attributes$style, 'grid-template-columns', gridCols),
						A2($elm$html$Html$Attributes$style, 'grid-template-rows', '1fr'),
						A2($elm$html$Html$Attributes$style, 'gap', '0'),
						A2($elm$html$Html$Attributes$style, 'padding', '0 14px 14px 14px'),
						A2($elm$html$Html$Attributes$style, 'flex', '1'),
						A2($elm$html$Html$Attributes$style, 'min-height', '0')
					]),
				_List_fromArray(
					[
						bothCollapsed ? A2($author$project$View$viewCollapsedStrip, t, model) : A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
								A2($elm$html$Html$Attributes$style, 'gap', '8px'),
								A2($elm$html$Html$Attributes$style, 'min-height', '0'),
								A2($elm$html$Html$Attributes$style, 'overflow-y', 'auto'),
								A2($elm$html$Html$Attributes$style, 'padding-right', '2px'),
								A2($elm$html$Html$Attributes$style, 'overflow-x', 'hidden')
							]),
						_List_fromArray(
							[
								model.el ? A3($author$project$View$collapsedPanelBtn, '📝', t.cu, $author$project$Types$ToggleTestPanel) : A2($author$project$View$Panels$viewTestStringPanel, t, model),
								model.dt ? A3($author$project$View$collapsedPanelBtn, '{ }', t.R, $author$project$Types$ToggleCodePanel) : A2($author$project$View$Panels$viewCodePanel, t, model)
							])),
						bothCollapsed ? $elm$html$Html$text('') : A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'width', '6px'),
								A2($elm$html$Html$Attributes$style, 'cursor', 'col-resize'),
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
								A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
								A2($elm$html$Html$Attributes$style, 'margin', '0 4px'),
								A2($elm$html$Html$Attributes$style, 'flex-shrink', '0'),
								A2(
								$elm$html$Html$Events$on,
								'mousedown',
								$elm$json$Json$Decode$succeed($author$project$Types$DragSidebarStart))
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'width', '3px'),
										A2($elm$html$Html$Attributes$style, 'height', '48px'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '2px'),
										A2(
										$elm$html$Html$Attributes$style,
										'background',
										model.dF ? 'rgba(124,77,255,0.9)' : 'rgba(255,255,255,0.18)'),
										A2($elm$html$Html$Attributes$style, 'transition', 'background 0.15s')
									]),
								_List_Nil)
							])),
						A2($author$project$View$viewDiagramPanel, t, model)
					])),
				model.d7 ? A2($author$project$View$Panels$viewTransCharPopup, t, model) : $elm$html$Html$text(''),
				function () {
				var _v0 = model.d_;
				if (!_v0.$) {
					var stateName = _v0.a;
					return A3($author$project$View$Panels$viewRenamePopup, t, stateName, model.dY);
				} else {
					return $elm$html$Html$text('');
				}
			}(),
				model.d3 ? $author$project$View$Panels$viewHelpModal(t) : $elm$html$Html$text(''),
				model.d2 ? $author$project$View$Panels$viewFeedbackModal(t) : $elm$html$Html$text(''),
				model.d6 ? A2($author$project$View$viewSettingsModal, t, model) : $elm$html$Html$text(''),
				model.d5 ? A2($author$project$View$viewSaveModal, t, model) : $elm$html$Html$text(''),
				model.d4 ? A2($author$project$View$viewLoadModal, t, model) : $elm$html$Html$text(''),
				$author$project$View$viewToast(model)
			]));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{dE: $author$project$Main$init, eh: $author$project$Main$subscriptions, er: $author$project$Main$updateWithPorts, cI: $author$project$View$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));