import jwt from "jsonwebtoken";
import "dotenv/config"
interface tokenPayload{
    userId: string;
}

export const signAccessToken = (payload: tokenPayload): string =>{
    const accessSecret = process.env.JWT_SECRET! || "jwtaccesssecret";

    const accesssExpired = '15m';

    return jwt.sign(payload, accessSecret,{expiresIn: accesssExpired});
}

export const signRefreshToken = (payload: tokenPayload): string =>{
    const refreshSecret = process.env.JWT_REFRESH_SECRET || 'jwtrefreshsecret';

    const refreshExpired = '7d';

    return jwt.sign(payload, refreshSecret,{expiresIn: refreshExpired});
}

export const verifyRefreshToken = (token: string): tokenPayload =>{
    const refreshSecret = process.env.JWT_REFRESH_SECRET || "jwtrefreshsecret";

    return jwt.verify(token, refreshSecret) as tokenPayload;
}