require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const connection = process.env.DATABASEURL;

const pool = new Pool({ connectionString: connection });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
module.exports = prisma;
