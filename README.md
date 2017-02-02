# go-ffi-demo

Examples for building a shared library with the Go 1.5 `c-shared` buildmode, and then interfacing with this library in C, Python, and Node.

There is a proof-of-concept in each language for:
* Passing native string arguments to Go functions
* Calling Go functions which return strings
* Passing native array/list arguments to Go functions
* Calling Go functions which return a Go slice
* Passing native function pointers and having them called by Go
* Receiving and calling Go function pointers

# Instructions

1. Build the Go 'hello' package

    ```
    go-ffi-demo$ GOPATH=$GOPATH:$(pwd)/go go install hello
    ```

2. Build the Go 'libhello' shared library

    ```
    go-ffi-demo$ GOPATH=$GOPATH:$(pwd)/go go build -buildmode=c-shared -o libhello.so libhello
    ```

3. Build and run the C demo program:

    ```
    go-ffi-demo$ gcc -Wall -o c/demo c/demo.c ./libhello.so
    go-ffi-demo$ c/demo
    StringFromGo(): Hello from Go!
    StringToGo(): Calling from C
    ArrayFromGo(): 1 2 3
    ArrayToGo(): 4 5 6
    CallbackInC(): Calling from Go
    CallbackInGo(): Calling from C
    ```

4. Run the python demo program:

    ```
    go-ffi-demo$ python python/demo.py
    StringFromGo(): Hello from Go!
    StringToGo(): Calling from Python
    ArrayFromGo(): 1 2 3
    ArrayToGo(): 4 5 6
    CallbackInPython(): Calling from Go
    CallbackInGo(): Calling from Python
    ```

5. Install and run the Node demo program:

    ```
    go-ffi-demo$ ( cd node && npm install )
    go-ffi-demo$ node node/demo.js
    StringFromGo(): Hello from Go!
    StringToGo(): Calling from Node
    ArrayFromGo(): 1 2 3
    ArrayToGo(): 4 5 6
    CallbackInNode(): Calling from Go
    CallbackInGo(): Calling from Node
    ```
