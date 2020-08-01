import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import {
  Divider,
  Form,
  Typography,
  Checkbox,
  Layout,
  Row,
  Col,
  Timeline,
  Tooltip,
} from 'antd';
import { QuestionCircleFilled } from '@ant-design/icons';

const { Title } = Typography;
const { Content } = Layout;

const explanationText = 'Habit tracker for obsessive maniacs';

const HourOfDay = ({ hour, date }: { hour: string; date: Date }) => {
  const fieldName = `${date.toDateString()}_${hour}`.replace(/\s/g, '_');

  return (
    <Col span={4} key={hour}>
      <Form.Item name={fieldName} noStyle valuePropName="checked">
        <Checkbox>{hour}</Checkbox>
      </Form.Item>
    </Col>
  );
};

const TimeOfDay = ({ hours, date }: { hours: string[]; date: Date }) => {
  return (
    <Row>
      {hours.map((hour) => (
        <HourOfDay date={date} hour={hour} key={hour} />
      ))}
    </Row>
  );
};

const Day = ({ date, offset }: { date: Date; offset: number }) => {
  const weekdays = React.useMemo(
    () => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    [],
  );
  const timetable = React.useMemo(
    () => [
      ['00 am', '1 am', '2 am', '3 am', '4 am', '5 am'],
      ['6 am', '7 am', '8 am', '9 am', '10 am', '11 am'],
      ['12 pm', '13 pm', '14 pm', '15 pm', '16 pm', '17 pm'],
      ['18 pm', '19 pm', '20 pm', '21 pm', '22 pm', '23 pm'],
    ],
    [],
  );

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
        <TimeOfDay date={newDate} hours={hours} key={idx} />
      ))}
    </Timeline.Item>
  );
};

const App = () => {
  const initialGoal =
    window.localStorage.getItem('controlfreak_goal') || 'Цель';
  const [goal, setGoal] = React.useState(initialGoal);
  const goalKeyName = React.useMemo(
    () => `controlfreak_${goal.replace(/\s/g, '_')}_calendar`,
    [goal],
  );

  const initialCalendar = window.localStorage.getItem(goalKeyName) || '{}';
  const [calendarData, setCalendarData] = React.useState(
    JSON.parse(initialCalendar),
  );

  // TODO: решить сколько дней рендерить по умолчанию и как рендерить больше
  const daysToRender = React.useMemo(() => new Array(7).fill(null), []);

  // TODO: вынести в хук ↓
  const saveCalendarToLS = () => {
    window.localStorage.setItem(goalKeyName, JSON.stringify(calendarData));
  };

  // TODO: сделать удаление старых ключей из LS
  const saveGoalAndMoveCalendarDataToNewLSKey = () => {
    window.localStorage.setItem('controlfreak_goal', goal);
    window.localStorage.setItem(goalKeyName, JSON.stringify(calendarData));
  };

  React.useEffect(saveCalendarToLS, [calendarData]);
  React.useEffect(saveGoalAndMoveCalendarDataToNewLSKey, [goal]);

  const handleCalendarChange = (_: any, allFields: object) => {
    setCalendarData(allFields);
  };

  return (
    <div id="root" className="root">
      <Layout>
        <Content>
          <Row>
            <Col span={10} offset={7}>
              <Title className="app-title">
                ControlFreakApp{' '}
                <Tooltip title={explanationText}>
                  <QuestionCircleFilled spin className="explanation-icon" />
                </Tooltip>
              </Title>

              <Title level={3} editable={{ onChange: setGoal }}>
                {goal}
              </Title>
              <Divider style={{ borderColor: '#303030', borderWidth: 2 }} />
              <Form
                initialValues={calendarData}
                name="calendar"
                onValuesChange={handleCalendarChange}
              >
                <Timeline mode="left">
                  {daysToRender.map((_, idx) => {
                    const startFullDate = new Date(); // TODO: брать из LS

                    return <Day date={startFullDate} offset={idx} key={idx} />;
                  })}
                </Timeline>
              </Form>
            </Col>
          </Row>
        </Content>
      </Layout>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
