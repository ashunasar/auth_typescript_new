import Jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { token } from "morgan";

const signAccessToken = (userId: string) => {
  return new Promise((resolve, reject) => {
    const payload: JwtPayload = { aud: userId, iss: "asim.com" };
    const secretKey = "LHW8HiA0oZh4az1BLwe5Fsvza3F2MbV0";
    const options: SignOptions = {
      expiresIn: "1h",
    };

    Jwt.sign(payload, secretKey, options, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};

export { signAccessToken };
