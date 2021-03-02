#include<iostream>
#include<string>

#include "sha256.h"

class user
{
	private:
		std::string username;
		std::string fullName;
		std::string addressLine1;
		std::string addressLine2;
		std::string city;
		std::string state;
		std::string zipCode;
		SHA256_CTX *ctx;
	public:
		user(std::string username, std::string password);
		void SetFullName(std::string fullName) { this->fullName = fullName; }
		void SetAddress(std::string line1, std::string line2 = "");
		void SetCityAndState(std::string city, std::string state);
		void SetZipCode(int zip, int plusFour = -1);
};

user::user(std::string username, std::string password)
{
	BYTE buf[SHA256_BLOCK_SIZE];

	this->username = username;
	sha256_init(ctx);
	sha256_update(ctx, password);
	sha256_final(ctx, buf);
}

void user::SetAddress(std::string line1, std::string line2)
{
	addressLine1 = line1;
	addressLine2 = line2;
}

void user::SetCityAndState(std::string city, std::string state)
{
	this->city = city;
	this->state = state;
}

void user::SetZipCode(int zip, int plusFour)
{
	zipCode = std::to_string(zip);

	if (plusFour >= 0)
	{
		zipCode += '-';
		zipCode += std::to_string(plusFour);
	}
}