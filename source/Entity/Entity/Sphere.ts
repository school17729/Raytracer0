import { Position } from "../../Geometry/Position.js";
import { Ray } from "../../Geometry/Ray.js";
import { HitInformation } from "../HitInformation.js";
import { Direction } from "../../Geometry/Direction.js";
import { Vector3 } from "../../Generic/Vector3.js";
import { Entity } from "./Entity.js";
import { EntityType } from "./EntityType.js";
import { Material } from "../Material/Material.js";
import { Creator } from "../../Utility/Creator.js";

/** A spherical object in a scene. */
class Sphere extends Entity {
    private center: Position;
    private radius: number;

    /**
     * Constructs a new Sphere instance.
     * If no parameters are set, this sphere will be empty.
     * If all parameters are set, this sphere will take the parameters as its values.
     * @param center The center of this sphere.
     * @param radius The radius of this sphere. This value cannot be 0.
     * @returns A new Sphere instance.
     */
    constructor(center: Position, radius: number, material: Material) {
        super(EntityType.Sphere, material);

        this.center = center;
        this.radius = radius;
    }

    /**
     * Returns the center of this sphere.
     * @returns The center of this sphere.
     */
    public getCenter(): Position {
        return this.center;
    }

    /**
     * Returns the radius of this sphere.
     * @returns The radius of this sphere.
     */
    public getRadius(): number {
        return this.radius;
    }

    /**
     * Tests for the earliest intersection of a ray and this sphere.
     * @param ray The ray to use for the ray intersection test.
     * @param minimumTime The minimum ray time to consider during the ray intersection test.
     * @param maximumTime The maximum ray time to consider during the ray intersection test.
     * @returns Information about the ray intersection.
     */
    public hit(ray: Ray, minimumTime: number, maximumTime: number): HitInformation {
        const rayDirection: Direction = ray.getDirection();
        // origin minus center
        const oMC: Position = ray.getOrigin().add(this.center.negate());

        const a: number = rayDirection.dot(rayDirection);
        const b: number = rayDirection.multiply(2).dot(oMC);
        const c: number = oMC.dot(oMC) - this.radius * this.radius;

        const discriminant: number = b * b - 4 * a * c;

        const times: number[] = [
            (-b - Math.sqrt(discriminant)) / (2 * a),
            (-b + Math.sqrt(discriminant)) / (2 * a)
        ];
        
        let foundValidTime: boolean = false;
        let lowestTime: number = Number.MAX_SAFE_INTEGER;

        const timesLength: number = times.length;
        for (let i: number = 0; i < timesLength; i++) {
            const time: number = times[i];
            if (time < minimumTime || time > maximumTime) {
                continue;
            }

            if (time < lowestTime) {
                lowestTime = time;
                foundValidTime = true;
            }
        }

        if (!foundValidTime) {
            return new HitInformation();
        }

        const position: Position = ray.at(lowestTime);
        const outwardNormal: Vector3 = position.add(this.center.negate()).normalize();
        const outwardFace: boolean = rayDirection.dot(outwardNormal) < 0;
        const normal: Vector3 = new Vector3();
        if (outwardFace) {
            normal.fromVector3(outwardNormal);
        } else {
            normal.fromVector3(outwardNormal.negate());
        }

        return new HitInformation(discriminant >= 0, position, lowestTime, normal, outwardFace, this.material);
    }

    /**
     * Constructs a new Sphere instance from a raw Sphere object.
     * @param other The raw Sphere object.
     * @returns A new Sphere instance.
     */
    public static createFromRaw(other: any): Sphere {
        const rawCenter: any = other.center;
        const center: Vector3 = Vector3.createFromRaw(rawCenter);

        const radius: number = other.radius;

        const rawMaterial: any = other.material;
        const material: Material = Creator.createMaterialFromRaw(rawMaterial);

        return new Sphere(center, radius, material);
    }
}

export { Sphere };