import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ContactaddComponent } from './components/contactadd/contactadd.component';
import { ContactlistComponent } from './components/contactlist/contactlist.component';
import { ContacteditComponent } from './components/contactedit/contactedit.component';


const routes: Routes = [
		{ path: 'addcontact', component: ContactaddComponent },
		{ path: 'contacts', component: ContactlistComponent },
		{ path: 'editcontact/:id', component: ContacteditComponent } 

	]

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})


export class AppRoutingModule {
 }
