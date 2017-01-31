#include "../libhello.h"
#include <stdio.h>

int main(int argc, char const *argv[])
{
    // Call library function and release returned string
    char *hello = HelloFromGo();
    printf("%s\n", hello);
    FreeCString(hello);

    // Pass string to a library function
    PrintFromGo("Calling from C");

    return 0;
}
