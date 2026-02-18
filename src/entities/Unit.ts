import Phaser from "phaser";
import {IUnitData, IPosition, UnitType} from "../types/gameTypes";

const UNIT_COLORS: Record<UnitType, number> = {
    DRONE: 0xff4d4d,
    CARRIER: 0x4d8bff,
    PORTADRONES: 0x4d8bff,
};

export class Unit {
    public readonly id: string;
    public readonly type: UnitType;
    private readonly sprite: Phaser.GameObjects.Arc;

    constructor(scene: Phaser.Scene, data: IUnitData) {
        this.id = data.id;
        this.type = data.type;
        this.sprite = scene.add.circle(data.x, data.y, 18, UNIT_COLORS[data.type]);
    }

    setPosition(position: IPosition) {
        this.sprite.setPosition(position.x, position.y);
    }

    getPosition(): IPosition {
        return {x: this.sprite.x, y: this.sprite.y};
    }

    destroy() {
        this.sprite.destroy();
    }
}
