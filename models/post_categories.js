import {sequelize} from "../database.js";
import {DataTypes} from "sequelize";

const PostCategories = sequelize.define('post_categories', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    postId: {
        type: DataTypes.INTEGER,
    },
    categoryId: {
        type: DataTypes.INTEGER,
    },
}, {});

export default PostCategories;
