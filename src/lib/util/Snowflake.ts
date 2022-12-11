export class Snowflake {
    private _timestamp: number;
    private _workerId: number;
    private _processId: number;
    private _increment: number;

    constructor(timestamp: number, workerId: number, processId: number, increment: number) {
        this._timestamp = timestamp;
        this._workerId = workerId;
        this._processId = processId;
        this._increment = increment;
    }

    static fromBigInt(snowflake: bigint, epoch: number): Snowflake {
        let timestamp = Number((snowflake >> 22n) + BigInt(epoch));
        let workerId = Number((snowflake >> 17n) & 0b11111n);
        let processId = Number((snowflake >> 12n) & 0b11111n);
        let increment = Number(snowflake & 0b111111111111n);
        return new Snowflake(timestamp, workerId, processId, increment);
    }

    static fromString(snowflake: string, epoch: number): Snowflake {
        return Snowflake.fromBigInt(BigInt(snowflake), epoch);
    }

}