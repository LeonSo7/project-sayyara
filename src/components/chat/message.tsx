import { UserType } from "@prisma/client";
import { AuthSelectors } from "@redux/selectors/authSelectors";
import styles from "@styles/components/chat/Message.module.css";
import React from "react";
import { useSelector } from "react-redux";
import { IMessage } from "src/types/quotes";

interface IMessageProps {
  msg: IMessage;
}

/**
 * Creates a component for a single chat message
 *
 * @author Timothy Choy <32019738+TimChoy@users.noreply.github.com>
 * @date 02/13/2023
 * @param {IMessageProps} props - Message props
 * @returns A react component for a message
 */
const Message = (props: IMessageProps) => {
  const userType = useSelector(AuthSelectors.getUserType);
  const { msg } = props;

  let msgClass = styles.other;
  switch (userType) {
    case UserType.CUSTOMER:
      msgClass = msg.customerId ? styles.you : styles.other;
      break;
    case UserType.SHOP_OWNER:
    case UserType.EMPLOYEE:
      msgClass = msg.shopId ? styles.you : styles.other;
      break;
    default:
      break;
  }

  return (
    <div className={msgClass}>
      <div className={styles.messageContent}>
        <div className={styles.messageText}>{msg.message}</div>
        <div className={styles.messageTime}>
          {new Date(msg.createdAt).toLocaleString("en-US")}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Message);
