import { UserType } from "@prisma/client";
import { AuthSelectors } from "@redux/selectors/authSelectors";
import styles from "@styles/components/quotes/Conversations.module.css";
import classnames from "classnames";
import Image from "next/image";
import { ListBox, ListBoxChangeParams } from "primereact/listbox";
import image from "public/icons/icon-192x192.png";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCustomerQuotes,
  getShopQuotes,
  setSelectedChat,
} from "src/redux/actions/quoteAction";
import { QuoteSelectors } from "src/redux/selectors/quoteSelectors";
import { IQuote } from "src/types/quotes";

const FETCH_INTERVAL = 15 * 1000; // Fetch every 15 seconds

interface IConversationsProps {
  nextPage: () => void;
}

/**
 * Renders the list of chats in the "My service requests" tab
 *
 * @author Timothy Choy <32019738+TimChoy@users.noreply.github.com>
 * @date 03/14/2023
 * @param {IConversationProps} props - Routing props for mobile
 * @returns A react component for the list of chats
 */
const Conversations = (props: IConversationsProps) => {
  const { nextPage } = props;
  const userType = useSelector(AuthSelectors.getUserType);
  const dispatch = useDispatch();

  const filterValue =
    userType === UserType.CUSTOMER ? "shop.name" : "service.name";

  const [quotesUpdate, setQuotesUpdate] = useState(0);
  const [quotes, setQuotes] = useState<IQuote[]>([]);

  useEffect(() => {
    async function getQuotes() {
      if (userType === UserType.CUSTOMER) {
        dispatch(getCustomerQuotes());
      } else if (userType !== null) {
        dispatch(getShopQuotes());
      }
    }
    getQuotes();
    setInterval(getQuotes, FETCH_INTERVAL);
  }, [dispatch, userType]);

  const selectedChat = useSelector(QuoteSelectors.getActiveChat);
  const quoteObj = useSelector(QuoteSelectors.getQuotes);

  useEffect(() => {
    if (Object.keys(quoteObj).length > 0) {
      const quotesList = Object.values({ ...quoteObj });
      setQuotes(quotesList);
      setQuotesUpdate((quotesUpdate + 1) % 2);
    }
  }, [quoteObj, setQuotes]);

  /**
   * Sets the selected chat using redux
   *
   * @author Timothy Choy <32019738+TimChoy@users.noreply.github.com>
   * @date 02/13/2023
   * @param {string} chatId - Chat ID
   */
  const setChat = (chatId: string) => {
    dispatch(setSelectedChat({ id: chatId }));

    // For mobile
    nextPage();
  };

  /**
   * Renders the address of the shop, if the user is a customer
   *
   * @author Timothy Choy <32019738+TimChoy@users.noreply.github.com>
   * @date 02/13/2023
   * @param {IQuote} option - A quote object
   * @param {boolean} isCustomer - Flag if user is a customer
   * @returns A react component of the shop's address
   */
  const renderAddress = (option: IQuote, isCustomer: boolean) => {
    if (isCustomer) {
      return (
        <div>
          {option.shop.address} <br />
        </div>
      );
    }
  };

  /**
   * Renders a chat object, containing the information of the chat
   * Information includes the chat name (either shop name or customer name)
   * The service being provided and the chat update time
   *
   * @author Timothy Choy <32019738+TimChoy@users.noreply.github.com>
   * @date 02/13/2023
   * @param {IQuote} option - A quote object
   * @returns A react component containing the chat details
   */
  const chatItem = (option: IQuote) => {
    const isCustomer = userType === UserType.CUSTOMER;

    return (
      <div className={styles.chatItem}>
        <Image
          src={image}
          alt={option.shop.name}
          height={image.height * 0.3}
          width={image.width * 0.3}
        />
        <div className={styles.chatText}>
          <h4 className={styles.h4}>
            {isCustomer
              ? option.shop.name
              : `${option.customer.firstName} ${option.customer.lastName}`}
          </h4>
          <h4 className={classnames(styles.h4, styles.service)}>
            {option.service.name}
          </h4>
          {renderAddress(option, isCustomer)}
          {"Updated " + new Date(option.updateTime).toLocaleString("en-US")}
        </div>
      </div>
    );
  };

  return (
    <div>
      <ListBox
        filter
        className={styles.listBox}
        value={selectedChat}
        options={quotes}
        onChange={(e: ListBoxChangeParams) => setChat(e.value.id)}
        filterBy={filterValue}
        itemTemplate={chatItem}
        listStyle={{ maxHeight: "35rem" }}
      />
    </div>
  );
};

export default Conversations;
