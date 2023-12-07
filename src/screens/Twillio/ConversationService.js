import {Client, Conversation} from '@twilio/conversations';

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
    if (!TwilioService.chatClient) {
      throw new Error('Twilio client is null or undefined');
    }
    TwilioService.chatClient.on('tokenAboutToExpire', () => {
      getToken().then(TwilioService.chatClient.updateToken);
    });

    TwilioService.chatClient.on('tokenExpired', () => {
      getToken().then(TwilioService.chatClient.updateToken);
    });
    return TwilioService.chatClient;
  }

  parseChannels(channels) {
    return channels.map(this.parseChannel);
  }
  parseChannel(channel) {
    return {
      id: channel?.sid,
      // isOnline: channel?.isOnline,
      name: channel?.friendlyName,
      lastMessageText: channel?.attributes?.lastMessageText || '',
      attributes: channel?.attributes,
      createdAt: new Date(channel?.dateCreated).getTime(),
      updatedAt: new Date(channel?.dateUpdated).getTime(),
      lastMessageTime: new Date(
        // channel?.lastMessage?.dateCreated ??
        channel?.dateUpdated ?? channel?.dateCreated,
      ).getTime(),
    };
  }

  parseMessages(messages) {
    return messages.map(this.parseMessage).reverse();
  }

  parseMessage(message) {
    return {
      _id: message?.sid,
      text: message?.body,
      createdAt: new Date(message.dateCreated).toUTCString(),
      user: {
        _id: message?.author,
        name: message?.author,
      },
      received: true,
    };
  }
}
