import {DataTypes} from "sequelize";
import {sequelize} from "../database.js";

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {});
export default User;