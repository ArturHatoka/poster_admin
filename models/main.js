import {DataTypes} from 'sequelize';
import {sequelize} from "../database.js";

const Main = sequelize.define('main', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    keywords: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {});

export default Main;