import React, { useState, useCallback, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isAfter, isBefore, isToday } from 'date-fns';

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  placeholder?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  minDate = new Date(),
  maxDate,
  className = '',
  placeholder = 'Select travel dates'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Date | null>(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.date-range-picker')) {
        setIsOpen(false);
        setIsDragging(false);
        setDragStart(null);
        setHoverDate(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDateRange = useCallback(() => {
    if (!value.startDate && !value.endDate) {
      return placeholder;
    }
    if (value.startDate && !value.endDate) {
      return format(value.startDate, 'MMM dd, yyyy');
    }
    if (value.startDate && value.endDate) {
      if (isSameDay(value.startDate, value.endDate)) {
        return format(value.startDate, 'MMM dd, yyyy');
      }
      return `${format(value.startDate, 'MMM dd')} - ${format(value.endDate, 'MMM dd, yyyy')}`;
    }
    return placeholder;
  }, [value, placeholder]);

  const handleDateClick = useCallback((date: Date) => {
    if (isDateDisabled(date)) return;

    if (!value.startDate || (value.startDate && value.endDate)) {
      // Start new selection
      onChange({ startDate: date, endDate: null });
    } else if (value.startDate && !value.endDate) {
      // Complete selection
      if (isBefore(date, value.startDate)) {
        onChange({ startDate: date, endDate: value.startDate });
      } else {
        onChange({ startDate: value.startDate, endDate: date });
      }
    }
  }, [value, onChange]);

  const handleMouseDown = useCallback((date: Date) => {
    if (isDateDisabled(date)) return;
    
    setIsDragging(true);
    setDragStart(date);
    onChange({ startDate: date, endDate: null });
  }, [onChange]);

  const handleMouseEnter = useCallback((date: Date) => {
    setHoverDate(date);
    
    if (isDragging && dragStart) {
      if (isBefore(date, dragStart)) {
        onChange({ startDate: date, endDate: dragStart });
      } else {
        onChange({ startDate: dragStart, endDate: date });
      }
    }
  }, [isDragging, dragStart, onChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  const isDateDisabled = useCallback((date: Date) => {
    if (isBefore(date, minDate)) return true;
    if (maxDate && isAfter(date, maxDate)) return true;
    return false;
  }, [minDate, maxDate]);

  const isDateInRange = useCallback((date: Date) => {
    if (!value.startDate) return false;
    if (!value.endDate) return isSameDay(date, value.startDate);
    
    return (
      (isAfter(date, value.startDate) || isSameDay(date, value.startDate)) &&
      (isBefore(date, value.endDate) || isSameDay(date, value.endDate))
    );
  }, [value]);

  const isDateRangeStart = useCallback((date: Date) => {
    return value.startDate && isSameDay(date, value.startDate);
  }, [value.startDate]);

  const isDateRangeEnd = useCallback((date: Date) => {
    return value.endDate && isSameDay(date, value.endDate);
  }, [value.endDate]);

  const isDateHovered = useCallback((date: Date) => {
    if (!hoverDate || !value.startDate || value.endDate) return false;
    
    const start = value.startDate;
    const end = hoverDate;
    
    if (isBefore(end, start)) {
      return (isAfter(date, end) || isSameDay(date, end)) && 
             (isBefore(date, start) || isSameDay(date, start));
    } else {
      return (isAfter(date, start) || isSameDay(date, start)) && 
             (isBefore(date, end) || isSameDay(date, end));
    }
  }, [hoverDate, value]);

  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    setCurrentMonth(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  }, []);

  const getDaysInMonth = useCallback(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const getCalendarDays = useCallback(() => {
    const daysInMonth = getDaysInMonth();
    const firstDay = daysInMonth[0];
    const startDay = firstDay.getDay(); // 0 = Sunday
    
    // Add empty cells for days before the first day of the month
    const emptyCells = Array(startDay).fill(null);
    
    return [...emptyCells, ...daysInMonth];
  }, [getDaysInMonth]);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`date-range-picker relative ${className}`}>
      {/* Input Display */}
      <div
        className="flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 glass-card-input"
        onClick={() => setIsOpen(!isOpen)}
        style={{ height: "45px", paddingLeft: "20px" }}
      >
        <Calendar size={16} className="text-white/60 mr-2" />
        <span className={`flex-1 text-sm ${!value.startDate ? 'text-white/60' : 'text-white'}`}>
          {formatDateRange()}
        </span>
      </div>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="react-calendar absolute top-full left-0 mt-2 rounded-lg shadow-lg z-50 p-4 min-w-[320px]" 
             style={{
               background: 'rgba(255, 255, 255, 0.1)',
               backdropFilter: 'blur(20px)',
               WebkitBackdropFilter: 'blur(20px)',
               border: '1px solid rgba(255, 255, 255, 0.2)'
             }}>
          {/* Month Navigation */}
          <div className="react-calendar__navigation flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => navigateMonth('prev')}
              className="react-calendar__navigation__prev-button p-1 rounded"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="react-calendar__navigation__label font-medium text-sm text-white">
              {format(currentMonth, 'MMMM yyyy')}
            </div>
            <button
              type="button"
              onClick={() => navigateMonth('next')}
              className="react-calendar__navigation__next-button p-1 rounded"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Week Days Header */}
          <div className="react-calendar__month-view__weekdays grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="react-calendar__month-view__weekdays__weekday text-center text-xs font-medium py-1">
                {day.substring(0, 2)}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div 
            className="grid grid-cols-7 gap-1"
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
              setHoverDate(null);
              if (isDragging) {
                setIsDragging(false);
                setDragStart(null);
              }
            }}
          >
            {getCalendarDays().map((date, index) => {
              if (!date) {
                return <div key={index} className="h-8" />;
              }

              const disabled = isDateDisabled(date);
              const inRange = isDateInRange(date);
              const isStart = isDateRangeStart(date);
              const isEnd = isDateRangeEnd(date);
              const hovered = isDateHovered(date);
              const today = isToday(date);
              const currentMonthDate = isSameMonth(date, currentMonth);

              let buttonClass = "react-calendar__tile h-8 w-8 text-xs rounded transition-all relative flex items-center justify-center";
              
              if (!currentMonthDate) {
                buttonClass += " text-white/30";
              } else if (disabled) {
                buttonClass += " text-white/30 cursor-not-allowed";
              } else if (isStart || isEnd) {
                buttonClass += " react-calendar__tile--active";
              } else if (today && !inRange) {
                buttonClass += " react-calendar__tile--now";
              } else if (inRange) {
                buttonClass += " react-calendar__tile--hasActive";
              } else {
                buttonClass += " cursor-pointer";
              }

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  disabled={disabled}
                  className={buttonClass}
                  onClick={() => handleDateClick(date)}
                  onMouseDown={() => handleMouseDown(date)}
                  onMouseEnter={() => handleMouseEnter(date)}
                >
                  {format(date, 'd')}
                  
                  {/* Range connector */}
                  {inRange && !isStart && !isEnd && (
                    <div className="absolute inset-y-0 left-0 right-0 bg-blue-500/30 -z-10 rounded" />
                  )}
                  {hovered && !inRange && (
                    <div className="absolute inset-y-0 left-0 right-0 bg-white/10 -z-10 rounded" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  const tomorrow = new Date(today);
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  onChange({ startDate: today, endDate: tomorrow });
                }}
                className="px-3 py-1 text-xs text-white rounded transition-colors"
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  const nextWeek = new Date(today);
                  nextWeek.setDate(nextWeek.getDate() + 7);
                  onChange({ startDate: today, endDate: nextWeek });
                }}
                className="px-3 py-1 text-xs text-white rounded transition-colors"
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              >
                Next 7 days
              </button>
            </div>
            
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => {
                  onChange({ startDate: null, endDate: null });
                  setIsOpen(false);
                }}
                className="px-3 py-1 text-xs text-white/60 hover:text-white/80 transition-colors"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 text-xs text-white rounded transition-colors"
                style={{ background: '#3b82f6' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
