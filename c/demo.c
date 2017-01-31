#include "../libhello.h"
#include <stdio.h>

int main(int argc, char const *argv[])
{
    char *hello = HelloFromGo();
    printf("%s\n", hello);
    FreeCString(hello);
    return 0;
}
