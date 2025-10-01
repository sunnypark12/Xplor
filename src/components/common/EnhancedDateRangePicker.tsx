import React, { useState, useCallback, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isAfter, isBefore, isToday, getDay } from 'date-fns';

// Enhanced types inspired by the article
type DayNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31;
type MonthIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

interface Day {
  key: string;
  day: DayNum;
  isCurrMonth: boolean;
  date: Date;
}

interface Week {
  key: string;
  dayArray: Day[];
}

interface Month {
  key: string;
  monthIndex: MonthIndex;
  monthMatrix: Week[];
}

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface EnhancedDateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  placeholder?: string;
}

// Helper functions inspired by the article
const buildSequenceArray = (start: number, end?: number): number[] => {
  if (!end) {
    end = start;
    start = 0;
  }
  return Array.from({length: ++end - start}, (_, i) => i + start);
};

const daysInMonth = (monthIndex: number, year: number): number => 
  new Date(year, ++monthIndex, 0).getDate();

const getWeekDayIndex = (year: number, monthIndex: number, day: number) => 
  new Date(year, monthIndex, day).getDay();

const getMonthArray = (year: number, monthIndex: number) => {
  const totalDays = daysInMonth(year, monthIndex);
  return {
    monthIndex,
    monthArray: buildSequenceArray(1, totalDays),
  };
};

const getMonthMatrix = (year: number, month: { monthIndex: number; monthArray: number[] }): Month => {
  // Setup
  const buildWeekKey = (weekIndex: number) => `${year}-${month.monthIndex}-week-${weekIndex}`;
  
  const monthMatrix: Week[] = [
    {key: buildWeekKey(0), dayArray: []},
    {key: buildWeekKey(1), dayArray: []},
    {key: buildWeekKey(2), dayArray: []},
    {key: buildWeekKey(3), dayArray: []},
    {key: buildWeekKey(4), dayArray: []},
    {key: buildWeekKey(5), dayArray: []},
  ];

  let weekIndex = 0;

  // Populate month matrix
  month.monthArray.forEach(day => {
    const weekDayIndex = getWeekDayIndex(year, month.monthIndex, day as DayNum);
    const date = new Date(year, month.monthIndex, day);
    const key = `${year}-${month.monthIndex}-${day}`;
    
    monthMatrix[weekIndex]?.dayArray.push({
      key, 
      day: day as DayNum, 
      isCurrMonth: true, 
      date
    });

    if (weekDayIndex === 6) ++weekIndex;
  });

  // Fill starting week with previous month days
  const isFirstWeekIncomplete = monthMatrix[0]!.dayArray.length < 7;
  if (isFirstWeekIncomplete) {
    const extraDays = 7 - monthMatrix[0]!.dayArray.length;
    for (let i = 0; i < extraDays; i++) {
      const date = new Date(year, month.monthIndex, -i);
      const day = date.getDate();
      const key = `${year}-${month.monthIndex}-${day}-prev`;
      
      monthMatrix[0]!.dayArray.unshift({
        key, 
        day: day as DayNum, 
        isCurrMonth: false, 
        date
      });
    }
  }

  // Fill ending weeks with next month days
  const beforeLastWeekIncomplete = monthMatrix[4]!.dayArray.length < 7;
  let prevDaysCount = 0;

  if (beforeLastWeekIncomplete) {
    const extraDays = 7 - monthMatrix[4]!.dayArray.length;
    prevDaysCount = extraDays;

    for (let i = 0; i < extraDays; i++) {
      const date = new Date(year, month.monthIndex + 1, i + 1);
      const day = date.getDate();
      const key = `${year}-${month.monthIndex}-${day}-next`;
      
      monthMatrix[4]!.dayArray.push({
        key, 
        day: day as DayNum, 
        isCurrMonth: false, 
        date
      });
    }
  }

  const lastWeekIncomplete = monthMatrix[5]!.dayArray.length < 7;
  if (lastWeekIncomplete) {
    const extraDays = 7 - monthMatrix[5]!.dayArray.length;

    for (let i = 0; i < extraDays; i++) {
      const date = new Date(year, month.monthIndex + 1, i + 1 + prevDaysCount);
      const day = date.getDate();
      const key = `${year}-${month.monthIndex}-${day}-next`;
      
      monthMatrix[5]!.dayArray.push({
        key, 
        day: day as DayNum, 
        isCurrMonth: false, 
        date
      });
    }
  }

  const key = `${year}-${month.monthIndex}`;
  return {key: key, monthIndex: month.monthIndex as MonthIndex, monthMatrix: monthMatrix};
};

