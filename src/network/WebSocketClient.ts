import {NETWORK_CONFIG} from "../config/networkConfig";
import {IClientMessage, IServerMessage} from "../types/networkTypes";
import {IUnitData, UnitType} from "../types/gameTypes";
import {IMessageHandler} from "./IMessageHandler";

export class WebSocketClient {
    private readonly socket: WebSocket;
    private readonly messageHandler: IMessageHandler;

    constructor(messageHandler: IMessageHandler) {
        this.messageHandler = messageHandler;
        this.socket = new WebSocket(NETWORK_CONFIG.serverUrl);

        this.socket.onopen = () => {
            console.log("Conectado al servidor");
        };

        this.socket.onmessage = (event) => {
            try {
                const rawData = JSON.parse(event.data);
                const message = this.normalizeServerMessage(rawData);
                if (!message) {
                    console.warn("Mensaje sin formato reconocido", rawData);
                    return;
                }
                this.messageHandler.handleMessage(message);
            } catch (error) {
                console.error("Mensaje invalido del servidor", error);
            }
        };
    }

    sendMoveCommand(unitId: string, targetX: number, targetY: number) {
        const message: IClientMessage = {
            type: "MOVE_COMMAND",
            unitId,
            targetX,
            targetY,
        };
        this.send(message);
    }

    private send(message: IClientMessage) {
        if (this.socket.readyState !== WebSocket.OPEN) {
            return;
        }
        this.socket.send(JSON.stringify(message));
    }

    private normalizeServerMessage(data: any): IServerMessage | null {
        if (!data || typeof data !== "object") {
            return null;
        }

        if (typeof data.type === "string") {
            return data as IServerMessage;
        }

        if (typeof data.playerUnitId === "string") {
            return {
                type: "PLAYER_ASSIGNMENT",
                playerUnitId: data.playerUnitId,
            };
        }

        if (Array.isArray(data.units)) {
            const units: IUnitData[] = data.units.map((unit: any, index: number) => {
                const id = typeof unit?.id === "string"
                    ? unit.id
                    : typeof unit?.unitId === "string"
                        ? unit.unitId
                        : `legacy-unit-${index}`;
                const type = this.normalizeUnitType(unit?.type);
                return {
                    id,
                    type,
                    x: Number(unit?.x ?? 0),
                    y: Number(unit?.y ?? 0),
                };
            });
            return {
                type: "STATE_SYNC",
                units,
            };
        }

        if (typeof data.unitId === "string" && typeof data.x === "number" && typeof data.y === "number") {
            return {
                type: "UNIT_POSITION",
                unitId: data.unitId,
                x: data.x,
                y: data.y,
            };
        }

        if (typeof data.id === "string" && typeof data.x === "number" && typeof data.y === "number") {
            return {
                type: "UNIT_POSITION",
                unitId: data.id,
                x: data.x,
                y: data.y,
            };
        }

        if (typeof data.x === "number" && typeof data.y === "number") {
            return {
                type: "UNIT_POSITION",
                unitId: "legacy-unit",
                x: data.x,
                y: data.y,
            };
        }

        return null;
    }

    private normalizeUnitType(value: unknown): UnitType {
        if (typeof value === "string") {
            const normalized = value.toUpperCase();
            if (normalized === "DRONE" || normalized === "CARRIER" || normalized === "PORTADRONES") {
                return normalized as UnitType;
            }
            if (normalized === "PORTA_DRONES") {
                return "PORTADRONES";
            }
        }
        return "DRONE";
    }
}
