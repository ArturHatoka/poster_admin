import { DataTypes } from 'sequelize';
import {sequelize} from "../database.js";

const Category = sequelize.define('category', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    sort: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    keywords: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
});

export default Category;