/* eslint-disable eol-last */
const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');

const api = supertest(app);
const Blog = require('../model/blogs');
const User = require('../model/user');
const helper = require('./test_helper');


/*
A better option is to use Jest directly without npm.
This way we can specify which are the tests that we want to run with Jest.
The following command only runs the tests found in the tests/note_api.test.js file:

npx jest tests/note_api.test.js --runInBand

The -t option can be used for running tests with a specific name:

npx jest -t 'a specific note is within the returned notes'

The provided parameter can refer to the name of the test or the describe block.
The parameter can also contain just a part of the name.
The following command will run all of the tests that contain notes in their name:

npx jest -t 'notes' --runInBand

If you install Jest globally with the command:

npm install -g jest

Then you can run tests directly with the jest command.

*/


describe('note api', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    const blogObjects = helper.initialBloglist
      .map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
  });

  test('Every blog is returned', async () => {
    const response = await api.get('/api/blogs');
    console.log('Response body length : ', response.body.length,
      ' Mock blog data length : ', helper.initialBloglist.length);
    expect(response.body.length).toBe(helper.initialBloglist.length);
  });

  test('Every blog post has id property', async () => {
    try {
      const res = await api.get('/api/blogs');
      const blogArr = res.body;
      blogArr.map((blog) => expect(blog.id).toBeDefined());
    } catch (error) { console.log(error); }
  });

  test('a valid blog post can be added ', async () => {
    const newBlog = {
      title: 'Mock Supertest',
      author: 'Nodds',
      url: 'https://somethingsomethingMock.com/',
      likes: 7,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd.length).toBe(helper.initialBloglist.length + 1);

    const titles = blogsAtEnd.map((n) => n.title);
    expect(titles).toContain(
      'Mock Supertest',
    );
  });

  test('missing likes property defaults to zero', async () => {
    const noLikesBlog = {
      title: 'forever alone',
      author: 'anonymous',
      url: 'https://foobarbaznobodyLikes.org',
    };

    await api
      .post('/api/blogs')
      .send(noLikesBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const zeroLikesBlog = await helper.blogDefaultLikes(noLikesBlog.title);
    expect(zeroLikesBlog.likes).toBe(0);
  });

  test('note without content is not added', async () => {
    const newBlog = {
      author: 'Seam bean',
      likes: 22,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd.length).toBe(helper.initialBloglist.length);
  });

  test('pick a random id from a valid blog post and delete it', async () => {
    const ablogToDeleteFromList = await helper.blogsInDb();
    // eslint-disable-next-line max-len
    const pickedToDelete = ablogToDeleteFromList[helper.returnRandNumber(ablogToDeleteFromList.length)];
    await api
      .delete(`/api/blogs/${pickedToDelete.id}`)
      .expect(204);
    console.log('the selected blog to be erased is:', pickedToDelete.title);
    const updatedBlogList = await helper.blogsInDb();
    expect(ablogToDeleteFromList.length - 1).toBe(updatedBlogList.length);
  });

  test('update a random blog with new likes', async () => {
    const ablogToUpdatefromList = await helper.blogsInDb();
    const rand = helper.returnRandNumber(ablogToUpdatefromList.length);
    const pickedToUpdate = ablogToUpdatefromList[rand];
    const UpdatedBlog = {
      title: pickedToUpdate.title,
      author: pickedToUpdate.author,
      url: pickedToUpdate.url,
      likes: helper.returnRandNumber(999),
    };

    await api
      .put(`/api/blogs/${pickedToUpdate.id}`)
      .send(UpdatedBlog)
      .expect(200);
    console.log('the selected blog is going to be updated', pickedToUpdate.title);
    const updatedBlogList = await helper.blogsInDb();
    expect(UpdatedBlog.likes).toBe(updatedBlogList[rand].likes);
  });
});

describe('user api', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const userObjects = helper.initialUserlist
      .map((u) => new User(u));
    const promiseArray = userObjects.map((u) => u.save());
    await Promise.all(promiseArray);
  });

  test('Every user is returned', async () => {
    const response = await api.get('/api/users');
    expect(response.body.length).toBe(helper.initialUserlist.length);
  });

  test('User with invalid passwords are not created', async () => {
    const invalidNewUser = {
      username: 'davis',
      name: 'fake davix',
      password: '01',
    };

    await api
      .post('/api/users')
      .send(invalidNewUser)
      .expect(403);

    const currentUserData = await helper.usersInDb();
    expect(currentUserData.length).toBe(helper.initialUserlist.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});