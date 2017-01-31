var ffi = require('ffi');
var ref = require('ref');
var finalize = require('finalize');

// Load library and function prototypes
var lib = ffi.Library('./libhello.so', {
    'HelloFromGo': [ 'char *', [] ],
    'PrintFromGo': [ 'void', [ 'char *' ] ],
    'FreeCString': [ 'void', [ 'void *' ] ]
});

// Call library function
hello = lib.HelloFromGo();

// Attach garbage collector to returned string
finalize(hello, function () {
    lib.FreeCString(this);
});

console.log(hello.readCString());

// Pass string to library function
lib.PrintFromGo(ref.allocCString("Calling from Node"));
