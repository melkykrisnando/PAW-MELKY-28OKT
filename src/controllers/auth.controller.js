import UserModel from "../model/user.model.js"
import { registerSchema } from "../schemas/auth.schema.js"
import { PasswordHelper } from "../utils/bcrypt.js"
import { apiResponse, apiResponseValidation } from "../utils/response"

class AuthController {
    static async register(req, res){
        const result = registerSchema.safeParse(req.body)

        if (!result.success){
            return apiResponseValidation({
                res,
                errors: result.error
            })
        }
        
        const {name, email, password} = result.data

        const newUser = await UserModel.create({
            name,
            email,
            password: await PasswordHelper.hash
        })
        return apiResponse({
            res,
            status: 201,
            message: "Register Berhasil",
            data: null
        })
    }

    static async login(req, res){

    }
}
export default AuthController