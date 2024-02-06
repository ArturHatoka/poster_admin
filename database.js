// database.js
import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize('postgres://postgres:123@localhost:5432/lucky'); // Используйте переменную окружения для URL базы данных

export { sequelize};