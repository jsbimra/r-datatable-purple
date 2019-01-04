class API {
    static fetchData(by= 'Books') {
        if (by) {
            const req = fetch(`https://fakerestapi.azurewebsites.net/api/${by}`)
                .then(resp => resp.json()).then(data => {
                   return data ? data: ['no data found!'];
                })
                .catch(err => new Error(err));
            return req
        }
    }
}

export default API;