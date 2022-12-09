import { createElement, useState, useEffect } from 'react';

import './index.scss';


export default function SportCalendar() {
  const weekDate = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

  const [dialogType, setDialogType] = useState(1);
  const [userSelectDate, setUserSelectDate] = useState('');
  const [buQianDate, setBuQianDate] = useState('');
  const [calenderInfo, setCalendarInfo] = useState(null);
  const [sessionDate, setSessionDate] = useState({});
  const [skippingRope, setSkippingRope] = useState('');
  const [runing, setRuning] = useState('');

  useEffect(() => {
    setCalendarInfo(getMonthOption());

    // 获取localStorage数据
    setSessionDate(getStorageDate() || {});
  }, []);

  // 当sessionDate数据有变动时，同步到localStorage中
  useEffect(() => {
    if (Object.keys(sessionDate).length > 0) {
      localStorage.setItem('hugouzi_date_options', JSON.stringify(sessionDate));
    }
  }, [sessionDate])

  function getMonthOption(m = 12) {
    const days = 31;
    const monthOptions =  new Array(31).fill('').map((item, index) => {
      const day = `00${index + 1}`.slice(-2);
      const month = `00${m}`.slice(-2);
      const date = new Date(`2022-${month}-${day}`);
      const curDate = new Date();
      const num = getStorageDate(`2022-${month}-${index + 1}`);
      return {
        date: `2022-${month}-${day}`,
        timer: date.getTime(),
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

  function getStorageDate(key) {
    const dataString = localStorage.getItem('hugouzi_date_options') || '';
    const dataOptions = dataString ? JSON.parse(dataString) : {};
    
    if (key) {
      return dataOptions[key] || '';
    }
    return dataOptions;
  }

  const clickHandle = () => {
    const date = new Date();
    const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const newSessionDate = { ...sessionDate };
    newSessionDate[key] = skippingRope;
    setSessionDate(newSessionDate);
    window.location.reload();
  };

  const renderCalendarItem = (data, index) => {
    return (
      <div
        className={`s-c__calendar-content-col-item ${data.isCurrentDay ? 'active' : ''}`}
        key={index}
        onClick={() => selecteDateHandle(data)}
      >
        <div className="s-c__calendar-content-col-item-day">{data.day || ''}</div>

        {
          data.isCuo && (
            <div class="s-c__calendar-content-col-item-cuo">
              <div class="s-c__calendar-content-col-item-cuo--inline">
                跳绳{data.num}
              </div>
            </div>
          )
        }
      </div>
    );
  };

  const renderCalendarCol = (data, index) => {
    return (
      <div className="s-c__calendar-content-col" key={index}>
        { data.map(renderCalendarItem) }
      </div>
    )
  };

  const selecteDateHandle = (data) => {
    const curDate = new Date();
    const y = curDate.getFullYear();
    const m = `00${curDate.getMonth() + 1}`.slice(-2);
    const d = `00${curDate.getDate()}`.slice(-2);

    const currentDayFirstTimer = new Date(new Date(new Date(`${y}-${m}-${d}`).getTime()-24*60*60*1000).setHours(0,0,0,0)).getTime();
    const currentDayLastTimer = new Date(new Date(new Date(`${y}-${m}-${d}`).getTime()-24*60*60*1000).setHours(23,59,59,999)).getTime();
    setUserSelectDate(data.date);


    if (data.timer < currentDayFirstTimer && !data.isCuo) {
      setDialogType(3);
    } else if (data.timer < currentDayFirstTimer && data.isCuo) {
      setDialogType(2);
    } else if (data.timer < currentDayLastTimer) {
      setDialogType(1);
      setBuQianDate('');
    } else {
      setDialogType(4);
    }
  }

  return (
    <div className="s-c__container">
      <h1 className="s-c__title">胡狗子的健身表</h1>
      <div className="s-c__calendar">
        <div className="s-c__calendar-title-c">
          {
            weekDate.map(item => <div className="s-c__calendar-title-item">{item}</div>)
          }
        </div>
        <div className="s-c__calendar-content">
          {
            calenderInfo && calenderInfo.map(renderCalendarCol)
          }
        </div>
      </div>

      {
        dialogType === 4 && (
          <div className="s-c__picker">
            <div>{userSelectDate ? `${userSelectDate}：` : ''} 这天还没开始哟~</div>
          </div>
        )
      }

      {
        dialogType === 3 && (
          <div className="s-c__picker">
            <div>补签{userSelectDate ? `：${userSelectDate}` : ''}</div>
            <div className="s-c__picker-in-box">
              <div className="s-c__picker-in-label">跳绳:</div>
              <div><input className="s-c__picker-in-input" onInput={e => setSkippingRope(e.target.value)} /></div>
            </div>
            <div className="s-c__picker-in-button" onClick={clickHandle}>确认</div>
          </div>
        )
      }
      
      {
        dialogType === 2 && (
          <div className="s-c__picker">
            <div>{userSelectDate ? `${userSelectDate}：` : ''} 这一天很棒，你运动了哟～</div>
            <div></div>
          </div>
        )
      }

      {
        dialogType === 1 && (
          <div className="s-c__picker">
            <div className="s-c__picker-in-box">
              <div className="s-c__picker-in-label">跳绳:</div>
              <div><input className="s-c__picker-in-input" onInput={e => setSkippingRope(e.target.value)} /></div>
            </div>
            {/* <div className="s-c__picker-in-box">
              <div className="s-c__picker-in-label">跑步:</div>
              <div><input className="s-c__picker-in-input" onInput={e => setRuning(e.target.value)} /></div>
            </div> */}
            <div className="s-c__picker-in-button" onClick={clickHandle}>确认</div>
          </div>
        )
      }

    </div>
  )
}