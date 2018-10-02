const PORT = process.env.PORT || 3000; // port to start server on
const MONGO_PORT = 27017; // mongo port
const DB_NAME = 'LAB_MANUS'; // sample db name
const SECRET = "APISECRET";
const REDIS_PORT = 3030;

//Error Message
const TOKEN_VERIFICATION_FAILED = "Token verification failed. Please try again.";
const USER_DETAILS_VERI_FAILED = "Username/password not matched. Please try again.";
const INTERNAL_SERVER_ERROR = "Ohh crap!!! We are facing some issues. Please get back to use again after some time.";

export {
	PORT,
	MONGO_PORT,
	DB_NAME,
	SECRET,
	REDIS_PORT,
	TOKEN_VERIFICATION_FAILED,
	USER_DETAILS_VERI_FAILED,
	INTERNAL_SERVER_ERROR
}
