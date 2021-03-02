/*********************************************************************
* Filename:   sha256.h
* Author:     Brad Conte (brad AT bradconte.com)
* Modified:	  David Oakley (2021-03-02: added overload to support std::string as an input, added SHA256_ToString() method)
* Copyright:
* Disclaimer: This code is presented "as is" without any guarantees.
* Details:    Defines the API for the corresponding SHA1 implementation.

*********************************************************************/

#ifndef SHA256_H
#define SHA256_H

/*************************** HEADER FILES ***************************/
#include <stddef.h>
#include <string.h>
#include <string>

/****************************** MACROS ******************************/
#define SHA256_BLOCK_SIZE 32            // SHA256 outputs a 32 byte digest

/**************************** DATA TYPES ****************************/
typedef unsigned char BYTE;             // 8-bit byte
typedef unsigned int  WORD;             // 32-bit word, change to "long" for 16-bit machines

typedef struct {
	BYTE data[64];
	WORD datalen;
	unsigned long long bitlen;
	WORD state[8];
} SHA256_CTX;

/*********************** FUNCTION DECLARATIONS **********************/
void sha256_init(SHA256_CTX *ctx);
void sha256_update(SHA256_CTX *ctx, const BYTE data[], size_t len);
void sha256_update(SHA256_CTX *ctx, std::string data);
void sha256_final(SHA256_CTX *ctx, BYTE hash[]);
void SHA256_ToString(SHA256_CTX *ctx, std::string &output);

#endif   // SHA256_H