import React from 'react';
import { FormInstance } from 'antd/lib/form';

export const createGoalKeyName = (goal: string) =>
  `controlfreak_${goal.replace(/\s/g, '_')}_calendar`;

export const LS_KEYS = {
  goal: 'controlfreak_goal',
  startDate: 'controlfreak_start_date',
};

export const useCalendarForm = (formInstance: FormInstance) => {
  const defaultGoal = 'Set goal';
  const initialGoal = window.localStorage.getItem(LS_KEYS.goal) || defaultGoal;
  const [goal, setGoal] = React.useState(initialGoal);
  const goalKeyName = React.useMemo(() => createGoalKeyName(goal), [goal]);

  const [startDate, setStartDate] = React.useState(new Date());

  const getAndSetStartDate = () => {
    let startFullDateString: string = window.localStorage.getItem(
      LS_KEYS.startDate,
    );
    let startFullDate: Date = new Date();

    if (startFullDateString) {
      startFullDate = new Date(startFullDateString);
    } else {
      window.localStorage.setItem(LS_KEYS.startDate, startFullDate.toString());
    }

    setStartDate(startFullDate);
  };

  React.useEffect(getAndSetStartDate, []);

  const getFormDataFromLS = () => {
    return JSON.parse(window.localStorage.getItem(goalKeyName));
  };

  const getAndSetFormValuesFromLSData = () => {
    formInstance.setFieldsValue(getFormDataFromLS());
  };

  React.useEffect(getAndSetFormValuesFromLSData, []);

  const saveGoalAndMoveCalendarDataToNewLSKey = (newGoal: string) => {
    const newGoalKeyName = createGoalKeyName(newGoal);

    window.localStorage.setItem(LS_KEYS.goal, newGoal);
    window.localStorage.setItem(
      newGoalKeyName,
      JSON.stringify(formInstance.getFieldsValue()),
    );
  };

  const updateGoal = (newGoal: string) => {
    setGoal((previousGoal) => {
      const previousGoalKeyName = createGoalKeyName(previousGoal);

      saveGoalAndMoveCalendarDataToNewLSKey(newGoal);
      window.localStorage.removeItem(previousGoalKeyName);

      return newGoal;
    });
  };

  const resetData = React.useCallback(() => {
    updateGoal(defaultGoal);
    formInstance.resetFields();
    window.localStorage.setItem(
      goalKeyName,
      JSON.stringify(formInstance.getFieldsValue()),
    );
  }, []);

  const saveFormDataToLs = (fields: object) => {
    window.localStorage.setItem(goalKeyName, JSON.stringify(fields));
  };

  return {
    goal,
    startDate,
    updateGoal,
    resetData,
    saveFormDataToLs,
  };
};