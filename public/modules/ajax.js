import { response } from "express";

(function() {
    const noop = () => {};
    const AJAX_METHODS = {
        POST: 'POST',
        GET: 'GET',
    };

    class Ajax {
        ajaxGet(args) {
            return this.#ajax({method: AJAX_METHODS.GET, ...args});
        }

        ajaxPost(args) {
            return this.#ajax({method: AJAX_METHODS.POST, ...args});
        }

        #ajax({method = AJAX_METHODS.GET, url = '/', body = null, callback = noop}) {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.withCredentials = true;

            xhr.addEventListener('readystatechange', function() {
                if (xhr.readyState !== XMLHttpRequest.DONE) return;

                callback(xhr.status, xhr.responseText);
            });

            if (body) {
                xhr.setRequestHeader('Content-type', 'application/json; charset=utf8');
                xhr.send(JSON.stringify(body));
                return;
            }

            xhr.send();
        }

        promisifyGet(args = {}) {
            return new Promise((resolve, reject) => {
                this.#ajax({
                    ...args,
                    method: AJAX_METHODS.GET,
                    callback: (status, responseText) => {
                        // 1xx, 2xx
                        if (status < 300) {
                            resolve({
                                status,
                                responseText
                            });

                            return;
                        }

                        reject({
                            status,
                            responseText
                        })
                    }
                });
            });
        }

        getUsingFetch(args = {}) {
            let statusCode;

            return fetch(args.url, {
                method: AJAX_METHODS.GET
            }).then((response) => {
                statusCode = response.status;
                return response.json();
            }).then((parsedBody) => {
                return {
                    status: statusCode,
                    parsedBody
                };
            })
        }

        async asyncUsingFetch (args = {}) {
            const respose = await fetch(args.url, {
                method: AJAX_METHODS.GET
            });

            const parsedBody = await response.json();

            return {
                status: resposen.status,
                parsedBody
            };
        }
    }

    window.Ajax = new Ajax();
})();

