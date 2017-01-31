#!/usr/bin/env python3

import cffi
import os

ffi = cffi.FFI()

# Load library
lib = ffi.dlopen("./libhello.so")

# Define the function prototypes
ffi.cdef('''
    char* HelloFromGo();
    void FreeCString(void *);
''')

# Call library and attach a garbage collector
hello = ffi.gc(lib.HelloFromGo(), lib.FreeCString)

print("{}".format(ffi.string(hello).decode("utf-8")))
