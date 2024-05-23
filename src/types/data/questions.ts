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

// Объект, у которого
// ключи - это id не заполненых до конца вопросов,
// а значения - это массив из id недобавленных вариантов ответа для этих вопросов
export interface ILeftQuestionsValuesIds {
  [key: number]: number[];
}
