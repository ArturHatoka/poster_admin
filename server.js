import express from 'express'
const app = express();
const port = 10000;
import AdminJS, {ComponentLoader} from 'adminjs'
import { dark, light, noSidebar } from '@adminjs/themes'
import AdminJSExpress from '@adminjs/express'
import AdminJSSequelize from '@adminjs/sequelize'
import { sequelize} from './database.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import session from 'express-session';
import cors from 'cors';
import Category from './models/category.js';
import User from './models/user.js';
import Image from './models/image.js'
import multer from 'multer';
import uploadFeature from '@adminjs/upload';
import * as url from "url";
import * as path from "path";
const componentLoader = new ComponentLoader()
const upload = multer({ dest: 'uploads/' });
dotenv.config();

Category.belongsTo(Image, { foreignKey: 'img_id', as: 'image' });

const localProvider = {
    bucket: 'uploads',
    opts: {
        baseUrl: '/uploads',
    },
};

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: !!process.env.PROD }
}));

sequelize.sync({ force: false })
    .then(() => console.log("Таблицы были успешно синхронизированы"))
    .catch((error) => console.error("Ошибка при синхронизации таблиц:", error));

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

const ImageResource = {
    resource: Image,
    features: [
        uploadFeature({
            componentLoader,
            provider: { local: localProvider },
            properties: { file: 'file', key: 's3Key', bucket: 'bucket', mimeType: 'mime' },
            validation: { mimeTypes: ['image/png', 'application/pdf', 'audio/mpeg', 'image/jpeg'] },
            uploadPath: (record, filename) => (
                `upload/${record.id()}/${filename}`
            ),
        }),
    ],
}
const CategoryResource = {
    resource: Category,
    options: {
        // Настройки ресурса категории
    },
}

const adminJs = new AdminJS({
    defaultTheme: dark.id,
    availableThemes: [dark, light, noSidebar],
    databases: [sequelize],
    rootPath: '/admin',
    componentLoader,
    resources: [
        UserResource,
        ImageResource,
        CategoryResource,
    ],
});

const authenticate = async (email, password) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return false;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return false;
    }
    return user;
};
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
    cookie: { secure: !!process.env.PROD } // Используем secure cookies в продакшене
});

app.use(adminJs.options.rootPath, adminRouter);

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
app.use(express.static(path.join(__dirname, 'uploads')));
app.get('/', (req, res) => res.send('Кто тут?'));

app.post('/upload', upload.single('image'), function (req, res, next) {
    // req.file - файл `image`
    // Здесь код для обработки загруженного файла и сохранения его данных в базе
});
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
