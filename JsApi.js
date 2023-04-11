const config = {
    baseUrl: 'https://cats.petiteweb.dev/api/single/lalakaba/',
};

class Api {
    constructor(config) {
    this.baseUrl = config.baseUrl;
    }

    getAllCats = () => {

    return fetch(`${this.baseUrl}show`).then((res) => {
        return res.ok ? res.json() : Promise.reject(res.json());
    });
    };

    addCat = (cat) => {
    return fetch(`${this.baseUrl}add`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(cat),
    }).then((res) => {
        return res.ok ? res.json() : Promise.reject('У меня лапки');
    });
    };

    updateCat = (cat) => {
    return fetch(`${this.baseUrl}update/${cat.id}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(cat),
    }).then((res) => {
        console.log(res);
        return res.ok ? res.json() : Promise.reject('У меня лапки');
    });
    };

    getIdAllCats = () => {

    return fetch(`${this.baseUrl}ids`).then((res) => {
        return res.ok ? res.json() : Promise.reject('У меня лапки');
    });
    };

    getDisplayCat = (id) => {
    return fetch(`${this.baseUrl}show/${id}`).then((res) => {
        return res.ok ? res.json() : Promise.reject('У меня лапки');
    });
    };

    getDeleteCat = (id) => {
    return fetch(`${this.baseUrl}delete/${id}`, {
        method: 'DELETE',
    }).then((res) => {
        return res.ok ? res.json() : Promise.reject('У меня лапки');
    });
    };
}


const api = new Api(config);

