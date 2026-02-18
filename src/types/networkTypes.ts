import {IUnitData} from "./gameTypes";

export interface IMoveCommand {
    type: "MOVE_COMMAND";
    unitId: string;
    targetX: number;
    targetY: number;
}

export interface IPlayerAssignmentMessage {
    type: "PLAYER_ASSIGNMENT";
    playerUnitId: string;
}

export interface IUnitPositionMessage {
    type: "UNIT_POSITION";
    unitId: string;
    x: number;
    y: number;
}

export interface IStateSyncMessage {
    type: "STATE_SYNC";
    units: IUnitData[];
}

export type IClientMessage = IMoveCommand;
export type IServerMessage = IPlayerAssignmentMessage | IUnitPositionMessage | IStateSyncMessage;
