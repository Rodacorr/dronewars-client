import {MAP_BOUNDS} from "../config/gameConfig";
import {WebSocketClient} from "../network/WebSocketClient";
import {Direction} from "../types/gameTypes";
import {clamp} from "../utils/mathUtils";
import {UnitsManager} from "./UnitsManager";

export class MovementManager {
    private readonly unitsManager: UnitsManager;
    private readonly socketClient: WebSocketClient;
    private readonly moveStep: number;

    constructor(unitsManager: UnitsManager, socketClient: WebSocketClient, moveStep: number) {
        this.unitsManager = unitsManager;
        this.socketClient = socketClient;
        this.moveStep = moveStep;
    }

    moveControlledUnit(direction: Direction) {
        const unitId = this.unitsManager.getControlledUnitId();
        if (!unitId) {
            return;
        }

        const currentPosition = this.unitsManager.getUnitPosition(unitId);
        if (!currentPosition) {
            return;
        }

        const targetPosition = this.getTargetPosition(currentPosition, direction);
        if (targetPosition.x === currentPosition.x && targetPosition.y === currentPosition.y) {
            return;
        }

        this.socketClient.sendMoveCommand(unitId, targetPosition.x, targetPosition.y);
    }

    private getTargetPosition(position: {x: number; y: number}, direction: Direction) {
        let nextX = position.x;
        let nextY = position.y;

        switch (direction) {
            case "UP":
                nextY -= this.moveStep;
                break;
            case "DOWN":
                nextY += this.moveStep;
                break;
            case "LEFT":
                nextX -= this.moveStep;
                break;
            case "RIGHT":
                nextX += this.moveStep;
                break;
        }

        return {
            x: clamp(nextX, MAP_BOUNDS.minX, MAP_BOUNDS.maxX),
            y: clamp(nextY, MAP_BOUNDS.minY, MAP_BOUNDS.maxY),
        };
    }
}
