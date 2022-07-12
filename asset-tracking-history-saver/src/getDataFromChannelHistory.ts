import { Types } from 'ably';
import { ENHANCED_LOCATION_MESSAGE } from './consts';
import { EnhancedLocationUpdate } from './types';

export const getEnhancedLocationsFromChannelHistory = async (
  channel: Types.RealtimeChannelPromise,
  historyStartTimestamp?: number,
  historyFinishTimestamp?: number
): Promise<EnhancedLocationUpdate[]> => {
  const allMessages = await getAllHistoryMessages(channel);
  let enhancedLocationMessages = allMessages.filter(
    (message: Types.Message) => message.name === ENHANCED_LOCATION_MESSAGE
  );
  if (historyStartTimestamp) {
    enhancedLocationMessages = enhancedLocationMessages.filter(
      (message: Types.Message) => message.timestamp >= historyStartTimestamp
    );
  }
  if (historyFinishTimestamp) {
    enhancedLocationMessages = enhancedLocationMessages.filter(
      (message: Types.Message) => message.timestamp <= historyFinishTimestamp
    );
  }
  return enhancedLocationMessages.map((message: Types.Message) => JSON.parse(message.data));
};

const getAllHistoryMessages = async (channel: Types.RealtimeChannelPromise): Promise<Types.Message[]> => {
  let messagesPage = await channel.history();
  let messages = [...messagesPage.items];
  let activeMessagesPage = messagesPage;
  while (activeMessagesPage.hasNext()) {
    const nextMessagesPage = await getNextHistoryMessagesPage(activeMessagesPage);
    messages = [...messages, ...nextMessagesPage.items];
    activeMessagesPage = nextMessagesPage;
  }
  return messages.reverse(); // messages originally come from oldest to newest
};

const getNextHistoryMessagesPage = (
  messagesPage: Types.PaginatedResult<Types.Message>
): Promise<Types.PaginatedResult<Types.Message>> => {
  return new Promise((resolve, reject) => {
    messagesPage.next((error: any, nextMessagesPage: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(nextMessagesPage);
      }
    });
  });
};
