/* eslint-disable no-bitwise */
export const conversationsMap = new Map();
export const messagesMap = new Map();
export const usersMap = new Map();
export const mediaMap = new Map();
export const participantsMap = new Map();

const capitalize = string => `${string[0].toUpperCase()}${string.substring(1)}`;

const getSdkObject = (objectMap, sid, type) => {
  const sdkObject = objectMap.get(sid);
  if (!sdkObject) {
    throw new Error(`${capitalize(type)} with SID ${sid} was not found.`);
  }

  return sdkObject;
};

export const getSdkConversationObject = reduxConversation =>
  getSdkObject(conversationsMap, reduxConversation.sid, 'conversation');

export const getSdkMessageObject = reduxMessage =>
  getSdkObject(messagesMap, reduxMessage._id, 'message');

export const getSdkUserObject = reduxUser =>
  getSdkObject(usersMap, reduxUser.identity, 'user');

export const getSdkMediaObject = reduxMedia =>
  getSdkObject(mediaMap, reduxMedia.sid, 'media');

export const getSdkParticipantObject = reduxParticipant =>
  getSdkObject(participantsMap, reduxParticipant.sid, 'participant');
