const CMD_EMPTY = "empty"
const CMD_FWD = "do_przodu"
const CMD_LEFT = "w_lewo"
const CMD_RIGHT = "w_prawo"
const CMD_STOP = "stop"
const CMD_SETSPEED = "predkosc"
const CMD_SETSPEEDL = "p_prawy"
const CMD_SETSPEEDR = "p_lewy"
const CMD_CHGGROUP = "grupa"

const ON = true
const OFF = false

const MSG_DIST = "odleglosc"
const MSG_LINESENSORS = "czlini"

const INIT_GROUP = 1

let SpeedLeft: number = 0
let SpeedRight: number = 0
let LastCmd: string = CMD_EMPTY
let LastCmdTime: number = input.runningTime()
let MotorOffTime: number = 0
let RGrpEndTime: number = 0

radio.setGroup(INIT_GROUP)

function MotorLeft(SpeedVal: number) {
    if (SpeedVal >= 0) maqueen.MotorRun(maqueen.aMotors.M1, maqueen.Dir.CW, SpeedVal)
    else maqueen.MotorRun(maqueen.aMotors.M1, maqueen.Dir.CCW, -SpeedVal)
}

function MotorRight(SpeedVal: number) {
    if (SpeedVal >= 0) maqueen.MotorRun(maqueen.aMotors.M2, maqueen.Dir.CW, SpeedVal)
    else maqueen.MotorRun(maqueen.aMotors.M2, maqueen.Dir.CCW, -SpeedVal)
}

function GetDistance(): number {
    return maqueen.sensor(PingUnit.Centimeters);
}

function LineSensorStatus(): number {
    let Line1Sensor = maqueen.readPatrol(maqueen.Patrol.PatrolLeft)
    let Line2Sensor = maqueen.readPatrol(maqueen.Patrol.PatrolRight)
    return Line1Sensor + Line2Sensor * 10
}

function CmdForward(On: boolean, Duration: number, SpeedL: number, SpeedR: number) {
    if (On) {
        LastCmd = CMD_FWD
        LastCmdTime = input.runningTime()
        MotorOffTime = LastCmdTime + Duration
        MotorLeft(SpeedL)
        MotorRight(SpeedR)

    } else {
        MotorLeft(SpeedL)
        MotorRight(SpeedR)
        MotorOffTime = 0
    }
}

function CmdLeft(Duriation: number) {
    CmdForward(ON, Duriation, -SpeedLeft, SpeedRight)
    LastCmd = CMD_LEFT
}

function CmdRight(Duriation: number) {
    CmdForward(ON, Duriation, SpeedLeft, -SpeedRight)
    LastCmd = CMD_RIGHT
}

function CmdStop() {
    CmdForward(OFF, 0, 0, 0)
    LastCmd = CMD_STOP
}

function CmdSetSpeed(SpeedVal: number) {
    SpeedLeft = SpeedVal
    SpeedRight = SpeedVal
}

function CmdSetSpeedL(SpeedVal: number) {
    SpeedLeft = SpeedVal
}

function CmdSetSpeedR(SpeedVal: number) {
    SpeedRight = SpeedVal
}

function CmdChangeRadioGroup(On: boolean, NewRadioGroup: number) {
    if (On) {
        RGrpEndTime = input.runningTime() + 60000
        radio.setGroup(NewRadioGroup)
    } else {
        RGrpEndTime = 0
        radio.setGroup(INIT_GROUP)
    }
}



radio.onReceivedValue(function (Cmd: string, CmdValue: number) {
    if (Cmd == CMD_SETSPEED) CmdSetSpeed(CmdValue)
    if (Cmd == CMD_SETSPEEDL) CmdSetSpeedL(CmdValue)
    if (Cmd == CMD_SETSPEEDR) CmdSetSpeedR(CmdValue)
    if (Cmd == CMD_FWD) CmdForward(ON, CmdValue, SpeedLeft, SpeedRight)
    if (Cmd == CMD_LEFT) CmdLeft(CmdValue)
    if (Cmd == CMD_RIGHT) CmdRight(CmdValue)
    if (Cmd == CMD_STOP) CmdStop()
    if (Cmd == CMD_CHGGROUP) CmdChangeRadioGroup(ON, CmdValue)

})


basic.forever(function () {
    if (MotorOffTime != 0) {
        if ((MotorOffTime <= input.runningTime())) {
            CmdForward(OFF, 0, 0, 0)
        }
    }
    if (RGrpEndTime != 0) {
        if (RGrpEndTime <= input.runningTime()) {
            CmdChangeRadioGroup(OFF, INIT_GROUP)
        }
    }
    radio.sendValue(MSG_DIST, GetDistance())
    radio.sendValue(MSG_LINESENSORS, LineSensorStatus())
    basic.pause(10)
})
