Document Pointer Binary Format

1. Section 1
   Bytes: 0000 - 003F
   Magic Number
   The magic number of the format which contains the following hardcoded value:
   00 00 00 00 44 6F 63 75 6D 65 6E 74 00 50 6F 69
   6E 74 65 72 00 42 69 6E 61 72 79 00 46 6F 72 6D
   61 74 00 34 00 50 72 6F 6A 65 63 74 00 42 50 43
   00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01

2. Section 2
   Bytes: 0040 - 0040
   Resource Type
   The Resource Type is used as the ID of the data, similar to what a table name in an RDBMS.
   This may be have any value from 00 to FF.

3. Section 3
   Bytes: 0041 - 0048
   Entry Size
   Each entry (analogous to RDBMS row) has fixed size that may be represented by this 64-bit number.

4. Section 4
   Bytes: 0049 - 0050
   Entries Offset
   Entries may be put on any offset that is representable within this 64-bit number.
   This must be greater than 50 in hexadecimal.

5. Section 5
   Bytes:
