#include <windows.h>
#include <stdio.h>
#include <string>
#include <direct.h>
#include "CascLib.h"
static const char BS = (char)92;
static void mk(const std::string& p) {
  for (size_t i = 0; i < p.size(); i++)
    if (p[i] == BS || p[i] == '/') { std::string d = p.substr(0, i); if (d.size() > 2) _mkdir(d.c_str()); }
}
int main(int argc, char** argv) {
  if (argc < 4) { printf("usage: ex <storage> <mask> <outdir> [l]\n"); return 1; }
  HANDLE hs;
  if (!CascOpenStorage(argv[1], 0, &hs)) { printf("open fail %lu\n", GetLastError()); return 2; }
  bool list = (argc > 4 && argv[4][0] == 'l');
  CASC_FIND_DATA fd;
  HANDLE hf = CascFindFirstFile(hs, argv[2], &fd, NULL);
  int n = 0, ok = 0;
  if (hf) {
    do {
      n++;
      std::string name = fd.szFileName;
      if (list) { printf("%s %llu\n", fd.szFileName, (unsigned long long)fd.FileSize); continue; }
      HANDLE f;
      if (!CascOpenFile(hs, fd.szFileName, 0, CASC_OPEN_BY_NAME, &f)) continue;
      ULONGLONG sz = 0; CascGetFileSize64(f, &sz);
      std::string buf((size_t)sz, '\0'); DWORD rd = 0;
      CascReadFile(f, &buf[0], (DWORD)sz, &rd); CascCloseFile(f);
      std::string out = std::string(argv[3]) + BS;
      for (char c : name) out += (c == ':' ? '_' : (c == '/' ? BS : c));
      mk(out);
      FILE* o = fopen(out.c_str(), "wb");
      if (o) { fwrite(buf.data(), 1, rd, o); fclose(o); ok++; }
    } while (CascFindNextFile(hf, &fd));
    CascFindClose(hf);
  }
  printf("found %d extracted %d\n", n, ok);
  CascCloseStorage(hs);
  return 0;
}
