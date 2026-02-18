import {GAME_CONFIG} from "../config/gameConfig";
import {MovementManager} from "../managers/MovementManager";
import {UnitsManager} from "../managers/UnitsManager";
import {MessageHandler} from "../network/MessageHandler";
import {WebSocketClient} from "../network/WebSocketClient";
import {Direction} from "../types/gameTypes";

export class GameScene extends Phaser.Scene {
    private unitsManager!: UnitsManager;
    private movementManager!: MovementManager;
    private socketClient!: WebSocketClient;

    constructor() {
        super("GameScene");
    }

    create() {
        this.unitsManager = new UnitsManager(this);
        const messageHandler = new MessageHandler(this.unitsManager);
        this.socketClient = new WebSocketClient(messageHandler);
        this.movementManager = new MovementManager(
            this.unitsManager,
            this.socketClient,
            GAME_CONFIG.moveStep
        );

        this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
            const direction = this.resolveDirection(event);
            if (!direction) {
                return;
            }
            this.movementManager.moveControlledUnit(direction);
        });
    }

    private resolveDirection(event: KeyboardEvent): Direction | null {
        switch (event.key) {
            case "ArrowUp":
                return "UP";
            case "ArrowDown":
                return "DOWN";
            case "ArrowLeft":
                return "LEFT";
            case "ArrowRight":
                return "RIGHT";
            default:
                return null;
        }
    }
}
