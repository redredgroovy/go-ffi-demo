package main

import (
    "hello"
    "unsafe"
)

/*
#include <stdlib.h>
#include <string.h>

// Array info struct for passing arrays
typedef struct { void *data; int len; } Demo_Array;

// Inline C stubs for function pointers
typedef void (*Demo_Func_Ptr)();
static inline void call_out(Demo_Func_Ptr ptr, void *data) {
    (ptr)(data);
}

extern void CallbackInGo(char*);
static inline Demo_Func_Ptr _FunctionFromGo() {
    return &CallbackInGo;
}
*/
import "C"

//
// STRINGS
//

//export StringFromGo
func StringFromGo() *C.char {
    go_string := C.CString(hello.StringFromGo())
    return go_string
}

//export StringToGo
func StringToGo(c_string *C.char) {
    hello.StringToGo(C.GoString(c_string))
}

//export FreeString
func FreeString(str *C.char) {
    C.free(unsafe.Pointer(str))
}

//
// ARRAYS
//

//export ArrayFromGo
func ArrayFromGo() *C.Demo_Array {
    go_array := hello.ArrayFromGo()

    // malloc a new C array and copy contents of the Go slice
    go_array_size := C.size_t(C.sizeof_int*len(go_array))
    c_array_data := C.malloc(go_array_size)
    C.memcpy(c_array_data, unsafe.Pointer(&go_array[0]), go_array_size)

    // malloc a new Demo_Array struct and set contents
    c_array := (*C.Demo_Array)(C.malloc(C.size_t(unsafe.Sizeof(C.Demo_Array{}))))
    c_array.len = (C.int)(len(go_array))
    c_array.data = c_array_data

    return c_array
}

//export ArrayToGo
func ArrayToGo(c_array *C.Demo_Array) {
    data := (*C.int)(c_array.data)
    len := c_array.len
    go_array := (*[1 << 30]int32)(unsafe.Pointer(data))[:len:len]
    hello.ArrayToGo(go_array)
}

//export FreeArray
func FreeArray(arr *C.Demo_Array) {
    C.free(unsafe.Pointer(arr.data))
    C.free(unsafe.Pointer(arr))
}

//
// FUNCTIONS
//

//export CallbackInGo
func CallbackInGo(c_string *C.char) {
    go_string := C.GoString(c_string)
    hello.CallbackInGo(go_string)
}

//export FunctionFromGo
func FunctionFromGo() C.Demo_Func_Ptr {
    // Use the C stub wrapper to return a C function pointer
    return C._FunctionFromGo();
}

//export FunctionToGo
func FunctionToGo(c_ptr C.Demo_Func_Ptr) {
    c_string := C.CString("Calling from Go")
    C.call_out(c_ptr, unsafe.Pointer(c_string))
}

func main() {}
