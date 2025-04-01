import { Link } from "react-router-dom";
export const Card = ({ connection, children }) => {
  return (
    <div className="card bg-base-200 shadow-md rounded-lg p-4 gap-1 px-10 flex flex-col items-center text-center">
      <Link to={`/profile/${connection._id}`}>
        <img
          src={connection.profilePicture}
          alt={connection.username}
          className="object-contain rounded-full data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100/10"
          data-loaded="false"
          onLoad={(event) => {
            event.currentTarget.setAttribute("data-loaded", "true");
          }}
        />
      </Link>
      <h3 className="text-lg font-semibold">{connection.username}</h3>
      <div className="flex gap-6 items-center justify-center sm:gap-3">
        {children}
      </div>
    </div>
  );
};
