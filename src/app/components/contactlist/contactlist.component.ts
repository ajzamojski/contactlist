import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Router } from '@angular/router';
import { DataService } from '../../data.service';
import { Contact } from '../../classes/contact';

@Component({
  selector: 'app-contactlist',
  templateUrl: './contactlist.component.html',
  styleUrls: ['./contactlist.component.css'],
  providers: [ DataService ]
})
export class ContactlistComponent implements OnInit {
	// intitial properties
	modalRef: BsModalRef;
	contactsArr: Contact[]=[];
	msg:String;
	selectedMsg:String;
	selectedContact = new Contact;
	msgExists:Boolean = false;
	p: number = 1;

  constructor(private dataService:DataService, 
  	private route:ActivatedRoute,
  	private modalService: BsModalService,
  	private router:Router) {
   }

  ngOnInit() {
  	// on page load we retrieve all the contacts using dataservice getcontactlist
  	this.dataService.getContactList().subscribe((contacts) => {
  		// all the contacts are put in our contactsArr array
  		this.contactsArr = contacts;
  		  		console.log(this.msg);
  		  		console.log(this.contactsArr);

  		// this.selectedMsg displays a message if contact has been upload or not when 
  		// rerouting from the add new contact page or editing page
  		this.msg = this.route.snapshot.paramMap.get('result');
  		if (this.msg == "contact not added") {
  			this.selectedMsg = "Contact has not been added";
  		}
  		else if (this.msg == "contact added"){
  			this.selectedMsg = "Contact has been added";
  		}
  		else if (this.msg == "contact updated") {
				this.selectedMsg = "Contact has been updated";  		}
  	})

  }
  // getContacts() {
  // 	  this.dataService.getContactList().subscribe((contacts) => {
  // 		this.contactsArr = contacts;
  // 		console.log(this.contactsArr);
  // 	})
  // }

  // this function will delete a contact once the user confirms a second dialog using
  // the associated id with the contact
  deleteContact(contact) {
  	console.log(contact);
  	this.dataService.deleteContact(contact._id).subscribe((deleltedContact) => {
  		console.log(deleltedContact);
  		this.modalRef.hide();
  	})
  }

  openModal(template: TemplateRef<any>) {
  	// console.log(contact);
        this.modalRef = this.modalService.show(template);

    }
}

