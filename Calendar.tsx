import React, { useState, useEffect } from 'react';


interface Post {
    date: string;
    title: string;
    platform: string;
}

const posts: Post[] = [
    { date: '2024-06-11', title: 'LinkedIn Post 1', platform: 'LinkedIn' },
    { date: '2024-06-19', title: 'Instagram Post 2', platform: 'Instagram' },
    { date: '2024-06-23', title: 'Instagram Post 3', platform: 'Twitter' }
];

const App: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isYearView, setIsYearView] = useState(false);
    const [monthsToShow, setMonthsToShow] = useState(1);
    const [popupContent, setPopupContent] = useState<Post[]>([]);
    const [popupVisible, setPopupVisible] = useState(false);

    useEffect(() => {
        renderCalendar();
    }, [selectedDate, isYearView, monthsToShow]);

    const renderCalendar = () => {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();

        const startDate = new Date(year, month);
        const endDate = new Date(year, month + monthsToShow - 1);

        const startMonthYear = startDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        const endMonthYear = endDate.toLocaleString('default', { month: 'long', year: 'numeric' });

        const monthYearDisplay = document.getElementById('monthYearDisplay') as HTMLSpanElement;
        monthYearDisplay.textContent = `${startMonthYear} - ${endMonthYear}`;

        const calendarGrid = document.getElementById('calendarGrid') as HTMLDivElement;
        const yearGrid = document.getElementById('yearGrid') as HTMLDivElement;
        const daysHeader = document.getElementById('daysHeader') as HTMLDivElement;

        calendarGrid.innerHTML = '';
        yearGrid.innerHTML = '';
        daysHeader.style.display = isYearView ? 'none' : 'grid';
        calendarGrid.style.display = isYearView ? 'none' : 'grid';
        yearGrid.style.display = isYearView ? 'grid' : 'none';

        if (isYearView) {
            renderYearView(year);
        } else {
            renderMultiMonthView(year, month);
        }
    };

    const renderMultiMonthView = (year: number, startMonth: number) => {
        const firstDayOfFirstMonth = new Date(year, startMonth, 1);
        const firstDayIndex = firstDayOfFirstMonth.getDay();
        const totalDays: Date[] = [];

        for (let month = startMonth; month < startMonth + monthsToShow; month++) {
            const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
            for (let day = 1; day <= lastDayOfMonth; day++) {
                totalDays.push(new Date(year, month, day));
            }
        }

        const rows = Math.ceil((firstDayIndex + totalDays.length) / 7) * 7;
        const calendarGrid = document.getElementById('calendarGrid') as HTMLDivElement;

        for (let i = 0; i < rows; i++) {
            if (i < firstDayIndex) {
                calendarGrid.appendChild(document.createElement('div'));
            } else {
                const date = totalDays[i - firstDayIndex];
                const dateCell = createDateCell(date);
                calendarGrid.appendChild(dateCell);
            }
        }
    };

    const renderYearView = (year: number) => {
        const yearGrid = document.getElementById('yearGrid') as HTMLDivElement;

        for (let month = 0; month < 12; month++) {
            const monthCard = document.createElement('div');
            monthCard.classList.add('month-card');
            monthCard.innerHTML = `<h3>${new Date(year, month).toLocaleString('default', { month: 'long' })}</h3>`;

            const daysHeaderClone = document.getElementById('daysHeader')?.cloneNode(true) as HTMLDivElement;
            monthCard.appendChild(daysHeaderClone);

            const calendarGridClone = document.createElement('div');
            calendarGridClone.classList.add('calendar-grid');
            monthCard.appendChild(calendarGridClone);

            const firstDayOfMonth = new Date(year, month, 1);
            const lastDayOfMonth = new Date(year, month + 1, 0);
            const firstDayIndex = firstDayOfMonth.getDay();
            const lastDayIndex = lastDayOfMonth.getDate();

            for (let i = 0; i < firstDayIndex; i++) {
                const emptyCell = document.createElement('div');
                calendarGridClone.appendChild(emptyCell);
            }

            for (let day = 1; day <= lastDayIndex; day++) {
                const date = new Date(year, month, day);
                const dateCell = createDateCell(date);
                calendarGridClone.appendChild(dateCell);
            }

            yearGrid.appendChild(monthCard);
        }
    };

    const createDateCell = (date: Date): HTMLDivElement => {
        const dateCell = document.createElement('div');
        dateCell.style.border = '1px solid #ccc';
        const day = date?.getDate();
        const monthName = date?.toLocaleString('default', { month: 'short' });
        dateCell.innerHTML = `<span class="date">${day}</span>`;

        if (day === 1 && !isYearView) {
            const monthLabel = document.createElement('span');
            monthLabel.classList.add('month-name');
            monthLabel.textContent = monthName;
            dateCell.appendChild(monthLabel);
        }

        const dateStr = `${date?.getFullYear()}-${(date?.getMonth() + 1).toString().padStart(2, '0')}-${day?.toString().padStart(2, '0')}`;
        const datePosts = posts.filter(p => p.date === dateStr);

        if (monthsToShow === 1) {
            const platforms = new Set(datePosts.map(post => post.platform));
            platforms.forEach(platform => {
                const platformName = document.createElement('div');
                platformName.classList.add('platform-name');
                platformName.textContent = platform;
                dateCell.appendChild(platformName);
            });
        } else if (monthsToShow >= 2 && monthsToShow <= 11) {
            if (datePosts.length > 0) {
                const scheduledPostsDiv = document.createElement('div');
                scheduledPostsDiv.classList.add('scheduled-posts');

                const iconImg = document.createElement('img');
                iconImg.src = 'https://icones.pro/wp-content/uploads/2021/06/icone-d-image-orange.png';
                iconImg.alt = 'Icon';

                const scheduledText = document.createElement('div');
                scheduledText.classList.add('platform-names');
                scheduledText.textContent = '+9 Posts';

                scheduledPostsDiv.appendChild(iconImg);
                scheduledPostsDiv.appendChild(scheduledText);
                dateCell.appendChild(scheduledPostsDiv);
            }
        } else if (monthsToShow === 12 && datePosts.length > 0) {
            const redDot = document.createElement('div');
            redDot.classList.add('red-dot');
            dateCell.appendChild(redDot);
        }

        dateCell.onclick = () => openPopup(dateStr);

        return dateCell;
    };

    const openPopup = (dateStr: string) => {
        setPopupVisible(true);
        setPopupContent(posts.filter(p => p.date === dateStr));
    };

    const closePopup = () => {
        setPopupVisible(false);
    };

    const navigateToPostDetails = (post: Post) => {
        alert(`Navigating to details for post: ${post.title}`);
    };

    return (
        <div className="calendar">
            <div className="calendar-header">
                <div>
                    <span id="monthYearDisplay">June 2024</span>
                </div>
                <div>
                    <button id="prevBtn" onClick={() => {
                        if (isYearView) {
                            selectedDate.setFullYear(selectedDate.getFullYear() - 1);
                        } else {
                            selectedDate.setMonth(selectedDate.getMonth() - monthsToShow);
                        }
                        renderCalendar();
                    }}>Back</button>
                    <div>
                        <select id="monthViewSelect" className="active" onChange={(e) => {
                            const months = parseInt(e.target.value);
                            setMonthsToShow(months);
                            setIsYearView(months === 12);
                        }}>
                            <option value="1" selected>Today</option>
                            <option value="1">1 Month</option>
                            <option value="2">2 Months</option>
                            <option value="3">3 Months</option>
                            <option value="4">4 Months</option>
                            <option value="5">5 Months</option>
                            <option value="6">6 Months</option>
                            <option value="7">7 Months</option>
                            <option value="8">8 Months</option>
                            <option value="9">9 Months</option>
                            <option value="10">10 Months</option>
                            <option value="11">11 Months</option>
                            <option value="12">1 Year</option>
                        </select>
                    </div>
                    <button id="nextBtn" onClick={() => {
                        if (isYearView) {
                            selectedDate.setFullYear(selectedDate.getFullYear() + 1);
                        } else {
                            selectedDate.setMonth(selectedDate.getMonth() + monthsToShow);
                        }
                        renderCalendar();
                    }}>Next</button>
                </div>
            </div>
            <div className="days-header" id="daysHeader">
                <div>Sunday</div>
                <div>Monday</div>
                <div>Tuesday</div>
                <div>Wednesday</div>
                <div>Thursday</div>
                <div>Friday</div>
                <div>Saturday</div>
            </div>
            <div className="calendar-grid" id="calendarGrid">
                {/* Calendar dates will be injected here */}
            </div>
            <div className="year-grid" id="yearGrid">
                {/* Yearly view months will be injected here */}
            </div>
            <div className={`popup ${popupVisible ? 'visible' : ''}`} id="popup">
    <div className="popup-header">
        <h3>Posts</h3>
        <button className="close-btn" onClick={closePopup}>×</button>
    </div>
    <div id="popupContent">
        {popupContent.map(post => (
            <div key={post.date + post.title} className="post" onClick={() => navigateToPostDetails(post)}>
                {post.title} ({post.platform})
            </div>
        ))}
    </div>
</div>

        </div>
    );
};

export default App;
