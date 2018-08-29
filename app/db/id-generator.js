import uniqid from "uniqid";

export function addId(object) {
    object._id = uniqid();
    return object;
}