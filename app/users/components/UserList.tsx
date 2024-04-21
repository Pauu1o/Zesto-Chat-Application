"use client";

import { User } from "@prisma/client";
import UserBox from "./UserBox";

interface UserListProps {
  items: User[];
}
const UserList: React.FC<UserListProps> = ({ items }) => {
  return (
    <aside className="fixed inset-y-0 pb-20 lg:pb-20 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-neutral-700 bg-neutral-900  block w-full left-0">
      <div className="px-1">
        <div className="flex-col">
          <div className="text-2xl font-bold text-white py-4">People</div>
        </div>
        {items.map((item) => (
          <UserBox key={item.id} data={item} />
        ))}
      </div>
    </aside>
  );
};
export default UserList;
