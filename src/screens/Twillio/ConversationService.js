import {Client, Conversation} from '@twilio/conversations';
import {
  conversationsMap,
  mediaMap,
  messagesMap,
} from '../../redux/coversation-objects';

const statusObj = {
  sent: true,
  received: true,
  pending: true,
};
export class TwilioService {
  static serviceInstance;
  static chatClient;

  constructor() {}

  static getInstance() {
    if (!TwilioService.serviceInstance) {
      TwilioService.serviceInstance = new TwilioService();
    }
    return TwilioService.serviceInstance;
  }

  async getChatClient(twilioToken) {
    if (!TwilioService.chatClient && !twilioToken) {
      throw new Error('Twilio token is null or undefined');
    }
    if (!TwilioService.chatClient && twilioToken) {
      const client = new Client(twilioToken);
      TwilioService.chatClient = client;
      return TwilioService.chatClient;
    }
    return Promise.resolve().then(() => TwilioService.chatClient);
  }

  clientShutdown() {
    TwilioService.chatClient?.shutdown();
    TwilioService.chatClient = null;
  }

  addTokenListener(getToken) {
    if (!TwilioService?.chatClient) {
      throw new Error('Twilio client is null or undefined');
    }
    TwilioService?.chatClient.on('tokenAboutToExpire', () => {
      getToken()?.then(
        chatToken =>
          chatToken && TwilioService.getInstance().getChatClient(chatToken),
      );
    });

    TwilioService?.chatClient.on('tokenExpired', () => {
      getToken()?.then(
        chatToken =>
          chatToken && TwilioService.getInstance().getChatClient(chatToken),
      );
    });
    return TwilioService.chatClient;
  }

  parseChannels(channels) {
    return channels.map(this.parseChannel);
  }
  parseChannel(channel) {
    if (!conversationsMap.has(channel?.sid)) {
      conversationsMap.set(channel?.sid, channel);
    }
    return {
      sid: channel?.sid,
      friendlyName: channel?.friendlyName,
      attributes: channel?.attributes,
      createdAt: new Date(channel?.dateCreated).getTime(),
      updatedAt: new Date(channel?.dateUpdated).getTime(),
      lastMessageTime: new Date(
        channel?.lastMessage?.dateCreated ??
          channel?.dateUpdated ??
          channel?.dateCreated,
      ).getTime(),
    };
  }

  parseMessages(messages) {
    return messages.map(this.parseMessage).reverse();
  }

  parseMessage(message) {
    if (!messagesMap.has(message?.sid)) {
      messagesMap.set(message?.sid, message);
    }
    if (message?.sid && message?.attachedMedia) {
      message?.attachedMedia.forEach(media => {
        if (!mediaMap.has(media.sid)) {
          mediaMap.set(media.sid, media);
        }
      });
    }
    let obj = {
      _id: message?.sid,
      text: message?.body,
      type: message?.type,
      createdAt: new Date(message.dateCreated).toUTCString(),
      user: {
        _id: message?.author,
        name: message?.author,
      },
      attachedMedia: message?.attachedMedia,
      index: message.index,
    };

    return obj;
  }
}
