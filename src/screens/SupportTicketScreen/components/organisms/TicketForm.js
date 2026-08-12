import React from 'react';
import Animated from 'react-native-reanimated';
import { styles } from '../../styles';
import { entrance } from '../../motion';
import { MESSAGE_LINES } from '../../constants';
import FormField from '../molecules/FormField';
import LinkedOrderCard from '../molecules/LinkedOrderCard';
import PrioritySelector from '../molecules/PrioritySelector';

export default function TicketForm({
  orderRef,
  messageRef,
  title,
  onChangeTitle,
  orderNumber,
  onChangeOrderNumber,
  orderLocked,
  priority,
  onChangePriority,
  message,
  onChangeMessage,
}) {
  return (
    <Animated.View style={styles.formCard} entering={entrance(1)}>
      <FormField
        label="Title"
        icon="text-short"
        placeholder="Enter subject"
        value={title}
        onChangeText={onChangeTitle}
        returnKeyType="next"
        onSubmitEditing={() =>
          orderLocked ? messageRef.current?.focus() : orderRef.current?.focus()
        }
      />

      {orderLocked ? (
        <LinkedOrderCard orderNumber={orderNumber} />
      ) : (
        <FormField
          ref={orderRef}
          label="Order Number (Optional)"
          icon="receipt"
          placeholder="e.g. 123456"
          value={orderNumber}
          onChangeText={onChangeOrderNumber}
          keyboardType="numeric"
          returnKeyType="next"
          onSubmitEditing={() => messageRef.current?.focus()}
          helper="Attach a specific order so we can pull up the details faster."
        />
      )}

      <PrioritySelector value={priority} onChange={onChangePriority} />

      <FormField
        ref={messageRef}
        label="Message"
        icon="message-text-outline"
        placeholder="Describe your issue..."
        value={message}
        onChangeText={onChangeMessage}
        multiline
        numberOfLines={MESSAGE_LINES}
        counter={
          message.length > 0 ? `${message.trim().length} characters` : undefined
        }
      />
    </Animated.View>
  );
}
