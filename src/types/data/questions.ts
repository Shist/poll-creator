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
