import mongoose, { Model } from "mongoose";
import bcrypt from "bcrypt";
const Schema = mongoose.Schema;

interface IUser {
  email: string;
  password: string;
}

interface IUserMethods {
  isValidPassword(password: string): Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (err: any) {
    next(err);
  }
});
UserSchema.methods.isValidPassword = async function (
  password: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model<IUser, UserModel>("user", UserSchema);

export default User;
