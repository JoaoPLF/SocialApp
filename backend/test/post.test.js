require("dotenv").config();
const jwt = require("jsonwebtoken");
const { assert } = require("chai");

const UserModel = require("../src/models/user.model");
const PostModel = require("../src/models/post.model");

const { createUser } = require("../src/controllers/user.controller");
const { createPost, getAllPosts } = require("../src/controllers/post.controller");

const ValidationError = require("../src/utils/ValidationError");

const mockUser = require("./user.json");
const mockPost = require("./post.json");

const clearCollections = async () => {
  await UserModel.deleteMany({});
  await PostModel.deleteMany({});
  return [await UserModel.find(), await PostModel.find()];
};

describe("Post", () => {
  it("should clear collections before tests", async () => {
    const collections = await clearCollections();
    assert.isEmpty(collections[0]);
    assert.isEmpty(collections[1]);
  });

  describe("Create Post", () => {
    let token;
    let decode;

    it("should create a new user", async () => {
      try {
        token = await createUser({ ...mockUser });
        assert.isNotEmpty(token);
        assert.containsAllKeys(token, "token");
      }
      catch (err) {
        throw err;
      }
    });

    it("should get the user handle from token", () => {
      decode = jwt.verify(token.token, process.env.TOKEN_KEY);
      assert.containsAllKeys(decode, "handle");
    });

    it("should throw ValidationError because post body is empty", async () => {
      try {
        const post = await createPost({ userHandle: decode.handle, body: "" });
      }
      catch (err) {
        assert.instanceOf(err, ValidationError);
      }
    });

    it("should create a new post", async () => {
      try {
        const post = await createPost({ userHandle: decode.handle, body: mockPost.body });

        assert.isNotEmpty(post);
        assert.equal(post.body, mockPost.body);
      }
      catch (err) {
        throw err;
      }
    });

    it("should get all posts", async () => {
      try {
        const posts = await getAllPosts();

        assert.isNotNull(posts);
        assert.lengthOf(posts, 1);
      }
      catch (err) {
        throw err;
      }
    });
  });

  it("should clear collections after tests", async () => {
    const collections = await clearCollections();
    assert.isEmpty(collections[0]);
    assert.isEmpty(collections[1]);
  });
});