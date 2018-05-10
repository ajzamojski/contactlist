import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  apiUrl = 'https://ajzcontactlist.herokuapp.com/';

  constructor(public http: Http) {
  	console.log("data service connected..");
   }

  // getcontactlist retrieves all contacts from server
  getContactList() {
  	return this.http.get(this.apiUrl + 'apicontacts')
  		.map(res => res.json());
  }

  // findOneContact retrieves on individual contacts based on id from the server
  findOneContact(id) {
		return this.http.get(this.apiUrl + 'findcontact/' + id)
  		.map(res => res.json());
  }

  // addContact posts a new contact using FormData to the server
  addContact(newContact: FormData) {
  	console.log(newContact);
  	let headers = new Headers;
  	headers.append('Contact-Type', 'multipart/form-data');
  	return this.http.post(this.apiUrl + 'newcontact', newContact, {headers:headers})
  		.map(res => res.json());
  }

  // updateContact with put one contact with updated field information using FormData
  updateContact(updateData: FormData, _id) {
		let headers = new Headers;
  	headers.append('Contact-Type', 'application/json');

  	return this.http.put(this.apiUrl + 'contact/' + _id, updateData, {headers:headers})
  		.map(res => res.json());
  }

  // deleteContact with delect the selected contact from the databased using the id
  deleteContact(id) {
  	return this.http.delete(this.apiUrl + 'deletecontact/' + id)
  		.map(res => res.json());
  }

}
