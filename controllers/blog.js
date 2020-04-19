const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../model/blogs');
const User = require('../model/user');

blogsRouter.get('/', async (_request, response, next) => {
  try {
    const getAllblogs = await Blog.find({}).populate('user', { name: 1, username: 1, id: 1 });
    const toJSONblogs = getAllblogs.map((blog) => blog.toJSON());
    response.json(toJSONblogs);
  } catch (error) { next(error); }
});

blogsRouter.post('/', async (request, response, next) => {
  const { body } = request;

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);

    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing' });
    }

    /* const findAUser = await User.findOne({}); */

    const foundLogged = await User.findById(decodedToken.id);

    const newBblog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes ? body.likes : 0,
      user: foundLogged.id,
    });

    const savedBlog = await newBblog.save();
    foundLogged.blogs = foundLogged.blogs.concat(foundLogged.id);
    await foundLogged.save();
    response.json(savedBlog.toJSON());
  } catch (error) { next(error); }
});

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    const blog = await Blog.findById(request.params.id);

    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' });
    }
    console.log(blog.user, typeof blog.user);
    console.log(decodedToken.id, typeof decodedToken.id);

    if (blog.user.toString() === decodedToken.id) {
      await Blog.findByIdAndRemove(request.params.id);
      response.status(204).end();
    } else {
      return response.status(401).json({ error: 'An Invalid user cannot delete this blog' });
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.put('/:id', async (request, response, next) => {
  const { body } = request;

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    const blog = await Blog.findById(request.params.id);

    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing' });
    }

    if (blog.user.toString() === decodedToken.id) {
      const foundLogged = await User.findById(decodedToken.id);
      const updateTheseProperties = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: foundLogged.id,
      };
      // eslint-disable-next-line max-len
      const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, updateTheseProperties, { new: true });
      response.json(updatedBlog.toJSON());
    } else {
      return response.status(401).json({ error: 'An Invalid user cannot update this blog' });
    }
  } catch (error) { next(error); }
});

module.exports = blogsRouter;
