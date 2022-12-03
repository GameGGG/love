import { createElement, useState, useEffect } from 'react';

import './index.scss';


export default function SportCalendar() {
  const weekDate = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

  const [calenderInfo, setCalendarInfo] = useState(null);
  const [sessionDate, setSessionDate] = useState({});

  useEffect(() => {
    setCalendarInfo(getMonthOption());

    setSessionDate(getStorageDate() || {});
    // 获取localStorage数据
  }, []);

  // 当sessionDate数据有变动时，同步到localStorage中
  useEffect(() => {
    localStorage.setItem('hugouzi_date_options', JSON.stringify(sessionDate));
  }, [sessionDate])

  function getMonthOption(month = 12) {
    const days = 31;
    const monthOptions =  new Array(31).fill('').map((item, index) => {
      const date = new Date(`2022-${month}-${index + 1}`);
      const curDate = new Date();
      const num = getStorageDate(`2022-${month}-${index + 1}`);
      return {
        day: index + 1,
        week: date.getDay(),
        isCurrentDay: curDate.getDate() === date.getDate() && curDate.getMonth() === date.getMonth(),
        num,
        isCuo: num ? true : '',
      }
    })
    let newMonthOptions = new Array(monthOptions[0].week).fill('').concat(monthOptions);
  
    const result = [];
    newMonthOptions.forEach((item, index) => {
      const tag = index;
      const y = Math.floor(tag / 7)
      const x = tag % 7;
      if (result[y]) {
        result[y][x] = item;
      } else {
        result[y] = [item];
      }
    })
    return result;
  }

  function setDateToStorage(key, value) {
    const date = new Date();
    let sKey = value == undefined ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : key;
    let sValue = value == undefined ? key : value;
    const dataString = localStorage.getItem('hugouzi_date_options') || '';
    const dataOptions = dataString ? JSON.parse(dataString) : {};

    dataOptions[sKey] = sValue;
    localStorage.setItem('hugouzi_date_options', JSON.stringify(dataOptions));
  }

  function getStorageDate(key) {
    const dataString = localStorage.getItem('hugouzi_date_options') || '';
    const dataOptions = dataString ? JSON.parse(dataString) : {};
    
    if (key) {
      return dataOptions[key] || '';
    }
    return dataOptions;
  }




  const renderCalendarItem = (data, index) => {
    return (
      <div class="s-c__calendar-content-col-item" key={index}>
        <div class="s-c__calendar-content-col-item-day">{data.day || ''}</div>
      </div>
    );
  }

  const renderCalendarCol = (data, index) => {
    return (
      <div class="s-c__calendar-content-col" key={index}>
        { data.map(renderCalendarItem) }
      </div>
    )
  }
  return (
    <div className="s-c__container">
      <h1 className="s-c__title">胡狗子的健身表</h1>
      <div className="s-c__calendar">
        <div class="s-c__calendar-title-c">
          {
            weekDate.map(item => <div className="s-c__calendar-title-item">{item}</div>)
          }
        </div>
        <div class="s-c__calendar-content">
          {
            calenderInfo && calenderInfo.map(renderCalendarCol)
          }
        </div>
      </div>

      <div className="s-c__picker"></div>
    </div>
  )
}