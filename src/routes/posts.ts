import { Request, Response, Router } from "express";
import Comment from '../entities/Comment';
import { default as Post, default as POST } from "../entities/Post";
import Sub from "../entities/Sub";
import auth from '../middlewares/auth';
import user from "../middlewares/user";

const creatPost = async (req: Request, res: Response) => {
  const { title, body, sub } = req.body;

  const user = res.locals.user

  if (title.trim() === '') return res.status(400).json({ title: "Title must not be empty" })

  try {
    //* find sub
    const subRecord = await Sub.findOneOrFail({ name: sub })

    const post = new POST({ title, body, user, sub: subRecord })
    await post.save()

    return res.json(post)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something when wrong 😭' })
  }
}

const getPosts = async (_: Request, res: Response) => {
  try {
    const posts = await Post.find({
      order: { createdAt: 'DESC' },
      relations: ['comments', 'votes', 'sub']
    })

    if (res.locals.user) {
      posts.forEach(post => post.setUserVote(res.locals.user))
    }

    return res.json(posts)
  } catch (error) {
    return res.status(500).json({ error: "Something when wrong 😭" })
  }
}


const getPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  try {
    const post = await Post.findOneOrFail({
      identifier, slug
    },
      //THIS ONE LINE TAKE ME ONE NIGHT 😡😡😡
      { relations: ['sub', 'votes', 'comments'] }
    )
    //AND THIS  😡😡😡

    //* set current user for current post
    if (res.locals.user) {
      post.setUserVote(res.locals.user)
    }

    return res.json(post)
  } catch (error) {
    return res.status(404).json({ error: "Post not found 👀" })
  }
}

const commentOnPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  const { body } = req.body

  try {
    const post = await Post.findOneOrFail({ identifier, slug })

    const comment = new Comment({ body, user: res.locals.user, post })

    await comment.save()

    return res.json(comment)
  } catch (err) {
    console.log(err)
    return res.status(404).json({ error: "Post not found 👀" })
  }
}

const getPostComments = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params
  try {
    const post = await Post.findOneOrFail({ identifier, slug })

    const comments = await Comment.find({
      where: { post },
      order: { createdAt: "DESC" },
      relations: ['votes']
    })

    if (res.locals.user) {
      comments.forEach(comment => comment.setUserVote(res.locals.user))
    }

    return res.json(comments)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Something when wrong 😭" })
  }
}

const router = Router();

router.post('/', user, auth, creatPost)
router.get('/', user, getPosts)
/*
  Check user if they logged in or not
  if yes: set current user to res.locals.user for /client
  else just continue to show the post
*/
router.get('/:identifier/:slug', user, getPost)
router.post('/:identifier/:slug/comments', user, auth, commentOnPost)
router.get('/:identifier/:slug/comments', user, getPostComments)
export default router