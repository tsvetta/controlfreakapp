import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import {
  Divider,
  Typography,
  Checkbox,
  Layout,
  Row,
  Col,
  Timeline,
} from 'antd';

const { Title } = Typography;
const { Content } = Layout;

const HourOfDay = ({ hour }: { hour: string }) => {
  return (
    <Col span={3} key={hour}>
      <Checkbox>{hour}</Checkbox>
    </Col>
  );
};

const TimeOfDay = ({ hours }: { hours: string[] }) => {
  return (
    <Row>
      {hours.map((hour) => (
        <HourOfDay hour={hour} key={hour} />
      ))}
    </Row>
  );
};

const Day = ({ date, offset }: { date: Date; offset: number }) => {
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const timetable = [
    ['6 am', '7 am', '8 am', '9 am', '10 am', '11 am'],
    ['12 pm', '13 pm', '14 pm', '15 pm', '16 pm', '17 pm'],
    ['18 pm', '19 pm', '20 pm', '21 pm', '22 pm', '23 pm'],
    ['00 am', '1 am', '2 am', '3 am', '4 am', '5 am'],
  ];

  const startYear = date.getFullYear();
  const startMonth = date.getMonth();
  const startDate = date.getDate();

  const newDate = new Date(startYear, startMonth, startDate + offset);
  const weekday = weekdays[newDate.getDay()];
  const dateTitle = `${newDate.toLocaleDateString()}, ${weekday}`;

  return (
    <Timeline.Item key={dateTitle}>
      <Title level={4}>{dateTitle}</Title>
      {timetable.map((hours, idx) => (
        <TimeOfDay hours={hours} key={idx} />
      ))}
    </Timeline.Item>
  );
};

const App = () => {
  const [purpose, setPurpose] = React.useState('Цель');
  const daysToRender = new Array(7).fill(null); // TODO: решить сколько дней рендерить по умолчанию и как рендерить больше

  return (
    <div id="root">
      <Layout>
        <Content>
          <Title>ControlFreakApp</Title>
          <Title level={3} editable={{ onChange: setPurpose }}>
            {purpose}
          </Title>

          <Row>
            <Col span={24}>
              <Timeline mode="left">
                {daysToRender.map((_, idx) => {
                  const startFullDate = new Date(); // TODO: брать из LS

                  return <Day date={startFullDate} offset={idx} key={idx} />;
                })}
              </Timeline>
            </Col>
          </Row>
        </Content>
      </Layout>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
