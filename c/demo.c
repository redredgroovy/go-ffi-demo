#include "../libhello.h"
#include <stdio.h>

// Callback function to be called from Go
void CallbackInC(char *go_str) {
    printf("CallbackInC(): %s\n", go_str);
    FreeString(go_str); // Release the Go string
}

int main(int argc, char const *argv[])
{
    /*
      STRINGS
    */

    // Call Go library function which returns a string
    {
        char *go_str = StringFromGo();
        printf("StringFromGo(): %s\n", go_str);
        FreeString(go_str); // Release the Go string
    }

    // Pass string to Go library function
    {
        StringToGo("Calling from C");
    }

    /*
      ARRAYS
    */

    // Call Go library function which returns a Demo_Array pointer
    {
        Demo_Array *go_array = ArrayFromGo();
        printf("ArrayFromGo():");
        int i;
        for(i=0; i < go_array->len; i++) {
            printf(" %d", ( (int *)(go_array->data) )[i]);
        }
        printf("\n");
        FreeArray(go_array); // Release the Demo_Array
    }

    // Pass array to a Go library function
    {
        int c_array[] = { 4, 5, 6 };
        // Create a Demo_Array wrapper for the native C array
        Demo_Array go_array = { c_array, sizeof(c_array)/sizeof(c_array[0]) };
        ArrayToGo(&go_array);
    }


    /*
      FUNCTIONS
    */

    // Pass a C callback function to Go and call it from there
    {
        FunctionToGo(&CallbackInC);
    }

    // Receive a Go callback function and call it from here
    {
        void (*go_ptr)() = FunctionFromGo();
        (go_ptr)("Calling from C");
    }
        
    return 0;
}
