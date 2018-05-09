import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { Contact } from '../../classes/contact';
import { trigger, state, style, transition, animate } from '@angular/animations';
 
@Component({
  selector: 'app-contactadd',
  templateUrl: './contactadd.component.html',
  styleUrls: ['./contactadd.component.css'],
  providers: [ DataService ],
  animations: [
  	trigger('spinnerAnimation', [
  		])
  ]
})
export class ContactaddComponent implements OnInit {
	//our initial properties including the contact from the imported Contact class
	contact = new Contact;
  modalRef: BsModalRef;
  profilePicture: File;
  familyCheck: Boolean = false;
  friendCheck: Boolean = false;
  associateCheck: Boolean = false;
  colleagueCheck: Boolean = false;
  firstNameError:Boolean = false;
  lastNameError:Boolean = false;
  emailError:Boolean = false;
  emailErrorSyntax:Boolean = false;
  phoneError:Boolean = false;
  emailPattern:RegExp =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  phonePattern:RegExp = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;


  constructor(private modalService: BsModalService, 
  	private dataService:DataService,
  	private router:Router) {}

  ngOnInit() {
  	//initializes all the fields to a blank state
  	this.contact = {
  		  firstName: "",
			  lastName: "",
			  email: "",
			  phone: "",
			  profilePic: "",
			  dob: "",
			  groups: [],
			  comments: ""
  	}
  }

  //these check functions are used to evaluate checkbox input states
  checkFamily(event: any){
    console.log(event);
    if (event == "A") {
    	this.familyCheck = true;
    }
  }
  checkFriend(event: any){
    if (event == "A") {
    	this.friendCheck = true;
    }
  }
  checkColleague(event: any){
    if (event == "A") {
    	this.colleagueCheck = true;
    }
  }
  checkAssociate(event: any){
    if (event == "A") {
    	this.associateCheck = true;
    }
  }

  /*fileChange function is executed when a image has been selected for uploading 
  and set it as a new file object */
  fileChange(files: FileList) {
  	console.log(files);
  	this.profilePicture = files[0];
  	console.log(this.profilePicture);
  }

  //openmodal and cancel are bootstrap modals for opening and canceling a new contact
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  cancelContactAdd() {
  	this.modalRef.hide();
  	this.router.navigate(['/contacts']);
  }

  /* this function is triggered when user clicks to add contact which will be 
	 sent to the server side using angular's dataservice */
  addContact() {

  	//error checking if required fields are filled out
  	this.firstNameError = false;
  	this.lastNameError = false;
  	this.emailError = false;
  	this.phoneError = false;
  	this.emailErrorSyntax = false;

  	//conditional statements for first name, last name, and email to check if fields are
  	//not empty
  	if (this.contact.firstName == "") {
  		this.firstNameError = true;
  	}
  	
  	if (this.contact.lastName == "") {
  		this.lastNameError = true;
  	}

  	if (this.contact.email == "") {
  		this.emailError = true;
  	}

  	if (this.contact.phone == "") {
  		this.phoneError = true;
  	}

		if (this.contact.firstName == "" || this.contact.lastName == "" || this.contact.email == "" || this.contact.phone == "") {
	  		return;
  	}

  	//checks for the correct email syntax
  	if (this.contact.email.length > 0) {
  		if (!this.contact.email.match(this.emailPattern)) {
  			this.emailErrorSyntax = true;
  			return;
  		}
  	}
  	// checks for correct phone syntax
  	if (this.contact.phone.length > 0) {
  		if (!this.contact.phone.match(this.phonePattern)) {
  			this.phoneError = true;
  			return;
  		}
  	}
  	//conditional checks for the group inputs to push into groups array field
  	if (this.familyCheck) {
  		this.contact.groups.push("Family");
  	}
  	if (this.friendCheck) {
  		this.contact.groups.push("Friend");
  	}
  	if (this.colleagueCheck) {
  		this.contact.groups.push("Colleague");
  	}
  	if (this.associateCheck) {
  		this.contact.groups.push("Associate");
  	}

  	//new form data is created to package all the fields to be sent to the server
  	let uploadData = new FormData();
  	if (this.profilePicture != undefined) {
  		uploadData.append('myFile', this.profilePicture, this.profilePicture.name)
  	}

				uploadData.append('firstName', this.contact.firstName)
				uploadData.append('lastName', this.contact.lastName)
				uploadData.append('email', this.contact.email)
				uploadData.append('phone', this.contact.phone)
				uploadData.append('dob', this.contact.dob)
				uploadData.append('groups', JSON.stringify(this.contact.groups))
				uploadData.append('comments', this.contact.comments)

		//function that sends new contact to the server and retrieves the result
		// and then navigates to the contacts page
  	this.dataService.addContact(uploadData)
  		.subscribe(result => {
  			console.log(result);
  			console.log(result.errors);
  			if (result.errors) {
  				console.log("errors exist");
  				 this.router.navigate(['/contacts', {result: "contact not added", si:true} ]);
  			}
  			else if (!result.errors) {
  				console.log("no errors exist");
					this.router.navigate(['/contacts', {result: "contact added", si:true} ]);
	  		}

  		})
  }  

}
