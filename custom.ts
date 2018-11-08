/**
 * AlphaBot2
 * Use this file to define custom functions and blocks.
 * Read more at https://makecode.microbit.org/blocks/custom 
 */

namespace RobotImp {
    export function MotorLeft(SpeedVal: number) {
        if (SpeedVal >= 0) maqueen.MotorRun(maqueen.aMotors.M1, maqueen.Dir.CW, SpeedVal)
        else maqueen.MotorRun(maqueen.aMotors.M1, maqueen.Dir.CCW, -SpeedVal)
    }

    export function MotorRight(SpeedVal: number) {
        if (SpeedVal >= 0) maqueen.MotorRun(maqueen.aMotors.M2, maqueen.Dir.CW, SpeedVal)
        else maqueen.MotorRun(maqueen.aMotors.M2, maqueen.Dir.CCW, -SpeedVal)
    }

    export function GetDistance(): number {
        return maqueen.sensor(PingUnit.Centimeters);
    }
    export function LineSensorStatus(): number {
        let Line1Sensor = maqueen.readPatrol(maqueen.Patrol.PatrolLeft)
        let Line2Sensor = maqueen.readPatrol(maqueen.Patrol.PatrolRight)
        return Line1Sensor + Line2Sensor * 10
    }
}
