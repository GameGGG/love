import React from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';


import SportCalendar from './../pages/SportCalendar';
const routerConfig = [
  {
    path: '/',
    component: <SportCalendar />,
  },
  {
    path: '/sport_calendar',
    component: <SportCalendar />,
  }
]

export default class RouterContainer extends React.Component {

  render() {
    return (
      <HashRouter>
        <Routes>
          {
            routerConfig.map(item => {
              return (
                <Route path={item.path} element={item.component} />
              )
            })
          }
        </Routes>
      </HashRouter>
    )
  }
}
