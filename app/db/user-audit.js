import app from './../server'
import uniqid from "uniqid";

export function buildInsertObject(object, req) {
    object._id = uniqid();
    object.createdBy = app.get('user');
    object.createdOn = new Date();
    return object;
}

export function buildUpdateObject(object) {
    object.modifiedBy = app.get('user');
    object.modifiedOn = new Date();
    return object;
}

export function addCreationDetails(object, req) {
    object.createdBy = app.get('user');
    object.createdOn = new Date();
    return object;
}