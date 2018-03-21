import _ from 'lodash';
import mongoose from 'mongoose';

/**
 * Check if the filters exist in collection and get limit and offset pass to parameters
 * @param collection
 * @param query
 * @param limitDefault
 * @returns {{filter: {}, limit: (Number|number), offset: (Number|number)}}
 */
export function formatQuery(collection, query, limitDefault = 10) {
  const filter = {};
  const limit = parseInt(query.limit, 10) || limitDefault;
  const page = parseInt(query.page, 10) || 1;
  const offset = (page * limit) - limit;
  _.forEach(query, (value, key) => {
    if (collection.schema.tree[key]) filter[key] = value;
  });
  return { filter, limit, offset };
}

/**
 * Check if id is valid objectId mongo type
 * @param array
 * @returns validId : boolean
 */
export function isValidObjectId(objectId) {
  let validId = true;
  if (!mongoose.Types.ObjectId.isValid(objectId)) {
    validId = false;
  }
  return validId;
}

/**
 * Check if array is valid objectId mongo type
 * @param array
 * @returns validId : boolean
 */
export function isValidArrayId(array) {
  let validIds = true;

  // First we test if the parameter is an array
  if (Array.isArray(array)) {
    array.forEach((item) => { // Then, we check if each item is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(item)) {
        validIds = false;
      }
    });
  } else {
    validIds = false;
  }

  return validIds;
}

/**
 * Check if string have no forbidden character .,@[|]#%£$
 * @param string
 * @returns validId : boolean
 */
export function isValidString(string) {
  const validCharacter = /\w[^.,@|#%£$[\]]/;
  return validCharacter.test(string);
}

/**
 * Check if mail is valid
 * @param mail
 * @returns validId : boolean
 */
export function isValidEmail(mail) {
  // eslint-disable-next-line no-useless-escape
  const validMail = /^(([^<>()\[\]\\.,;:\s@“]+(\.[^<>()\[\]\\.,;:\s@“]+)*)|(“.+“))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return validMail.test(mail);
}
