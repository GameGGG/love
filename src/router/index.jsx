import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


import SportCalendar from './../pages/SportCalendar';
const routerConfig = [
  {
    path: '/sport_calendar',
    component: <SportCalendar />,
  }
]

export default class RouterContainer extends React.Component {

  render() {
    return (
      <BrowserRouter>
        <Routes>
          {
            routerConfig.map(item => {
              return (
                <Route path={item.path} element={item.component} />
              )
            })
          }
        </Routes>
      </BrowserRouter>
    )
  }
}
