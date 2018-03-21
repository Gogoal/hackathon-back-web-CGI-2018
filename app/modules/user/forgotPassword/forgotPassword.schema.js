import mongoose, { Schema } from 'mongoose';

/**
 * Create a new schema
 */
const forgotPasswordSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'Users' },
    token: {
      type: String,
    },
  },
  {
    timestamps: true, // Add createdAt and updatedAt to the object
  },
);

/**
 * Specifiy the populate path
 * @param next
 */
function populate(next) {
  this.populate([{ path: 'user' }]);
  next();
}

/**
 * Add populate to each findOne and find to userShema
 */
forgotPasswordSchema
  .pre('findOne', populate)
  .pre('find', populate);

export default mongoose.model('ForgotPassword', forgotPasswordSchema);