// Day Component
const DayComponent: React.FC<{
  day: Day;
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isHovered: boolean;
  isDisabled: boolean;
  onClick: (date: Date) => void;
  onMouseDown: (date: Date) => void;
  onMouseEnter: (date: Date) => void;
}> = ({ day, isInRange, isRangeStart, isRangeEnd, isHovered, isDisabled, onClick, onMouseDown, onMouseEnter }) => {
  const today = new Date();
  const isToday = isSameDay(day.date, today);

  let buttonClass = "react-calendar__tile h-8 w-8 text-xs rounded transition-all relative flex items-center justify-center";
  
  if (!day.isCurrMonth) {
    buttonClass += " text-white/30";
  } else if (isDisabled) {
    buttonClass += " text-white/30 cursor-not-allowed";
  } else if (isRangeStart || isRangeEnd) {
    buttonClass += " react-calendar__tile--active";
  } else if (isToday && !isInRange) {
    buttonClass += " react-calendar__tile--now";
  } else if (isInRange) {
    buttonClass += " react-calendar__tile--hasActive";
  } else {
    buttonClass += " cursor-pointer";
  }

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={buttonClass}
      onClick={() => onClick(day.date)}
      onMouseDown={() => onMouseDown(day.date)}
      onMouseEnter={() => onMouseEnter(day.date)}
    >
      {day.day}
      
      {/* Range connector */}
      {isInRange && !isRangeStart && !isRangeEnd && (
        <div className="absolute inset-y-0 left-0 right-0 bg-blue-500/30 -z-10 rounded" />
      )}
      {isHovered && !isInRange && (
        <div className="absolute inset-y-0 left-0 right-0 bg-white/10 -z-10 rounded" />
      )}
    </button>
  );
};

// Week Component
const WeekComponent: React.FC<{
  week: Week;
  value: DateRange;
  hoverDate: Date | null;
  isDragging: boolean;
  dragStart: Date | null;
  minDate: Date;
  maxDate?: Date;
  onDateClick: (date: Date) => void;
  onMouseDown: (date: Date) => void;
  onMouseEnter: (date: Date) => void;
}> = ({ week, value, hoverDate, isDragging, dragStart, minDate, maxDate, onDateClick, onMouseDown, onMouseEnter }) => {
  const isDateDisabled = (date: Date) => {
    if (isBefore(date, minDate)) return true;
    if (maxDate && isAfter(date, maxDate)) return true;
    return false;
  };

  const isDateInRange = (date: Date) => {
    if (!value.startDate) return false;
    if (!value.endDate) return isSameDay(date, value.startDate);
    
    return (
      (isAfter(date, value.startDate) || isSameDay(date, value.startDate)) &&
      (isBefore(date, value.endDate) || isSameDay(date, value.endDate))
    );
  };

  const isDateRangeStart = (date: Date): boolean => {
    return Boolean(value.startDate && isSameDay(date, value.startDate));
  };

  const isDateRangeEnd = (date: Date): boolean => {
    return Boolean(value.endDate && isSameDay(date, value.endDate));
  };

  const isDateHovered = (date: Date) => {
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
  };

  return (
    <div className="grid grid-cols-7 gap-1">
      {week.dayArray.map((day) => (
        <DayComponent
          key={day.key}
          day={day}
          isInRange={isDateInRange(day.date)}
          isRangeStart={isDateRangeStart(day.date)}
          isRangeEnd={isDateRangeEnd(day.date)}
          isHovered={isDateHovered(day.date)}
          isDisabled={isDateDisabled(day.date)}
          onClick={onDateClick}
          onMouseDown={onMouseDown}
          onMouseEnter={onMouseEnter}
        />
      ))}
    </div>
  );
};

const EnhancedDateRangePicker: React.FC<EnhancedDateRangePickerProps> = ({
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
    if (isBefore(date, minDate)) return;
    if (maxDate && isAfter(date, maxDate)) return;

    if (!value.startDate || (value.startDate && value.endDate)) {
      onChange({ startDate: date, endDate: null });
    } else if (value.startDate && !value.endDate) {
      if (isBefore(date, value.startDate)) {
        onChange({ startDate: date, endDate: value.startDate });
      } else {
        onChange({ startDate: value.startDate, endDate: date });
      }
    }
  }, [value, onChange, minDate, maxDate]);

  const handleMouseDown = useCallback((date: Date) => {
    if (isBefore(date, minDate)) return;
    if (maxDate && isAfter(date, maxDate)) return;
    
    setIsDragging(true);
    setDragStart(date);
    onChange({ startDate: date, endDate: null });
  }, [onChange, minDate, maxDate]);

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

  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    setCurrentMonth(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  }, []);

  // Generate month matrix using the article's approach
  const monthData = getMonthArray(currentMonth.getFullYear(), currentMonth.getMonth());
  const monthMatrix = getMonthMatrix(currentMonth.getFullYear(), monthData);

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
            className="space-y-1"
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
              setHoverDate(null);
              if (isDragging) {
                setIsDragging(false);
                setDragStart(null);
              }
            }}
          >
            {monthMatrix.monthMatrix.map((week) => (
              <WeekComponent
                key={week.key}
                week={week}
                value={value}
                hoverDate={hoverDate}
                isDragging={isDragging}
                dragStart={dragStart}
                minDate={minDate}
                maxDate={maxDate}
                onDateClick={handleDateClick}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
              />
            ))}
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

export default EnhancedDateRangePicker;
