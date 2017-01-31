var ffi = require('ffi');
var finalize = require('finalize');

// Load library and function prototypes
var lib = ffi.Library('./libhello.so', {
    'HelloFromGo': [ 'char *', [] ],
    'FreeCString': [ 'void', [ 'void *' ] ]
});

// Call FFI
hello = lib.HelloFromGo();

// Attach garbage collector
finalize(hello, function () {
    lib.FreeCString(this);
});

console.log(hello.readCString());
