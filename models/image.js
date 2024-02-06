import { DataTypes } from 'sequelize';
import {sequelize} from "../database.js";
const Image = sequelize.define('image', {
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {});

export default Image;