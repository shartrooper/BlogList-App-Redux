// eslint-disable-next-line no-unused-vars
const dummy = (_blogs) => 1;

const totalLikes = (list) => list.reduce((sum, post) => sum + post.likes, 0);

const favoriteBlog = (list) => list.reduce((blogA, blogB) => (
  blogA.likes > blogB.likes
    ? blogA : blogB), 0);

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
