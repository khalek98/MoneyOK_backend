"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_jwt_1 = require("passport-jwt");
dotenv_1.default.config();
// Passport JWT configuration
const jwtOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};
passport_1.default.use(new passport_jwt_1.Strategy(jwtOptions, (payload, done) => {
    const user = Object.assign({}, payload);
    done(null, user);
}));
// Configure the Google strategy with your API credentials
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:4000/api/auth/google/callback",
//     },
//     (accessToken, refreshToken, profile, done) => {
//       // Check if user already exists in database
//       console.log("profile: ", profile);
//       User.findOne({ googleId: profile.id })
//         .then((user) => {
//           if (user) {
//             // User already exists in database, log them in
//             return done(null, user);
//           } else {
//             // Create new user in database
//             const categoryId = randomUUID();
//             const newUser = new User({
//               id: randomUUID(),
//               googleId: profile.id,
//               username: profile.displayName,
//               email: profile.emails[0].value,
//               avatar: profile.photos[0].value,
//               isConfirmed: true,
//               accessToken,
//               refreshToken,
//               resetPasswordExpires: Date.now(),
//               categories: {
//                 categoriesIncome: [],
//                 categoriesExpenses: [],
//               },
//               wallets: [
//                 {
//                   name: "Example",
//                   id: randomUUID(),
//                   balance: 0,
//                   transactions: {
//                     description: "test income",
//                     amount: 100,
//                     type: "income",
//                     categoryId,
//                     date: new Date(),
//                   },
//                 },
//               ],
//             });
//             newUser
//               .save()
//               .then((savedUser) => {
//                 done(null, savedUser);
//               })
//               .catch((err) => {
//                 console.log(err);
//                 done(err);
//               });
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//           done(err);
//         });
//     },
//   ),
// );
// Сериализация пользователя для сохранения в сессии
// passport.serializeUser((user: any, done) => {
//   done(null, user._id);
// });
// Десериализация пользователя при извлечении его из сессии
// passport.deserializeUser(async (id: any, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (error) {
//     console.error(error);
//     done(error);
//   }
// });
exports.default = passport_1.default;
