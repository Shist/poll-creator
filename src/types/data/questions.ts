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

export interface IPollRowStructure {
  rowId: string;
  selectValFirst: string;
  selectOptionsFirst: string[];
  selectValsSecond: string[];
  selectOptionsSecond: string[];
  selectValThird: string;
  selectOptionsThird: string[];
}

export interface IPollRowInfo {
  [key: string]: {
    rowId: string;
    qName: string;
    choicesArr: string[];
  };
}
