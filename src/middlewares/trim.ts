import { Request, Response } from "express";

export default (req: Request, _: Response, next: Function) => {
  const exceptions = ['password']
  Object.keys(req.body).forEach(key => {
    if (!exceptions.includes(key) && typeof req.body[key] === 'string') {
      req.body[key] = req.body[key].trim()
    }
  })

  next()
}