import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, AfterInsert, OneToOne } from "typeorm";
import Profile from "./profile";
import { LOG_EVENT_TYPES } from "../../enums/logs";

/**
 * @description Handles the Log records in the Database
 */
@Entity()
export default class Log {
    public static readonly COLUMN_NAMES = {
        id:"id",
        createdAt:"created_at",
        eventServerTime:"event_server_time",
        eventType:"event_type",
        eventData:"event_data",
        user:"user",
    }

    @PrimaryGeneratedColumn({
        name: Log.COLUMN_NAMES.id
    })
    id: number;

    @CreateDateColumn({
        name: Log.COLUMN_NAMES.createdAt
    })
    createdAt: Date;
    
    @Column({
        name:Log.COLUMN_NAMES.eventServerTime
    })
    eventServerTime:Date;
    
    @Column({
        name:Log.COLUMN_NAMES.eventType
    })
    eventType:string;
    
    @Column({
        name:Log.COLUMN_NAMES.eventData,
        nullable: true
    })
    eventData:string;
    
    @OneToOne(type => Profile, profile => profile.logs,{nullable:true})
    user:Profile;


}