import { useFriendsStore } from "../store/useFriendsStore";
export const TabPanel = ({ label, children }) => {
  const requests = useFriendsStore((state) => state.requests);
  const ariaLabel =
    label === "Requests" ? `${label} (${requests.length})` : label;
  return (
    <>
      <input
        type="radio"
        name="tab"
        role="tab"
        className="tab text-lg font-semibold whitespace-nowrap"
        aria-label={ariaLabel}
        defaultChecked={label === "Friends"}
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-2"
      >
        {children}
      </div>
    </>
  );
};
