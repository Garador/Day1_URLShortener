import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, AfterInsert } from "typeorm";
import DatabaseController from '../../utils/database'
import { ROLES } from "../../enums/roles";
import * as bcrypt from 'bcrypt';
import { USER_STATUS } from "../../enums/userStatus";
import Log from "./log";

/**
 * @description Handles the profile records into the database.
 */
@Entity()
export default class Profile {
    public static readonly COLUMN_NAMES = {
        id:"id",
        createdAt:"created_at",
        updatedAt:"updated_at",
        status:"status",
        username:"username",
        hash:"hash",
        role:"role"
    }

    @PrimaryGeneratedColumn({
        name: Profile.COLUMN_NAMES.id
    })
    id: number;

    @CreateDateColumn({
        name: Profile.COLUMN_NAMES.createdAt
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: Profile.COLUMN_NAMES.updatedAt
    })
    updateAt: Date;

    @Column({
        name:Profile.COLUMN_NAMES.status, default: USER_STATUS.ACTIVE
    })
    status:USER_STATUS;

    @Column({
        name:Profile.COLUMN_NAMES.username
    })
    username:string;

    @Column({
        name:Profile.COLUMN_NAMES.hash
    })
    hash:string;

    @Column({
        name:Profile.COLUMN_NAMES.role, default:ROLES.USER
    })
    role:ROLES;

    //Logs produced / made by the user
    logs:Log[];

    /**
     * @description Hashes a raw password and set up the hash
     * @param newPassword New password to hash
     * @param rounds The rounds to give to the hash
     */
    setPassword(newPassword:string, rounds?:number){
        this.hash = bcrypt.hashSync(newPassword, rounds ? rounds : 10);
    }

    /**
     * @description Checks wether the raw password is equivalent to the current hashed password.
     * @param password Raw password
     */
    hasPassword(password:string):boolean {
        return bcrypt.compareSync(password, this.hash);
    }

    /**
     * @description Checks wether this record is active against the USER_STATUS enums.
     */
    isActive():boolean {
        return (this.status === USER_STATUS.ACTIVE) ? true : false;
    }


}