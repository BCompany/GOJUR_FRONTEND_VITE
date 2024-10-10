export interface keyProps {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface dataProps {
  idElement: string;
  name: string;
  visible: string;
  type:string;
  positions: {
    name:string;
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface DefaultsProps {
  id: string;
  value: string;
}


export interface ChangeElementsVisibleProps {
  idElement: string;
  visible: string
}
