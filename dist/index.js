"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("./passport"));
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const transactions_1 = __importDefault(require("./routes/transactions"));
const wallets_1 = __importDefault(require("./routes/wallets"));
const categories_1 = __importDefault(require("./routes/categories"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Подключение к MongoDB
mongoose_1.default
    .connect(process.env.MONGODB_URI)
    .then((res) => console.log("DB OK!"))
    .catch((err) => console.log("DB error", err));
// Настройка сессий
app.use((0, express_session_1.default)({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        domain: null,
    },
}));
// Настройка bodyParser и cookieParser
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
// Настройка CORS
app.use((0, cors_1.default)({
    origin: process.env.CORS_URL,
    credentials: true,
}));
// Middleware to initialize Passport
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Роуты для авторизации и регистрации пользователей
app.use("/api/auth", auth_1.default);
// Защищенные роуты для просмотра расходов и доходов
app.use("/api/transactions", transactions_1.default);
app.use("/api/wallets", wallets_1.default);
app.use("/api/categories", categories_1.default);
// Обработка ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});
// Запуск сервера
app.listen(process.env.PORT, () => {
    console.log(`Server started on http://localhost:${process.env.PORT}`);
});
