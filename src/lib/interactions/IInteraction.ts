import {Snowflake} from "../util/Snowflake";

export interface IInteraction {
    id: Snowflake;
    type: 'PING' | 'APPLICATION_COMMAND' | 'MESSAGE_COMPONENT' | 'APPLICATION_COMMAND_AUTOCOMPLETE' | 'MODAL_SUBMIT';
    data?: any;
    guild_id?: string;


}
