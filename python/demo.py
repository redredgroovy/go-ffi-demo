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
    void FreeString(void*);

    typedef struct { void *data; int len; } Demo_Array;
    Demo_Array* ArrayFromGo();
    void ArrayToGo(Demo_Array*);
    void FreeArray(Demo_Array*);

    typedef void (*Demo_Func_Ptr)(char*);
    Demo_Func_Ptr FunctionFromGo();
    void FunctionToGo(Demo_Func_Ptr);
''')

##
## STRINGS
##

# Call Go library function and attach a garbage collector to returned string
go_string = ffi.gc(lib.StringFromGo(), lib.FreeString)
print("StringFromGo(): {}".format(ffi.string(go_string).decode("utf-8")))

# Pass string to Go library function
lib.StringToGo("Calling from Python")

##
## LISTS
##

# Call Go library function and attach a garbage collector to returned array
go_array = ffi.gc(lib.ArrayFromGo(), lib.FreeArray)
py_array = ffi.unpack(ffi.cast("int*", go_array.data), go_array.len)
print("ArrayFromGo(): {}".format(' '.join([str(x) for x in py_array])))

# Pass array to Go library function
# Don't call ffi.new() inside another function or it will be garbage collected
py_array = ffi.new("int[]", [4,5,6])
go_array = ffi.new("Demo_Array*", {'data': py_array, 'len': len(py_array)})
lib.ArrayToGo(go_array)

##
## FUNCTIONS
##

@ffi.callback("void(char*)")
def CallbackInPython(str):
    print("CallbackInPython(): {}".format(ffi.string(str).decode("utf-8")) )
    lib.FreeString(str)

# Pass a Python function pointer to Go and call it from there
lib.FunctionToGo(CallbackInPython)

# Retrieve a Go function pointer and call it from here
go_ptr = lib.FunctionFromGo()
go_ptr("Calling from Python")
