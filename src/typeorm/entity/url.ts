import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, AfterInsert } from "typeorm";
import DatabaseController from '../../utils/database'

/**
 * @description Handles the shorted URLs stored into the database
 */
@Entity()
export default class Url {
    public static readonly COLUMN_NAMES = {
        id:"id",
        createdAt:"created_at",
        updatedAt:"updated_at",
        code:"code",
        url:"large_url"
    }

    @PrimaryGeneratedColumn({
        name: Url.COLUMN_NAMES.id
    })
    id: number;

    @CreateDateColumn({
        name: Url.COLUMN_NAMES.createdAt
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: Url.COLUMN_NAMES.updatedAt
    })
    updateAt: Date;

    @Column({
        name: Url.COLUMN_NAMES.code,
        nullable: true
    })
    code:string;

    @Column({
        name: Url.COLUMN_NAMES.url
    })
    url: string;

    @AfterInsert()
    async generateCode(){
        /**
         * @description Generates the shortening code based on a Base16 string equivalent of the ID
         * and stores it to the record.
         */
        this.code = this.id.toString(16);
        await DatabaseController.connection.getRepository(Url).save(this);
    }

}