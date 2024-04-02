import { Vector3 } from "../Generic/Vector3.js";
import { Position } from "./Position.js";
import { Direction } from "./Direction.js";

/** A ray consisting of an origin and a direction. */
class Ray {

    private origin: Position;
    private direction: Direction;

    /**
     * Constructs a new Ray instance.
     * If no parameters are set, this ray will be empty.
     * If one parameter is set, this ray will take the values of the other ray as its own values.
     * If all parameters are set, this ray will take the parameters as its own values.
     * @param origin Either the origin of this ray, another ray, or undefined.
     * @param direction Either the direction of this ray or undefined.
     * @returns A new Ray instance.
     */
    constructor(origin?: Vector3 | Ray, direction?: Vector3) {
        // RELEASE
        if (origin instanceof Ray && direction === undefined) {
            this.origin = origin.origin;
            this.direction = origin.direction;
            return;
        }

        if (origin instanceof Vector3 && direction !== undefined) {
            this.origin = origin;
            this.direction = direction;
            return;
        }

        this.origin = new Vector3();
        this.direction = new Vector3();

        // DEBUG
        // const noParameters: boolean = origin === undefined && direction === undefined;

        // let oneParameter: boolean;
        // if (oneParameter = origin instanceof Ray && direction === undefined) {
        //     this.fromRay(origin);
        // }
        
        // let filledParameters: boolean;
        // if (filledParameters = origin instanceof Vector3 && direction !== undefined) {
        //     this.origin = origin;
        //     this.direction = direction;
        // }

        // if (!noParameters && !oneParameter && !filledParameters) {
        //     throw new Error("[Ray]: Not all required parameters are filled.");
        // }
    }

    /**
     * Replaces the values of this ray with the values of the parameters.
     * @param origin The new origin.
     * @param direction The new direction.
     */
    public fromValues(origin: Vector3, direction: Vector3): void {
        this.origin = origin;
        this.direction = direction;
    }

    /**
     * Replaces the values of this ray with the values of another ray.
     * @param other The other ray.
     */
    public fromRay(other: Ray): void {
        this.origin = other.origin;
        this.direction = other.direction;
    }

    /**
     * Returns the origin of this ray.
     * @returns The origin of this ray.
     */
    public getOrigin(): Position {
        return this.origin;
    }

    /**
     * Returns the direction of this ray.
     * @returns The direction of this ray.
     */
    public getDirection(): Direction {
        return this.direction;
    }

    /**
     * Calculates the position at a certain ray time.
     * @param time The ray time.
     * @returns The position.
     */
    public at(time: number): Position {
        return this.origin.add(this.direction.multiply(time));
    }
}

export { Ray };