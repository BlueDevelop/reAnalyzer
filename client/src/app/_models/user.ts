import {IUser} from "../_interfaces/IUser"

export class User implements IUser{
    createdAt:Date;
    name:string;
    password:string;
    uniqueId:string;
    updatedAt:Date;
    _id:string;

    constructor(createdAt:Date,name:string,password:string,uniqueId:string,updatedAt:Date,_id:string) {
        this.createdAt = createdAt;
        this.name = name;
        this.password = password;
        this.uniqueId = uniqueId;
        this.updatedAt = updatedAt;
        this._id = _id;
     }
}