import bcrypt from 'bcrypt';
import { isEmpty, validate } from 'class-validator';
import cookie from 'cookie';
import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import auth from '../middlewares/auth';

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    //* validate data
    let validateErrors: any = {};
    const emailUser = await User.findOne({ email })
    const usernamelUser = await User.findOne({ username })

    if (emailUser) validateErrors.email = 'Email is already taken';
    if (usernamelUser) validateErrors.username = 'Username is already taken';

    if (Object.keys(validateErrors).length > 0) return res.status(400).json(validateErrors)

    //* Create user
    const user = new User({ email, username, password })
    const errors = await validate(user)

    if (errors.length > 0) return res.status(400).json({ message: "Something wrong with you 🤔", errors })

    await user.save()

    return res.json(user)
    //* Return user
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something when wrong 😭', error })
  }
}

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body

  try {
    let errors: any = {};

    if (isEmpty(username)) errors.username = 'Username must not be empty'
    if (isEmpty(password)) errors.password = 'Password must not be empty';

    if (Object.keys(errors).length > 0) return res.status(400).json(errors)

    const user = await User.findOne({ username })

    if (!user) return res.status(404).json({ error: "Username or Password is incorrect" })

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(401).json({ error: "Username or Password is incorrect" })
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET)

    res.set('Set-cookie', cookie.serialize('token', token, {
      httpOnly: true, //cannot be access by JS
      secure: process.env.NODE_ENV === 'production',
      sameSite: "strict", //This should only be in our domain
      maxAge: 3600,
      path: '/', // This cookie valid all across our app
    }))

    return res.json(user)
  } catch (error) {

  }
}

const me = async (req: Request, res: Response) => {
  return res.json(res.locals.user)
}
const logout = async (_: Request, res: Response) => {
  res.set('Set-cookie', cookie.serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/'
  }))

  return res.status(200).json({ success: true })
}
const router = Router()
router.post('/register', register)
router.post('/login', login)
router.get('/me', auth, me)
router.get('/logout', auth, logout)
export default router;