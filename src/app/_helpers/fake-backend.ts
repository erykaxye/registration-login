import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

let users = JSON.parse(localStorage.getItem('users')) || []; //array of users
let items = JSON.parse(localStorage.getItem('items')) || []; //array of lists 

//localStorage.clear();

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users/register') && method === 'POST':
                    return register(); 
                case url.endsWith('/users') && method === 'GET': 
                    return getUsers(); 
                case url.match(/\/users\/\d+$/) && method === 'GET':
                    return getUserById();
                case url.match(/\/users\/\d+$/) && method === 'PUT':
                    return updateUser();
                case url.match(/\/users\/\d+$/) && method === 'DELETE': 
                    return deleteUser(); 
                case url.match(/\/todo\/\d+$/) && method === 'GET': 
                    return getItems(); 
                case url.match(/\/todo\/\d\/\d/) && method === 'GET': 
                    return getItemById(); 
                case url.endsWith('/add') && method === 'POST': 
                    return addItem(); 
                case url.match(/\/todo\/\d\/edit\/\d/) && method === 'PUT': 
                    return updateItem();
                case url.match(/\/todo\/\d\/\d/) && method === 'DELETE': 
                    return deleteItem(); 
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        // user functions

        function authenticate() {
            const { username, password } = body;
            const user = users.find(x => x.username === username && x.password === password);
            if (!user) { return error('Username or password is incorrect'); }
            return ok({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                token: 'fake-jwt-token'
            })
        }

        function register() { 
            const user = body 
            let list = []

            if (users.find(x => x.username === user.username)) {
                return error('Username"' + user.username + '" is already taken')
            }

            //start at 0  
            user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 0; //+ 1 : 1
            users.push(user); 
            localStorage.setItem('users', JSON.stringify(users)); 

            //create a list associated with user 
            //doesn't need an id, can just use user.id 
            items.push(list); 
            localStorage.setItem('items', JSON.stringify(items)); 

            return ok(); 
        }

        function getUsers() {
            if (!isLoggedIn()) return unauthorized(); 
            return ok(users); 
        }

        function getUserById() {
            if (!isLoggedIn()) return unauthorized(); 
            const user = users.find(x => x.id === idFromUrl()); 
            return ok(user); 
        }

        function updateUser() {
            if (!isLoggedIn()) return unauthorized(); 

            let params = body; 
            let user = users.find(x => x.id === idFromUrl()); 

            //only update password if entered 
            if (!params.password) {
                delete params.password; 
            }

            //update and save user 
            Object.assign(user, params); 
            localStorage.setItem('users', JSON.stringify(users)); 

            return ok(); 
        }

        function deleteUser() {
            if (!isLoggedIn()) return unauthorized(); 

            users = users.filter(x => x.id !== idFromUrl()); 
            localStorage.setItem('users', JSON.stringify(users)); 

            //delete based on user_id? 
            items = items.filter((x, index) => index !== idFromUrl()); 
            localStorage.setItem('items', JSON.stringify(items)); 

            return ok(); 
        }

        //todo functions 

        function addItem() { //similar to updating a list 
            if (!isLoggedIn()) return unauthorized(); 
            const item = body; 
            let list = items.find((x, index) => index === userIdFromUrl()); //let list = items[userIdFromUrl()]; 

            //start at 0 
            item.id = list.length ? Math.max(...list.map(x => x.id)) + 1 : 0; 
            list.push(item); 
            
            localStorage.setItem('items', JSON.stringify(items)); 
            return ok(); 
        }

        function getItems() {
            if (!isLoggedIn()) return unauthorized(); 
            const list = items.find((x, index) => index === idFromUrl()); 
            return ok(list); 
        }

        function getItemById() {
            if (!isLoggedIn()) return unauthorized(); 
            const list = items.find((x, index) => index === userIdFromUrl()); 
            const item = list.find(x => x.id === idFromUrl()); 
            return ok(item); 
        }

        function updateItem() {
            if (!isLoggedIn()) return unauthorized(); 

            let params = body; 
            const list = items.find((x, index) => index === userIdFromUrlEdit()); 
            let item = list.find(x => x.id === idFromUrl()); 

            //update and save item
            Object.assign(item, params); 
            localStorage.setItem('items', JSON.stringify(items)); 

            return ok(); 
        }

        function deleteItem() {
            if (!isLoggedIn()) return unauthorized(); 

            //let list = items.find((x, index) => index === userIdFromUrl());
            //list = list.filter(x => x.id !== idFromUrl()); //will this still affect main items? 
            items[userIdFromUrl()] = items[userIdFromUrl()].filter(x => x.id !== idFromUrl());
            localStorage.setItem('items', JSON.stringify(items)); 
            return ok(); 
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function unauthorized() { 
            return throwError({ status: 401, error: { message: 'Unauthorized' } }); 
        }

        function isLoggedIn() { 
            return headers.get('Authorization') === 'Bearer fake-jwt-token'; 
        }

        //path: ':id'
        function idFromUrl() {
            const urlParts = url.split('/'); 
            return parseInt(urlParts[urlParts.length - 1]); 
        }

        //path: ':id/:item_id'
        function userIdFromUrl() {
            const urlParts = url.split('/'); 
            return parseInt(urlParts[urlParts.length - 2]); 
        }

        //path: ':id/edit/:item_id'
        function userIdFromUrlEdit() {
            const urlParts = url.split('/'); 
            return parseInt(urlParts[urlParts.length - 3]); 
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};

