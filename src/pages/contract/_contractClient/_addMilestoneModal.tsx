import { useState, useRef} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IoMdCalendar } from 'react-icons/io';


interface ModalProps {
    onClose: () => void;
}

const AddNewMilestoneModal = ({ onClose }: ModalProps) => {

    const [task, setTask] = useState('');
    const [price, setPrice] = useState<number | string>(0);
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const datePickerRef = useRef(null);
    const [datePickerOpen, setDatePickerOpen] = useState(false);

    const handleSubmit = () => {
        setTask('');
        setPrice(0);
        onClose();
        setDescription('');
        setDueDate(null);
      };

  return (
    <section className='bg-white rounded-lg p-7.5 w-full max-w-108.5 flex flex-col items-start gap-7.5'>
        <h2 className='font-semibold text-xl'>Propose New Milestone</h2>
        <div className="w-full flex justify-between border border-boldblue rounded-lg px-5 py-4 text-sm text-boldblue">
                <input 
                    placeholder='Task'
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    className="outline-none placeholder:font-semibold w-full max-w-[85%]" 
                />
            </div>
        <div className="w-full flex justify-between border border-boldblue rounded-lg px-5 py-4 text-sm text-boldblue">
            <button 
            type="button" 
            className="focus:outline-none"
            >
                $
            </button>
            <input 
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="outline-none placeholder:font-semibold w-full max-w-[85%]" 
            />
            <span 
                className="focus:outline-none"
            >
                Amount
            </span>
        </div>
        <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className='w-full py-3.5 px-5 text-boldblue resize-none border border-boldblue focus:outline focus:outline-boldblue rounded-md min-h-[111px]'
        />
        <div className="w-full flex items-center justify-between border border-boldblue rounded-lg px-5 py-4 text-sm text-boldblue">
                <DatePicker
                    selected={dueDate}
                    onChange={(date) => setDueDate(date)}
                    placeholderText="Due Date"
                    dateFormat="yyyy-MM-dd"
                    className="outline-none w-full placeholder:font-semibold bg-transparent"
                    ref={datePickerRef}
                    open={datePickerOpen}
                    onCalendarOpen={() => setDatePickerOpen(true)}
                    onCalendarClose={() => setDatePickerOpen(false)}
                />
                <button
                    type="button"
                    onClick={() => setDatePickerOpen(!datePickerOpen)}
                    className="-ml-6 text-boldblue focus:outline-none"
                    >
                    <IoMdCalendar size={20} />
                </button>
            </div>
        
        <div className='flex items-center justify-center gap-2.5 w-full'>
            <button className='transition transform active:scale-95 hover:opacity-70  duration-300 ease-in-out cursor-pointer
bg-white border border-boldblue rounded-lg px-5 py-2.75 text-sm text-boldblue font-semibold' onClick={onClose}>Cancel</button>
            <button className='transition transform active:scale-95 hover:opacity-70  duration-300 ease-in-out cursor-pointer
bg-boldblue border border-boldblue rounded-lg px-5 py-2.75 text-sm text-white font-semibold' onClick={handleSubmit}>Submit</button>
        </div>
    </section>
  )
}

export default AddNewMilestoneModal