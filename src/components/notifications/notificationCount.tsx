import { useNotification } from "@/store/useNotificationStore";

const NotificationCount = () => {

  const { count } = useNotification();

  return (
    <span className="absolute -top-1 -right-2 text-red-500 font-extrabold text-sm rounded-full h-5 w-5 flex items-center justify-center">
      {count > 9 ? '9+' : count}
    </span>
  );
};

export default NotificationCount;