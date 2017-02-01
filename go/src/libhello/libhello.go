package main

import (
    "hello"
    "unsafe"
)

/*
#include <stdlib.h>
#include <string.h>

typedef struct { void *data; int len; } Demo_Array;
*/
import "C"

//export StringFromGo
func StringFromGo() *C.char {
    str := C.CString(hello.StringFromGo())
    return str
}

//export StringToGo
func StringToGo(str *C.char) {
    hello.StringToGo(C.GoString(str))
}

//export ArrayFromGo
func ArrayFromGo() *C.Demo_Array {
    source := hello.ArrayFromGo()

    // malloc a new C array and copy contents of the Go slice
    source_size := C.size_t(C.sizeof_int*len(source))
    data := C.malloc(source_size)
    C.memcpy(data, unsafe.Pointer(&source[0]), source_size)

    // malloc a new Demo_Array struct and set contents
    array := (*C.Demo_Array)(C.malloc(C.size_t(unsafe.Sizeof(C.Demo_Array{}))))
    array.len = (C.int)(len(source))
    array.data = data

    return array
}

//export ArrayToGo
func ArrayToGo(array *C.Demo_Array) {
    data := (*C.int)(array.data)
    len := array.len
    slice := (*[1 << 30]int32)(unsafe.Pointer(data))[:len:len]
    hello.ArrayToGo(slice)
}

//export FreeCString
func FreeCString(str *C.char) {
    C.free(unsafe.Pointer(str))
}

//export FreeArray
func FreeArray(arr *C.Demo_Array) {
    C.free(unsafe.Pointer(arr.data))
    C.free(unsafe.Pointer(arr))
}

func main() {}
