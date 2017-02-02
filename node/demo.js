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
    'FreeString': [ 'void', [ 'void *' ] ],

    'ArrayFromGo': [ ref.refType(Demo_Array), [] ],
    'ArrayToGo': [ 'void', [ ref.refType(Demo_Array) ] ],
    'FreeArray': [ 'void', [ ref.refType(Demo_Array) ] ],

    'FunctionFromGo': [ 'pointer', [] ],
    'FunctionToGo': [ 'void', [ 'pointer'] ]
});

//
// STRINGS
//

// Call library function
var go_string = lib.StringFromGo();
// Attach garbage collector to returned string
finalize(go_string, function () { lib.FreeString(this); });
// Display the string received from Go
console.log("StringFromGo(): " + go_string.readCString());

// Pass string to library function
lib.StringToGo(ref.allocCString("Calling from Node"));

//
// ARRAYS
//

// Call Go library function and receive a Demo_Array struct
// Use the struct to dereference and set length of returned array
var go_array = lib.ArrayFromGo().deref();
go_array.data.length = go_array.len;

// Display the array received from Go
process.stdout.write("ArrayFromGo():");
for (var i = 0; i < go_array.len; i++) {
    process.stdout.write(" " + go_array.data[i]);
}
process.stdout.write("\n");

// Free array, or attach garbage collector as in String above
lib.FreeArray(go_array.ref());

// Create a Demo_Array wrapper for the native Node array
var node_array = [4,5,6];
var go_array = new Demo_Array();
go_array.data = node_array;
go_array.len = node_array.length;
// Pass array to Go library function
lib.ArrayToGo(go_array.ref());

//
// FUNCTIONS
//

// Create a callpack pointer that can be passed to Go
var CallbackInNode = ffi.Callback('void', ['string'],
    function(str) {
        console.log("CallbackInNode(): " + str)
    }
);
// Make an extra reference to the callback to avoid GC
process.on('exit', function() { CallbackInNode });

// Pass the Node function pointer to Go and call it from there
lib.FunctionToGo(CallbackInNode);


// Retreive a Go function pointer
var go_ptr = lib.FunctionFromGo();
// Convert the Go function pointer to a Node function
var go_func = ffi.ForeignFunction(go_ptr, 'void', ['string'])
// Call the Go function from here
go_func("Calling from Node");
