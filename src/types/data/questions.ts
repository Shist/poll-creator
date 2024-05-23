export interface IChoice {
  id: number;
  value: string;
  next_question?: number | null;
}

export interface IQuestion {
  id: number;
  name: string;
  choices: IChoice[];
}

export interface IPollRow {
  rowId: string;
  questionIds: number[];
  selectedValuesIds: number[];
  nextQuestionIds: number[];
}

// Объект, у которого
// ключи - это id не заполненых до конца вопросов,
// а значения - это массив из id недобавленных вариантов ответа для этих вопросов
export interface ILeftQuestionsValuesIds {
  [key: number]: number[];
}

// Объект, у которого
// ключи - это id выбранного следующего вопроса для текущего набора ответов,
// а значения - это массив из id выбранных вариантов ответа
export interface INextQuestionsValuesIds {
  [key: number]: number[];
}
