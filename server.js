import express from 'express'
const app = express();
const port = 3030;
import AdminJS from 'adminjs'
import { dark, light, noSidebar } from '@adminjs/themes'
import AdminJSExpress from '@adminjs/express'
import AdminJSSequelize from '@adminjs/sequelize'
import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import session from 'express-session';
import cors from 'cors';
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
dotenv.config();
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

const sequelize = new Sequelize('postgres://postgres:123@localhost:5432/lucky');

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

sequelize.sync();
AdminJS.registerAdapter(AdminJSSequelize);
const UserResource = {
    resource: User,
    options: {
        actions: {
            list: {
                showFilter: false,
            },
            edit: {
                isVisible: false,
            },
            delete: {
                isVisible: false,
            },
            new: {
                isVisible: false,
            },
            bulkDelete: {
                isVisible: false,
            },
        },
    },
}
const adminJs = new AdminJS({
    defaultTheme: dark.id,
    availableThemes: [dark, light, noSidebar],
    databases: [sequelize],
    rootPath: '/admin',
    resources: [
        UserResource,
    ],
});

// Функция для проверки пароля (примерная реализация, предполагается, что пароль уже хеширован)
const authenticate = async (email, password) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return false; // Пользователь не найден
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return false; // Пароль не совпадает
    }
    return user; // Пользователь аутентифицирован
};

// Построение аутентифицированного роутера для AdminJS
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
    authenticate: async (email, password) => {
        const user = await authenticate(email, password);
        if (user) {
            return user;
        }
        return false;
    },
    cookieName: 'adminjs',
    cookiePassword: process.env.SESSION_COOKIE_SECRET, // Используем секретный ключ из .env
}, null, {
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Используем secure cookies в продакшене
});
app.use(adminJs.options.rootPath, adminRouter);

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
