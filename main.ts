const CMD_EMPTY = "empty"
const CMD_FWD = "do_przodu"
const CMD_RUN ="ruszaj"
const CMD_LEFT = "w_lewo"
const CMD_RIGHT = "w_prawo"
const CMD_STOP = "stop"
const CMD_SETSPEED = "predkosc"
const CMD_SETSPEEDL = "p_prawy"
const CMD_SETSPEEDR = "p_lewy"
const CMD_CHGMTRSPEED = "zmienszybk"
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


function DecodeP1 (EncodedValue:number): number{
    return EncodedValue % 512 -256 
}

function DecodeP2(EncodedValue: number): number {
    return Math.trunc(EncodedValue/512) - 256
}

function CmdForward(On: boolean, Duration: number, SpeedL: number, SpeedR: number) {
    if (On) {
        LastCmd = CMD_FWD
        LastCmdTime = input.runningTime()
        MotorOffTime = LastCmdTime + Duration
        RobotImp.MotorLeft(SpeedL)
        RobotImp.MotorRight(SpeedR)

    } else {
        RobotImp.MotorLeft(SpeedL)
        RobotImp.MotorRight(SpeedR)
        MotorOffTime = 0
    }
}

function CmdRun(On: boolean, Speed:number, Duration:number) {
    CmdSetSpeed(Speed)
    CmdForward(On, Duration, Speed, Speed)
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

function CmdChangeMotorSpeed(EncodedValue: number) {

    let TmpSpeedL = ((EncodedValue / 512) - ((EncodedValue / 512) % 1)) - 256
    let TmpSpeedR = EncodedValue % 512 - 256
    if (MotorOffTime != 0) {
        RobotImp.MotorLeft(TmpSpeedL)
        RobotImp.MotorRight(TmpSpeedR)
    }
    SpeedLeft = TmpSpeedL
    SpeedRight = TmpSpeedR
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
    if (Cmd == CMD_RUN) CmdRun(ON, DecodeP1(CmdValue),DecodeP2(CmdValue))
    if (Cmd == CMD_LEFT) CmdLeft(CmdValue)
    if (Cmd == CMD_RIGHT) CmdRight(CmdValue)
    if (Cmd == CMD_CHGMTRSPEED) CmdChangeMotorSpeed(CmdValue)
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

    radio.sendValue(MSG_DIST, RobotImp.GetDistance())
    radio.sendValue(MSG_LINESENSORS, RobotImp.LineSensorStatus())
    basic.pause(10)
})
