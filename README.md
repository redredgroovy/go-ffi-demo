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
    HelloFromGo(): Hello from Go!
    PrintFromGo(): Calling from C
    ```

4. Run the python demo program:

    ```
    go-ffi-demo$ python python/demo.py
    HelloFromGo(): Hello from Go!
    PrintFromGo(): Calling from Python
    ```

5. Install and run the Node demo program:

    ```
    go-ffi-demo$ ( cd node && npm install )
    go-ffi-demo$ node node/demo.js
    HelloFromGo(): Hello from Go!
    PrintFromGo(): Calling from Node
    ```
