import { useState, useRef} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IoMdCalendar } from 'react-icons/io';

interface MilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {description: string; price: number; dueDate: Date | null}) => void;
  paymentType: string;
  defaultPrice: number;
}

const AddMilestoneModal = ({ isOpen, onClose, onSubmit, defaultPrice }: MilestoneModalProps) => {
    const [task, setTask] = useState('');
    const [price, setPrice] = useState<number | string>(defaultPrice);
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const datePickerRef = useRef(null);
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    
    // Only render if modal is open
    if (!isOpen) return null;
    
    const handleSubmit = () => {
      onSubmit({
        description: description || task, // Use description if provided, otherwise use task
        price: parseFloat(price as string) || defaultPrice,
        dueDate: dueDate
      });
      // Reset form
      setTask('');
      setPrice(defaultPrice);
      setDescription('');
      setDueDate(null);
    };
    
    const handleCancel = () => {
      // Reset form
      setTask('');
      setPrice(defaultPrice);
      setDescription('');
      setDueDate(null);
      onClose();
    };

  return (
    <section className='bg-[rgba(0,0,0,0.7)] fixed top-0 left-0 w-full h-screen z-50 p-6 flex items-center justify-center'>
        <section className='w-full max-w-133.75 rounded-[5px] bg-white p-7.5 flex flex-col items-start gap-7.5'>
            <h3 className='font-semibold text-xl'>New Milestone</h3>
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
            <div className='w-full flex items-center justify-center gap-2.5 text-sm'>
                <button
                    onClick={handleCancel}
                    className="cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-3 px-5 text-boldblue text-sm font-semibold rounded-lg border border-boldblue"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    className="cursor-pointer transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out py-3 px-5 bg-boldblue text-white text-sm font-semibold rounded-lg border border-boldblue"
                >
                    Submit
                </button>
            </div>
        </section>
    </section>
  )
}

export default AddMilestoneModal;