import mongoose, { Schema } from 'mongoose';

// Create an user schema
const userSchema = new Schema(
  {
    lastName: {
      type: String,
      required: 'Merci de renseigner votre nom.',
    },
    firstName: {
      type: String,
      required: 'Merci de renseigner votre prénom.',
    },
    email: {
      type: String,
      required: 'Merci de renseigner votre email.',
    },
    birthdate: {
      type: Date,
    },
    gender: {
      type: String,
      required: 'Merci de renseigner votre genre.',
    },
    password: {
      type: String,
      required: 'Merci de renseigner un mot de passe',
    },
    facebookId: {
      type: String,
    },
    isValidate: {
      type: Boolean,
      default: false,
    },
    validateToken: {
      type: String,
    },
  },
  {
    // Add createdAt and updatedAt to the object
    timestamps: true,
  },
);

/**
 * Specifiy the populate path
 * @param next
 */
function populate(next) {
  this.populate([{ path: 'sports' }]);
  next();
}

/**
 * Add populate to each findOneAndUpdate, findOne and find to userShema
 */
userSchema
  .pre('findOneAndUpdate', populate)
  .pre('findOne', populate)
  .pre('find', populate);

// Export the schema
export default mongoose.model('Users', userSchema);
