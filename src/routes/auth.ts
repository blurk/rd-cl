import { validate } from 'class-validator';
import { Request, Response, Router } from "express";
import { User } from "../entities/User";

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    //TODO validate data
    let validateErrors: any = {};
    const emailUser = await User.findOne({ email })
    const usernamelUser = await User.findOne({ username })

    if (emailUser) validateErrors.email = 'Email is already taken';
    if (usernamelUser) validateErrors.username = 'Username is already taken';

    if (Object.keys(validateErrors).length > 0) return res.status(400).json(validateErrors)

    //TODO Create user
    const user = new User({ email, username, password })
    const errors = await validate(user)

    if (errors.length > 0) return res.status(400).json({ message: "Something wrong with you 🤔", errors })

    await user.save()

    return res.json(user)
    //TODO Return user
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something when wrong 😭', error })
  }
}

const router = Router()
router.post('/register', register)

export default router;