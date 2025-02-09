import * as dotenv from "dotenv"
import { DataSource } from "typeorm"
import User from "./main/domain/user/user.entity"

const envFile = `.env.${process.env.NODE_ENV || "dev"}`
dotenv.config({ path: envFile })

const configs = {
    db: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
        logging: process.env.DB_LOGGING === "true",
    },
}

const AppDataSource = new DataSource({
    type: "postgres",
    host: configs.db.host,
    port: configs.db.port,
    username: configs.db.user,
    password: configs.db.password,
    database: configs.db.name,
    synchronize: false,
    logging: configs.db.logging,
    entities: [User],
    migrations: [__dirname + "/database/migrations/*{.ts,.js}"],
})

export default AppDataSource