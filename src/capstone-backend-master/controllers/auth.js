const bcrypt = require("bcrypt");
const { User, validateUser } = require("./../models/user");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const { AUTH_TOKEN, ADMIN } = require("../constants");

async function signIn(req, res) {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    return res.status(401).send("This email has not been registered!");
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(401).send("Invalid Credentials!");
  }

  const token = jwt.sign(
    {
      _id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      isAdmin: user.role === ADMIN,
    },
    "1@3456Qw-"
  );
  res.header(AUTH_TOKEN, token).send({
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    isAuthenticated: true,
  });
}

async function signUp(req, res) {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(`Bad Request ${error}`);
  }

  let user = await User.findOne({ email: req.body.email });

  if (user) {
    return res
      .status(400)
      .send("Try any other email, this email is already registered!");
  }

  let userPhone = await User.findOne({ contactNumber: req.body.contactNumber });

  if (userPhone) {
    return res.status(400).send("Number already exists");
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const user = new User({
      ...req.body,
      password: await bcrypt.hash(req.body.password, salt),
    });
    const response = await user.save();
    res.send(_.pick(response, ["firstName", "lastName", "email", "_id"]));
  } catch (ex) {
    res.status(400).send(ex.message);
  }
}

module.exports = {
  signUp,
  signIn,
};
