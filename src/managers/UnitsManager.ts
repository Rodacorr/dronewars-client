import Phaser from "phaser";
import {Unit} from "../entities/Unit";
import {IPosition, IUnitData} from "../types/gameTypes";

export class UnitsManager {
    private readonly scene: Phaser.Scene;
    private readonly units: Map<string, Unit>;
    private controlledUnitId: string | null;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.units = new Map<string, Unit>();
        this.controlledUnitId = null;
    }

    setControlledUnitId(unitId: string) {
        this.controlledUnitId = unitId;
    }

    getControlledUnitId(): string | null {
        return this.controlledUnitId;
    }

    getUnitPosition(unitId: string): IPosition | null {
        const unit = this.units.get(unitId);
        if (!unit) {
            return null;
        }
        return unit.getPosition();
    }

    ensureUnit(unitId: string, position: IPosition, type: IUnitData["type"] = "DRONE") {
        const existing = this.units.get(unitId);
        if (existing) {
            existing.setPosition(position);
            return;
        }
        this.units.set(unitId, new Unit(this.scene, {id: unitId, type, x: position.x, y: position.y}));
    }

    upsertUnit(data: IUnitData) {
        const existing = this.units.get(data.id);
        if (existing) {
            existing.setPosition({x: data.x, y: data.y});
            return;
        }
        this.units.set(data.id, new Unit(this.scene, data));
    }

    updateUnitPosition(unitId: string, position: IPosition) {
        const existing = this.units.get(unitId);
        if (!existing) {
            return;
        }
        existing.setPosition(position);
    }
}
