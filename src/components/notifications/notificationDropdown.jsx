import Link from 'next/link';
import useNotification from "@/store/useNotification";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const NotificationDropdown = ({ notificationsOpen, setNotificationsOpen }) => {
  
  const { notifications } = useNotification();
  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className={`absolute top-15 right-0 w-68.75 p-7.5 bg-white border border-skyblue rounded shadow-lg z-10 ${notificationsOpen ? 'block' : 'hidden'}`}>
      <div className="max-h-60 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex items-start flex-col gap-7.5">
        {recentNotifications.map((notification) => (
          <div key={notification._id} className="border-b border-skyblue/10 hover:bg-skyblue/10 cursor-pointer flex items-center gap-2">
            <div className="flex-1">
              <p className="text-xs text-deepskyblue font-bold">{notification.title}</p>
              <p className="text-xs text-gray-500">{notification.message}</p>
              <p className="text-[10px] text-gray-400 mt-1">
                {dayjs(notification.createdAt).fromNow()}
              </p>
            </div>
          </div>
        ))}
        {recentNotifications.length === 0 && (
          <div className="text-sm text-gray-500 py-2">No new notifications</div>
        )}
      </div>
      <div className='pt-5 mt-7.5 border-t border-t-deepskyblue text-center'>
        <Link onClick={() => setNotificationsOpen(false)} href="/notifications" className="text-sm text-boldblue font-bold hover:bg-skyblue/10 cursor-pointer">
          See All Notifications
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;