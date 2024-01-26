#ifndef FILE_READER_H
#define FILE_READER_H

class StaticFiles
{
public:
  char *getConnectFIle(const char *fileType);
  void readConnectFiles();
};

#endif