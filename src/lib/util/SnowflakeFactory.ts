import {Snowflake} from "./Snowflake";

export class SnowflakeFactory {
    private _epoch: number;
    private _workerId: number = 0;
    private _processId: number = process.pid;
    private _increment: number = 0;

    constructor(epoch: number, workerId?: number, processId?: number) {
        this._epoch = epoch;
        if (workerId) this._workerId = workerId;
        if (processId) this._processId = processId;
    }

    generate(): Snowflake {
        let timestamp = Date.now() - this._epoch;
        let snowflake = BigInt(timestamp) << 22n;
        snowflake |= BigInt(this._workerId) << 17n;
        snowflake |= BigInt(this._processId) << 12n;
        snowflake |= BigInt(this._increment);
        this._increment++;
        return Snowflake.fromBigInt(snowflake, this._epoch);
    }
}