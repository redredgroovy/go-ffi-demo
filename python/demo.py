#!/usr/bin/env python

import cffi
import os

ffi = cffi.FFI()

# Load library
lib = ffi.dlopen("./libhello.so")

# Define the function prototypes
ffi.cdef('''
    char* StringFromGo();
    void StringToGo(char*);
    void FreeCString(void*);

    typedef struct { void *data; int len; } Demo_Array;
    Demo_Array* ArrayFromGo();
    void ArrayToGo(Demo_Array*);
    void FreeArray(Demo_Array*);
''')

##
## STRINGS
##

# Call library function and attach a garbage collector to returned string
string_in = ffi.gc(lib.StringFromGo(), lib.FreeCString)
print("StringFromGo(): {}".format(ffi.string(string_in).decode("utf-8")))

# Pass string to library function
lib.StringToGo("Calling from Python")

##
## LISTS
##

# Call library function and attach a garbage collector to returned array
array_in = ffi.gc(lib.ArrayFromGo(), lib.FreeArray)
py_array = ffi.unpack(ffi.cast("int*", array_in.data), array_in.len)
print("ArrayFromGo(): {}".format(' '.join([str(x) for x in py_array])))

# Pass array to library function
# Don't call ffi.new() inside another function or it will be garbage collected
py_array = ffi.new("int[]", [4,5,6])
array_out = ffi.new("Demo_Array*", {'data': py_array, 'len': len(py_array)})
lib.ArrayToGo(array_out)
