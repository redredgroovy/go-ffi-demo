package main

import (
    "hello"
    "unsafe"
)

/*
#include <stdlib.h>
*/
import "C"

//export HelloFromGo
func HelloFromGo() *C.char {
    str := C.CString(hello.HelloFromGo())
    return str
}

//export PrintFromGo
func PrintFromGo(str *C.char) {
    hello.PrintFromGo(C.GoString(str))
}

//export FreeCString
func FreeCString(str *C.char) {
    C.free(unsafe.Pointer(str))
}

func main() {}
