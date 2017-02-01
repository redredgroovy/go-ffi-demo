#include "../libhello.h"
#include <stdio.h>

int main(int argc, char const *argv[])
{
    /*
      STRINGS
    */

    // Call library function and release returned string
    char *string_in = StringFromGo();
    printf("StringFromGo(): %s\n", string_in);
    FreeCString(string_in); // Release the Go string

    // Pass string to a library function
    StringToGo("Calling from C");

    /*
      ARRAYS
    */

    // Call library function and receive a Demo_Array pointer
    Demo_Array *array_in = ArrayFromGo();
    printf("ArrayFromGo():");
    int i;
    for(i=0; i < array_in->len; i++) {
        printf(" %d", ( (int *)(array_in->data) )[i]);
    }
    printf("\n");
    FreeArray(array_in); // Release the Demo_Array

    // Pass array to a library function
    int c_array[] = { 4, 5, 6 };
    // Create a Demo_Array wrapper for the native C array
    Demo_Array array_out = { c_array, sizeof(c_array)/sizeof(c_array[0]) };
    ArrayToGo(&array_out);
    
    return 0;
}
