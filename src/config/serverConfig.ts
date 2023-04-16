import dotenv from 'dotenv'

dotenv.config()

const envVars = {
    PORT: process.env.PORT,
    MONGO_HOST:process.env.MONGO_HOST,
    MONGO_PORT:process.env.MONGO_PORT,
    MONGO_USERNAME:process.env.MONGO_USERNAME,
    MONGO_PASSWORD:process.env.MONGO_PASSWORD,
    MONGO_DB_NAME:process.env.MONGO_DB_NAME,
    LOG_LEVEL:process.env.LOG_LEVEL,
    REDIS_URL:process.env.REDIS_URL,
    MONGO_URL:process.env.MONGO_URL

}
export default envVars;