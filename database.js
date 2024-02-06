// database.js
import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_CONNECT); // Используйте переменную окружения для URL базы данных

export { sequelize};