import {UnitsManager} from "../managers/UnitsManager";
import {IServerMessage} from "../types/networkTypes";
import {IMessageHandler} from "./IMessageHandler";

export class MessageHandler implements IMessageHandler {
    private readonly unitsManager: UnitsManager;

    constructor(unitsManager: UnitsManager) {
        this.unitsManager = unitsManager;
    }

    handleMessage(message: IServerMessage) {
        switch (message.type) {
            case "PLAYER_ASSIGNMENT":
                this.unitsManager.setControlledUnitId(message.playerUnitId);
                break;
            case "STATE_SYNC":
                message.units.forEach((unit) => this.unitsManager.upsertUnit(unit));
                break;
            case "UNIT_POSITION":
                this.unitsManager.ensureUnit(message.unitId, {x: message.x, y: message.y});
                break;
        }
    }
}
