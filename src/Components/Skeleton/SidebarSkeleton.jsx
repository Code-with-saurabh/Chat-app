import Skeleton from "../Skeleton/Skeleton";
import "./SidebarSkeleton.css";

export default function SidebarSkeleton() {
  const users = Array.from({ length: 7 });

  return (
    <div className="Sidebar sidebarSkeleton">
      
      {/* Navbar */}
      <div className="navSkeleton">
        <Skeleton className="logoSk" />
        <Skeleton className="profileSk" />
      </div>

      {/* Search */}
      <div className="searchWrapperSk">
        <Skeleton className="searchSk" />
      </div>

      {/* Chat users */}
      <div className="userListSk">
        {users.map((_, i) => (
          <div className="chatUserSk" key={i}>
            <Skeleton className="avatarSk" />
            <div className="textSk">
              <Skeleton className="nameSk" />
              <Skeleton className="msgSk" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}