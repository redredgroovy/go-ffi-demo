package hello

import "fmt"

func HelloFromGo() string {
    return "HelloFromGo(): Hello from Go!"
}

func PrintFromGo(str string) {
    fmt.Printf("PrintFromGo(): %s\n", str)
}
