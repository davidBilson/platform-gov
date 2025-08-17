import { FaUser } from "react-icons/fa";

interface ProfilePictureProps {
  source: string;
  alt: string;
  dimension?: number | string;
}

const ProfilePicture = ({ source, alt, dimension = 88 }: ProfilePictureProps) => {



  return (
    <div 
      className={`overflow-hidden ${source=="" ? 'bg-boldblue' : 'bg-gray-300'}  border border-boldblue rounded-full flex items-center justify-center mx-auto sm:mx-0`}
      style={{ width: `${dimension}px`, height: `${dimension}px` }}
    >
      {
        source === "" || source === undefined || source.startsWith('blob') ?
        <FaUser size={32} className="text-white" />
        :
        <img 
          className={`h-${dimension ? `[${dimension}px]` : '22'} w-${dimension ? `[${dimension}px]` : '22'} overflow-hidden rounded-full object-cover flex items-center justify-center`}
          src={source} 
          alt={alt}
          style={{ width: `${dimension}px`, height: `${dimension}px` }}
          width={dimension}
          height={dimension}
        />
      }
    </div>
  )
};

export default ProfilePicture;