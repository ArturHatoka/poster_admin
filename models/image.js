import {DataTypes} from 'sequelize';
import {sequelize} from "../database.js";

const Image = sequelize.define('image', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bucket: {
        type: DataTypes.STRING,
        isVisible: false,
    },
    mime: {
        type: DataTypes.STRING,
        isVisible: false,
    },
    key: {
        type: DataTypes.STRING,
        isVisible: false,
    },
    size: {
        type: DataTypes.STRING,
        isVisible: false,
    },
    filePath: {
        type: DataTypes.STRING,
    },
}, {});

export default Image;