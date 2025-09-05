"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSuperAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../config/env");
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = require("../modules/user/user.model");
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isSuperAdminExist = yield user_model_1.User.findOne({ email: env_1.envVars.SUPER_ADMIN_EMAIL });
        if (isSuperAdminExist) {
            // eslint-disable-next-line no-console
            console.log("Super Admin Already Exists!");
            return;
        }
        // eslint-disable-next-line no-console
        console.log("Trying to create Super Admin...");
        const hashedPassword = yield bcryptjs_1.default.hash(env_1.envVars.SUPER_ADMIN_PASSWORD, Number(env_1.envVars.BCRYPT_SALT));
        // const wallet = await Wallet.create({});
        const payload = {
            name: env_1.envVars.SUPER_ADMIN_NAME,
            role: user_interface_1.IRole.ADMIN,
            email: env_1.envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            phoneNo: env_1.envVars.SUPER_ADMIN_PHONENO,
            status: user_interface_1.IStatus.ACTIVE,
            // walletId: wallet?._id
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const superadmin = yield user_model_1.User.create(payload);
        // eslint-disable-next-line no-console
        console.log("Super Admin Created Successfuly! \n");
        // console.log(superadmin);
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
    }
});
exports.seedSuperAdmin = seedSuperAdmin;
