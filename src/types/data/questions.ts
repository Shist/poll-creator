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

// Object, where keys -  questions IDs, values - arrays with IDs of free (not chosen yet) choices
export interface IFreeChoices {
  [key: number]: number[];
}

// Object with info about row, where 'rowId' - combination of Question ID and uuid: `${questionId}|${uuidv4()}`
export interface IPollRowStructure {
  rowId: string;
  selectValFirst: string;
  selectOptionsFirst: string[];
  selectValsSecond: string[];
  selectOptionsSecond: string[];
  selectValThird: string;
  selectOptionsThird: string[];
}

// Object for mounting init rows from server
// Keys - IDs of 'next_question' in string format
// Values:
// rowId (combination of Question ID and uuid: `${questionId}|${uuidv4()}`),
// qName - value of current question,
// choicesArr - array of current choices values
export interface IPollRowInfo {
  [key: string]: {
    rowId: string;
    qName: string;
    choicesArr: string[];
  };
}
