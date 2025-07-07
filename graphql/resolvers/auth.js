// ------------------------
// Auth & User utilities
// ------------------------
const bcrypt = require('bcryptjs');   // For hashing & verifying passwords
const jwt    = require('jsonwebtoken'); // For issuing JWT auth tokens

const User = require('../../models/user'); // Mongoose User model

module.exports = {
  /* ----------------------------------------------------------
   *  Mutation: createUser
   * ----------------------------------------------------------
   *  Registers a new user.
   *  Steps:
   *    1) Check if the email is already taken.
   *    2) Hash the password (12 rounds of salt).
   *    3) Save the user to MongoDB.
   *    4) Return user data (never expose the password).
   * ---------------------------------------------------------- */
  createUser: async args => {
    try {
      // 1) Prevent duplicate accounts
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error('User exists already.');
      }

      // 2) Securely hash the password
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      // 3) Build and store the new user
      const user = new User({
        email:    args.userInput.email,
        password: hashedPassword
      });

      const result = await user.save();

      // 4) Return user info (password set to null for security)
      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;  // Pass any error up the call stack
    }
  },

  /* ----------------------------------------------------------
   *  Query / Mutation: login
   * ----------------------------------------------------------
   *  Logs a user in by:
   *    1) Verifying the email exists.
   *    2) Comparing the supplied password with the stored hash.
   *    3) Issuing a JWT valid for 1 hour.
   *  Returns: { userId, token, tokenExpiration }
   * ---------------------------------------------------------- */
  login: async ({ email, password }) => {
    // 1) Find user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error('User does not exist!');
    }

    // 2) Validate password
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Password is incorrect!');
    }

    // 3) Sign a JSON Web Token
    const token = jwt.sign(
      { userId: user.id, email: user.email }, // Payload
      'somesupersecretkey',                  // Secret key (keep safe!)
      { expiresIn: '1h' }                    // Token life span
    );

    // Return token and metadata
    return { userId: user.id, token: token, tokenExpiration: 1 };
  }
};
