import { LightningElement, track, wire} from 'lwc';
import getOpportunityLineData from '@salesforce/apex/OpplineItemDetail.getOpportunityLineData';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import updateAccounts from '@salesforce/apex/OpplineItemDetail.updateAccounts';
import { refreshApex } from '@salesforce/apex';


const columns = [
    { label: 'Product Name', fieldName: 'Name' },
    { label: 'Product Code', fieldName: 'ProductCode' },
    { label: 'Fore Cast', fieldName: 'Forecast__c',editable:true },
    { label: 'Opportunity Name', fieldName: 'OpportunityName__c'},
    { label: 'Opportunity Owner', fieldName: 'Oppotunity_Owner_Id__c'},
    { label: 'Price From', fieldName: 'Price_From__c'},
    { label: 'Price To', fieldName: 'Price_To__c'},
    { label: 'ACV-Year1', fieldName: 'Opportunity_ACV_Year1__c'}


    /*{
        label: 'Opportunity Name',
        fieldName: 'OpportunityId',
        type: 'lookup',
        typeAttributes: {
            fieldName: 'OpportunityId',
            object: 'Opportunity',
            label: 'Opportunity',
            value: { fieldName: 'OpportunityId' },
            context: { fieldName: 'Id' },
            fields: ['Opportunity.Name'],
            target: '_self'
        }
    },*/
    /*{
        label: 'Account Name',
        fieldName: 'AccountId',
        type: 'lookup',
        typeAttributes: {
            placeholder: 'Choose Account',
            object: 'Opportunity',
            fieldName: 'AccountId',
            label: 'Account',
            value: { fieldName: 'AccountId' },
            context: { fieldName: 'Id' },
            variant: 'label-hidden',
            name: 'Account',
            fields: ['Account.Name'],
            target: '_self'
        }
    }*/
];
export default class ListviewData extends LightningElement {
    @track dataValues ;
    @track valuesData=columns;
    wiredRecords;
    draftValues = [];
    //wiring the apex method to a function 
    @wire(getOpportunityLineData)
        wiredContacts({ error, data }) {
            //Check if data exists 
            this.wiredRecords = data; 
            if (data) {
                console.log("data is available");
                this.dataValues = data;
	              // eslint-disable-next-line no-console  
                console.log(JSON.stringify(data));
                //this.dataValues=JSON.stringify(dataValues);
            } else if (error) {
                // eslint-disable-next-line no-console
                console.log(error);
            }else{
		            // eslint-disable-next-line no-console
		            console.log('unknown error')
            }
        }
        async handleSave( event ) {

            const updatedFields = event.detail.draftValues;
    
            await updateAccounts( { data: updatedFields } )
            .then( result => {
    
                console.log( JSON.stringify( "Apex update result: " + result ) );
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'OpplineItemDetail(s) updated',
                        variant: 'success'
                    })
                );
                window.location.reload();
                
                refreshApex( this.wiredRecords ).then( () => {
                    this.draftValues = [];
                });        
    
            }).catch( error => {
    
                console.log( 'Error is ' + JSON.stringify( error ) );
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating or refreshing records',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
    
            });
            
        }
}