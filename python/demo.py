#!/usr/bin/env python

import cffi
import os

ffi = cffi.FFI()

# Load library
lib = ffi.dlopen("./libhello.so")

# Define the function prototypes
ffi.cdef('''
    char* HelloFromGo();
    void PrintFromGo(char *);
    void FreeCString(void *);
''')

# Call library function and attach a garbage collector to returned string
hello = ffi.gc(lib.HelloFromGo(), lib.FreeCString)

print("{}".format(ffi.string(hello).decode("utf-8")))

# Pass string to library function
lib.PrintFromGo("Calling from Python")
