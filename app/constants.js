const PORT = process.env.PORT || 3000; // port to start server on
const MONGO_PORT = process.env.DB_PORT || 27017; // mongo port
const DB_NAME = process.env.DB_NAME || 'LAB_MANUS'; // sample db name
const SECRET = process.env.SECRET || "RMMSECRET";
const REDIS_PORT = 3030;
const DB_URL = process.env.DB_URL || 'localhost';
const DB_USERNAME = process.env.DB_USERNAME || '';
const DB_PASSWORD = process.env.DB_PASSWORD || '';

//Error Message
const TOKEN_VERIFICATION_FAILED = "Token verification failed. Please try again.";
const USER_DETAILS_VERI_FAILED = "Username/password not matched. Please try again.";
const MAPPING_NOT_FOUND_ERROR = "Requested resource not available.";
const SUBLEVEL_EXITS="Location cannot be deleted as it has sublevels defined";
const INTERNAL_SERVER_ERROR = "Ohh crap!!! We are facing some issues. Please get back to us again after some time.";
const LOCAL_HOST="localhost"
const LOCAL_PORT="3000";
const TEST_BASE_URL="https://rmm-server.herokuapp.com/";
const TEST_DB_URL=`mongodb://m001-student:gC5hQRkRdMGSn8J9@cluster0-shard-00-00-aknqy.mongodb.net:27017,cluster0-shard-00-01-aknqy.mongodb.net:27017,cluster0-shard-00-02-aknqy.mongodb.net:27017/${DB_NAME}?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true`;
const DEV_ENV = false;

export {
	PORT,
	MONGO_PORT,
	DB_NAME,
	SECRET,
	REDIS_PORT,
	TOKEN_VERIFICATION_FAILED,
	USER_DETAILS_VERI_FAILED,
	MAPPING_NOT_FOUND_ERROR,
	SUBLEVEL_EXITS,
	INTERNAL_SERVER_ERROR,
	LOCAL_HOST,
	LOCAL_PORT,
	TEST_BASE_URL,
	TEST_DB_URL,
	DEV_ENV,
	DB_URL,
	DB_USERNAME,
	DB_PASSWORD
}
