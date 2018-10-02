export default class Document {
    constructor() {}

    set _id(id) {
        this._id = id;
    }

    get _id() {
        return this._id;
    }

    set userId(userId) {
        this._userId = userId;
    }

    get userId() {
        return this._userId;
    }

    set fileName(fileName) {
        this._fileName = fileName;
    }

    get fileName() {
        return this._fileName;
    }

    set mimeType(mimeType) {
        this._mimeType = mimeType;
    }

    get mimeType() {
        return this._mimeType;
    }

    set data(data) {
        this._data = data;
    }

    get data() {
        return this._data;
    }
}