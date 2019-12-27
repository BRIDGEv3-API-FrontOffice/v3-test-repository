class ImporterService {
    constructor() {
        this._urlsArr = [];
    }

    import(urls) {
        urls.forEach(url => {
            this._urlsArr.push(url);
        });

        if (this._urlsArr.length > 0) {
            // eslint-disable-next-line
            return Promise.all(this._urlsArr.map(this.resolveUrl.bind(this)));
        }
        return false;
    }

    resolveUrl(url) {
        // eslint-disable-next-line
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            document.body.appendChild(script);
            this._urlsArr = [];

            script.addEventListener('load', () => {
                return resolve(script);
            }, false);
            script.addEventListener('error', () => {
                return reject(script);
            }, false);
        });
    }
}

module.exports = ImporterService;
