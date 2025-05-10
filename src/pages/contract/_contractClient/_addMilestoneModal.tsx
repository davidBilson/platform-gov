import { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IoMdCalendar } from 'react-icons/io';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { addMilestone } from '@/api/milestone-api';
import useAuthStore from '@/store/useAuth';

interface ModalProps {
  contractId: string;
  onClose: () => void;
  onMilestoneAdded: () => void;
}

const AddNewMilestoneModal = ({ contractId, onClose, onMilestoneAdded }: ModalProps) => {
  const [task, setTask] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const datePickerRef = useRef(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const { userId } = useAuthStore();

  useEffect(() => {
    console.log(contractId)
  }, [])

  const handleSubmit = async () => {
    if (!task.trim()) {
      toast.error('Please enter a task name');
      return;
    }

    if (!price) {
      toast.error('Please enter an amount');
      return;
    }

    if (!dueDate) {
      toast.error('Please select a due date');
      return;
    }

    setIsSubmitting(true);

    try {
      const amount = typeof price === 'string' ? parseFloat(price) : price;
      const formattedDueDate = dueDate ? format(dueDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : null;

      await addMilestone(contractId, {
        name: task.trim(),
        description: description.trim(),
        dueDate: new Date(formattedDueDate as string),
        amount
      }, userId);

      toast.success('Milestone added successfully!');
      onMilestoneAdded(); // Trigger the refetch in parent
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error adding milestone:', error);
      toast.error('Failed to add milestone');
    } finally {
      setIsSubmitting(false);
    }
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
        <button type="button" className="focus:outline-none">$</button>
        <input 
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="outline-none placeholder:font-semibold w-full max-w-[85%]" 
          placeholder="0.00"
          min="0"
          step="0.01"
        />
        <span className="focus:outline-none">Amount</span>
      </div>
      
      <textarea
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
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
          minDate={new Date()}
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
        <button 
          className='transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out cursor-pointer bg-white border border-boldblue rounded-lg px-5 py-2.75 text-sm text-boldblue font-semibold' 
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button 
          className='transition transform active:scale-95 hover:opacity-70 duration-300 ease-in-out cursor-pointer bg-boldblue border border-boldblue rounded-lg px-5 py-2.75 text-sm text-white font-semibold' 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </section>
  );
};

export default AddNewMilestoneModal;