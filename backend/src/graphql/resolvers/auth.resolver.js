const bcrypt = require('bcryptjs');
const { signToken } = require('../../utils/jwt');
const { registerSchema, loginSchema } = require('../../utils/validation');

const AuthResolvers = {
  Query: {
    me: async (_, __, { user, db }) => {
      if (!user) {
        return null;
      }
      return db('users').select('id', 'email', 'role', 'created_at').where({ id: user.id }).first();
    },
  },
  Mutation: {
    register: async (_, { input }, { db }) => {
      const { error, value } = registerSchema.validate(input, { stripUnknown: true });
      if (error) {
        throw new Error(error.message);
      }

      const existing = await db('users').where({ email: value.email }).first();
      if (existing) {
        throw new Error('Email is already registered');
      }

      const hashedPassword = await bcrypt.hash(value.password, 10);
      const [user] = await db('users')
        .insert({ email: value.email, password: hashedPassword, role: value.role })
        .returning(['id', 'email', 'role', 'created_at']);

      const token = signToken({ id: user.id, email: user.email, role: user.role });
      return { token, user };
    },
    login: async (_, { input }, { db }) => {
      const { error, value } = loginSchema.validate(input, { stripUnknown: true });
      if (error) {
        throw new Error(error.message);
      }

      const user = await db('users').where({ email: value.email }).first();
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const valid = await bcrypt.compare(value.password, user.password);
      if (!valid) {
        throw new Error('Invalid credentials');
      }

      const token = signToken({ id: user.id, email: user.email, role: user.role });
      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          created_at: user.created_at,
        },
      };
    },
  },
};

module.exports = AuthResolvers;
