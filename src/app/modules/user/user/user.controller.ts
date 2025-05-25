import { Request, Response, NextFunction } from 'express';
import { MentorError, MentorResult, JWT } from '../../../utils';

import { Dal as UserDal } from '../../shared/dals/user.dal';
import { IUser } from '../../shared/interfaces/user.interface'
import { User } from '../../shared/models/user.model';
import { hash, compare, genSalt } from 'bcrypt';



export class UserController {

  async registerUser(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const {
        name,
        email,
        password,
      }: IUser = req.body;

      if (!name || !email || !password) {
        throw new MentorError(401, 'Missing Parameters');
      }

      const normalizedEmail = email.toLowerCase();

      const isValidEmail = /\S+@\S+\.\S+/;
      if (!isValidEmail.test(normalizedEmail)) {
        throw new MentorError(401, 'Enter valid email');
      }


      const userEmail: IUser = await UserDal.findUserByEmail(normalizedEmail);
      if (userEmail) {
        throw new MentorError(401, 'Email already registered');
      }

      const salt = await genSalt(8);
      const passwordHash = await hash(password, salt);

      const UserData: IUser = new User({
        name,
        email: normalizedEmail,
        password: passwordHash,
      });

      const user: any = await UserDal.createUser(UserData);
      const token = await JWT.createToken(user._id);

      const result = new MentorResult(200, 'User signup successful!', {
        token,
        user,
      });
      res.status(200).json(result);

    } catch (error: unknown) {
      if (error instanceof MentorError) {
        next(new MentorError(error.status, error.message));
      } else {
        next(new MentorError(500, "Unexpected error occurred"));
      }
    }
  }


  async login(req: Request, res: Response, next: NextFunction): Promise<any> {

    try {

      const { email, password }: IUser = req.body;
      if (!email || !password) {
        throw new MentorError(401, 'Email and Password both are required.');
      }


      const normalizedEmail = email.toLowerCase();

      const user: IUser = await UserDal.findUserByEmail(normalizedEmail);



      if (!user) {
        throw new MentorError(401, 'Email is not registered');
      }

      const userPassword: string = user?.password as string;
      const checkPassword = await compare(password, userPassword);
      if (!checkPassword) {
        throw new MentorError(403, 'Incorrect password');
      }

      const userData = {
        lastLogin: Date.now()
      };
      await UserDal.updateUserById(String(user._id), userData);

      const token = await JWT.createToken(String(user._id));

      const result = new MentorResult(200, 'Login Successful', {
        token,
        user
      });
      res.status(200).json(result);
    } catch (error: unknown) {
      if (error instanceof MentorError) {
        next(new MentorError(error.status, error.message));
      } else {
        next(new MentorError(500, "Unexpected error occurred"));
      }
    }
  }

}

export const UserPanelController = new UserController();

