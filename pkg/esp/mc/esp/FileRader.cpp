#include <stdio.h>
#include <stdlib.h>

#include "FileRader.h"

char *readFile(const char *fileType)
{
  char *buffer = "";
  long length;
  char *filename1 = "../dist/index.html";
  if (fileType == "js")
  {
    filename1 = "../dist/index.js";
  }

  FILE *f = fopen(filename1, "r");
  if (f)
  {
    fseek(f, 0, SEEK_END);
    length = ftell(f);
    fseek(f, 0, SEEK_SET);
    buffer = (char*)malloc(length);
    if (buffer)
    {
      fread(buffer, 1, length, f);
    }
    fclose(f);
  }
  return buffer;
}