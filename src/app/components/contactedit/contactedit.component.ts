import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Contact } from '../../classes/contact';


@Component({
  selector: 'app-contactedit',
  templateUrl: './contactedit.component.html',
  styleUrls: ['./contactedit.component.css'],
  providers: [ DataService ]
})
export class ContacteditComponent implements OnInit {
	//our initial properties including the contact from the imported Contact class
	// as well as our error checks and routesub subscription
	private routeSub: Subscription;
	id:string;
	firstNameError:Boolean = false;
	lastNameError:Boolean = false;
	familyCheck: Boolean;
  friendCheck: Boolean;
  associateCheck: Boolean;
  colleagueCheck: Boolean;
  emailError:Boolean = false;
  emailErrorSyntax:Boolean = false;
	contact = new Contact;
	modalRef: BsModalRef;
	profilePicture: File;
	emailPattern:RegExp =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;



  constructor(private dataService: DataService, 
  	private route:ActivatedRoute, 
  	private router:Router,
  	private modalService: BsModalService) { }

  ngOnInit(): void {
  	// this route service checks the params from the previous route to
  	// retrieve the id property that was sent to this route
  	this.routeSub = this.route.params.subscribe((params: Params): void => {
  		this.id = params['id'];
  	});
  	// the id property is used to find the correct contact we will be editing
  	this.getContact(this.id);

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
  	console.log(this.contact);
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

  cancelUpdate() {
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
  	this.modalRef.hide();
  	this.router.navigate(['/contacts']);
  }

  //this function retrieves the contact we need to edit
  getContact(contact) {
  	this.dataService.findOneContact(contact).subscribe((recievedContact) => {
  		this.contact = recievedContact[0];
  		//we loop through our groups array to find which groups contact is apart of
  		// then we set the flag for the input tag to be checked if they belong to a group
  		for (var i = 0; i < this.contact.groups.length; ++i) {
  			console.log(this.contact.groups[i]);
  			if (this.contact.groups[i] == "Family") {
  				this.familyCheck = true;
  			}
  			if (this.contact.groups[i] == "Friend") {
  				this.friendCheck = true;
  			}
  			if (this.contact.groups[i] == "Colleague") {
  				this.colleagueCheck = true;
  			}
  			if (this.contact.groups[i] == "Associate") {
  				this.associateCheck = true;
  			}
  		}
  		console.log(this.contact);
  	})
  }

  // updatecontact will send the fields to the serverside and the database
  updateContact() {
 		//error checking if required fields are filled out
  	this.firstNameError = false;
  	this.lastNameError = false;
  	this.emailError = false;

  	//conditional statements for first name, last name, and email to check if fields are
  	//not empty
  	if (this.contact.firstName == "" && this.contact.lastName == "" && this.contact.email == "") {
  		this.firstNameError = true;
  		this.lastNameError = true;
  		this.emailError = true;
  		return;
  	}

  	if (this.contact.firstName == "" && this.contact.lastName == "") {
  			this.firstNameError = true;
  			this.lastNameError = true;
  			return;
  	}

  	if (this.contact.firstName == "" && this.contact.email == "") {
  			this.firstNameError = true;
  			this.emailError = true;
  			return;
  	}

  	if (this.contact.lastName == "" && this.contact.email == "") {
  			this.lastNameError = true;
  			this.emailError = true;
  			return;
  	}

  	if (this.contact.firstName == "") {
  		this.firstNameError = true;
  		return;
  	}

  	if (this.contact.lastName == "") {
  		this.lastNameError = true;
  		return;
  	}

  	if (this.contact.email == "") {
  		this.emailError = true;
  		return;
  	}

  	//checks for the correct email syntax
  	if (this.contact.email.length > 0) {
  		if (!this.contact.email.match(this.emailPattern)) {
  			this.emailErrorSyntax = true;
  			return;
  		}
  	}
  	
  	//conditional checks for the group inputs to push into groups array field
  	this.contact.groups = [];
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
  	console.log(this.contact.comments);
  	//new form data is created to package all the fields to be sent to the server
  	let uploadData = new FormData();
  			uploadData.append('firstName', this.contact.firstName)
				uploadData.append('lastName', this.contact.lastName)
				uploadData.append('email', this.contact.email)
				uploadData.append('phone', this.contact.phone)
				uploadData.append('profilePic', this.contact.profilePic)
				uploadData.append('dob', this.contact.dob)
				uploadData.append('groups', JSON.stringify(this.contact.groups))
				uploadData.append('comments', this.contact.comments)

  	if (this.profilePicture != undefined) {
  		uploadData.append('myFile', this.profilePicture, this.profilePicture.name)
  	}

		//function that sends updated contact to the server and retrieves the result
		// and then navigates to the contacts page
  	this.dataService.updateContact(uploadData, this.id).subscribe(result => {
  		console.log(result);
  		 if (result.errors) {
  				this.router.navigate(['/contacts', {result: "contact not updated", si:true} ]);
  			}
  			else if (!result.errors) {
					this.router.navigate(['/contacts', {result: "contact updated", si:true} ]);
	  		}
  	})
  }

}
