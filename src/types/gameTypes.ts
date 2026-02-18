export type UnitType = "DRONE" | "CARRIER" | "PORTADRONES";

export interface IPosition {
    x: number;
    y: number;
}

export interface IUnitData extends IPosition {
    id: string;
    type: UnitType;
}

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
