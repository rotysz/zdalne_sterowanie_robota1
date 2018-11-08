/**
 * AlphaBot2
 * Use this file to define custom functions and blocks.
 * Read more at https://makecode.microbit.org/blocks/custom 
 */

namespace RobotImp {
    export function MotorLeft(SpeedVal: number) {
        AlphaBot2.MotorRun(Motors.M1, SpeedVal)
    }

    export function MotorRight(SpeedVal: number) {
        AlphaBot2.MotorRun(Motors.M2, SpeedVal)

    }

    export function GetDistance(): number {
        return AlphaBot2.Ultrasonic()
    }

    export function LineSensorStatus(): number {
        let sensor_values = AlphaBot2.readCalibrated();
        let i = 0
        let Multiplier = 1
        let LineSensor = 0
        for (i = 0; i < 5; i++) {
            let value = sensor_values[i];
            if (value > 500) LineSensor = LineSensor + Multiplier
            Multiplier = Multiplier * 10
        }
        return LineSensor
    }
}


