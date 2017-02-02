package hello

import "fmt"

func StringFromGo() string {
    return "Hello from Go!"
}

func StringToGo(str string) {
    fmt.Printf("StringToGo(): %s\n", str)
}

func ArrayFromGo() []int32 {
    array := []int32{1, 2, 3}
    return array
}

func ArrayToGo(array []int32) {
    fmt.Printf("ArrayToGo():")
    for i := range array {
        fmt.Printf(" %d", array[i])
    }
    fmt.Printf("\n")
}

func CallbackInGo(str string) {
    fmt.Printf("CallbackInGo(): %s\n", str)
}
