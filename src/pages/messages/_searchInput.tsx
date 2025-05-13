import { Search } from 'lucide-react';
import { ChangeEvent, useState } from 'react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchInput = ({ onSearch, placeholder = 'Search' }: SearchInputProps) => {
  const [focused, setFocused] = useState(false);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center w-full">
        <button 
          className="absolute left-3 flex items-center justify-center text-deepskyblue"
          type="button"
          aria-label="Search"
        >
          <Search size={18} />
        </button>
        <input
          type="text"
          placeholder={placeholder}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full border bg-white rounded-full py-2.5 pl-10 pr-4 focus:outline-none text-sm transition-all duration-200 ${
            focused 
              ? 'border-deepskyblue ring-2 ring-blue-100' 
              : 'border-gray-200 hover:border-blue-300'
          }`}
          aria-label="Search conversations"
        />
      </div>
    </div>
  );
};

export default SearchInput;