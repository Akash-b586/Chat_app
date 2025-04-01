// Remove single and double quotes from the message
const formatMessage = (message) => message.replace(/['"]+/g, "");

export const ErrorMessage = ({ message }) => {
  return <p className="text-error text-sm px-2 ">{formatMessage(message)}</p>;
};
