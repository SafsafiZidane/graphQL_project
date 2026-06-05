const { notificationSchema } = require('../../utils/validation');

const NotificationResolvers = {
  Query: {
    notifications: async (_, { recipient }, { db }) => {
      const query = db('notifications').select('*').orderBy('sent_at', 'desc');
      if (recipient) {
        query.where({ recipient });
      }
      return query;
    },
  },
  Mutation: {
    sendNotification: async (_, { input }, { db, user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      const { error, value } = notificationSchema.validate(input, { stripUnknown: true });
      if (error) {
        throw new Error(error.message);
      }
      const [notification] = await db('notifications')
        .insert(value)
        .returning(['id', 'recipient', 'message', 'read', 'sent_at']);
      return notification;
    },
    markNotificationRead: async (_, { id }, { db, user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      const notification = await db('notifications').where({ id }).first();
      if (!notification) {
        throw new Error('Notification not found');
      }
      const [updatedNotification] = await db('notifications')
        .where({ id })
        .update({ read: true })
        .returning(['id', 'recipient', 'message', 'read', 'sent_at']);
      return updatedNotification;
    },
  },
};

module.exports = NotificationResolvers;
