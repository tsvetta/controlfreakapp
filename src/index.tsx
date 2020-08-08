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
  Button,
  Modal,
} from 'antd';
import {
  ExclamationCircleOutlined,
  QuestionCircleFilled,
  DeleteFilled,
  PlusCircleOutlined,
} from '@ant-design/icons';

import { useCalendarForm } from './use-calendar-form';

const { Title } = Typography;
const { Content } = Layout;
const { confirm } = Modal;

const texts = {
  explain: 'Habit tracker for obsessive maniacs',
  delete: 'Delete all saved data',
  newDay: 'New day will appear tomorrow',
};

const HourOfDay = ({ hour, date }: { hour: string; date: Date }) => {
  const fieldName = `${date.toDateString()}_${hour}`.replace(/\s/g, '_');

  return (
    <Col span={4} key={hour}>
      <Form.Item name={fieldName} noStyle valuePropName="checked">
        <Checkbox className="day-checkbox">{hour}</Checkbox>
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
      ['0 am', '1 am', '2 am', '3 am', '4 am', '5 am'],
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
      <Title level={4} className="day-title">
        {dateTitle}
      </Title>
      {timetable.map((hours, idx) => (
        <TimeOfDay date={newDate} hours={hours} key={idx} />
      ))}
    </Timeline.Item>
  );
};

const App = () => {
  const [calendarFormInstance] = Form.useForm();

  const {
    days,
    goal,
    startDate,
    updateGoal,
    resetData,
    saveFormDataToLs,
  } = useCalendarForm(calendarFormInstance);

  const handleSaveFormDataToLs = (_: object, allFields: object) => {
    saveFormDataToLs(allFields);
  };

  const confirmDeletion = () => {
    confirm({
      title: 'Delete all?',
      icon: <ExclamationCircleOutlined />,
      content: "You won't be able to recover your data after the deletion",
      okText: 'Yes',
      cancelText: 'No',
      okButtonProps: {
        danger: true,
      },
      onOk() {
        resetData();
      },
    });
  };

  return (
    <div className="app">
      <Layout>
        <Content>
          <Row>
            <Col
              xxl={{ span: 10, offset: 7 }}
              xl={{ span: 12, offset: 6 }}
              lg={{ span: 14, offset: 5 }}
              md={{ span: 16, offset: 4 }}
              sm={{ span: 20, offset: 2 }}
              xs={{ span: 22, offset: 1 }}
            >
              <Title className="app-title">
                ControlFreakApp{' '}
                <Tooltip title={texts.explain}>
                  <QuestionCircleFilled spin className="explanation-icon" />
                </Tooltip>
              </Title>

              <Row>
                <Col span={22}>
                  <Title
                    level={3}
                    editable={{
                      onChange: updateGoal,
                      // tooltip: 'Edit goal', // TODO: add after https://github.com/ant-design/ant-design/issues/25994
                    }}
                    className="app-goal"
                  >
                    {goal}
                  </Title>
                </Col>
                <Col span={1} offset={1}>
                  <Tooltip title={texts.delete}>
                    <Button
                      size="large"
                      type="link"
                      icon={<DeleteFilled />}
                      onClick={confirmDeletion}
                    />
                  </Tooltip>
                </Col>
              </Row>
              <Divider style={{ borderColor: '#303030', borderWidth: 2 }} />
              <Form
                form={calendarFormInstance}
                name="calendar"
                onValuesChange={handleSaveFormDataToLs}
              >
                <Timeline
                  mode="left"
                  reverse
                  pending={'New day will appear tomorrow'}
                  pendingDot={
                    <Tooltip title={texts.newDay}>
                      <PlusCircleOutlined />
                    </Tooltip>
                  }
                  className="control-timeline"
                >
                  {days.map((_, idx) => (
                    <Day date={startDate} offset={idx} key={idx} />
                  ))}
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
