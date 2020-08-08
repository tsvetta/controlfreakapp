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
  Popconfirm,
  Select,
  Affix,
} from 'antd';
import {
  ExclamationCircleOutlined,
  QuestionCircleFilled,
  DeleteFilled,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';

import { useCalendarForm } from './use-calendar-form';

const { Title } = Typography;
const { Content } = Layout;
const { Option } = Select;

const texts = {
  explain: 'Habit tracker for obsessive maniacs',
  delete: 'Delete all?',
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

const AppTitle = ({ form }: { form: FormInstance }) => {
  const { goal, updateGoal } = useCalendarForm(form);

  return (
    <>
      <Title className="app-title">
        ControlFreakApp{' '}
        <Tooltip title={texts.explain}>
          <QuestionCircleFilled spin className="explanation-icon" />
        </Tooltip>
      </Title>
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
    </>
  );
};

const SettingsPanel = ({ form }: { form: FormInstance }) => {
  const { resetData } = useCalendarForm(form);

  const handleLayoutChange = () => {};

  return (
    <>
      <Affix className="layout-select-wrapper">
        <Form.Item name="layout-type" label="Layout">
          <Select
            onChange={handleLayoutChange}
            style={{ minWidth: 100 }}
          >
            <Option value="hourly">Hourly</Option>
            <Option value="daily">Daily</Option>
            <Option value="monthly">Monthly</Option>
          </Select>
        </Form.Item>
      </Affix>
      <Affix className="delete-button-wrapper">
        <Popconfirm
          title={texts.delete}
          onConfirm={resetData}
          okText="Yes"
          cancelText="No"
          placement="bottomRight"
          icon={<ExclamationCircleOutlined />}
          okButtonProps={{
            danger: true,
          }}
        >
          <Button size="large" type="link" icon={<DeleteFilled />} />
        </Popconfirm>
      </Affix>
    </>
  );
};

const App = () => {
  const [calendarFormInstance] = Form.useForm();

  const { days, startDate, saveFormDataToLs } = useCalendarForm(
    calendarFormInstance,
  );

  const handleSaveFormDataToLs = (_: object, allFields: object) => {
    saveFormDataToLs(allFields);
  };

  return (
    <div className="app">
      <Form
        form={calendarFormInstance}
        name="calendar"
        onValuesChange={handleSaveFormDataToLs}
      >
        <SettingsPanel form={calendarFormInstance} />
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
                <AppTitle form={calendarFormInstance} />
                <Divider style={{ borderColor: '#303030', borderWidth: 2 }} />
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
              </Col>
            </Row>
          </Content>
        </Layout>
      </Form>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
