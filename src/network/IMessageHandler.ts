import {IServerMessage} from "../types/networkTypes";

export interface IMessageHandler {
    handleMessage(message: IServerMessage): void;
}
