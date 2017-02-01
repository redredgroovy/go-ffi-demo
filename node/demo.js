var ffi = require('ffi');
var ref = require('ref');
var struct = require('ref-struct');
var array = require('ref-array');
var finalize = require('finalize');

// Define a Demo_Array "struct" to match the datatype from Go
var Demo_Array = struct({
    'data': array(ref.types.int),
    'len': ref.types.int
});

// Load library and function prototypes
var lib = ffi.Library('./libhello.so', {
    'StringFromGo': [ 'char *', [] ],
    'StringToGo': [ 'void', [ 'char *' ] ],
    'FreeCString': [ 'void', [ 'void *' ] ],
    'ArrayFromGo': [ ref.refType(Demo_Array), [] ],
    'ArrayToGo': [ 'void', [ ref.refType(Demo_Array) ] ],
    'FreeArray': [ 'void', [ ref.refType(Demo_Array) ] ]
});

//
// STRINGS
//

// Call library function
var string_in = lib.StringFromGo();

// Attach garbage collector to returned string
finalize(string_in, function () {
    lib.FreeCString(this);
});

console.log("StringFromGo(): " + string_in.readCString());

// Pass string to library function
lib.StringToGo(ref.allocCString("Calling from Node"));

//
// ARRAYS
//

// Call library function, dereference and set length of returned array
var array_in = lib.ArrayFromGo().deref();
array_in.data.length = array_in.len;

process.stdout.write("ArrayFromGo(): ");
for (var i = 0; i < array_in.len; i++) {
    process.stdout.write(array_in.data[i] + " ");
}
process.stdout.write("\n");

// Free array, or attach garbage collector as in String above
lib.FreeArray(array_in.ref());

// Pass array to library function
var node_array = [4,5,6];

var array_out = new Demo_Array();
array_out.data = node_array;
array_out.len = node_array.length;

lib.ArrayToGo(array_out.ref());
