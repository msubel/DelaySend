//Refer to troubleshooting #1 to see how to remove any error messages
function createTriggers() {
  deleteTriggers();
  
  var timerTrigger = ScriptApp.newTrigger("processTimer")
      .timeBased()
      .everyMinutes(1)
      .create();
  
   var queueTrigger = ScriptApp.newTrigger("processQueue")
      .timeBased()
      .everyMinutes(1)
      .create();
}

function deleteTriggers() { 
  var allTriggers = ScriptApp.getProjectTriggers();
  // Loop over all triggers
  for (var i = 0; i < allTriggers.length; i++) {
      ScriptApp.deleteTrigger(allTriggers[i]);    
  }
}

function processTimer() {
  
  debug('processTimer Activated '+new Date().toString());
  
  
  var queueLabel = SCHEDULER_LABEL+'/'+SCHEDULER_QUEUE_LABEL;
  var queueLabelObject =  serviceGetUserLabelByName(queueLabel);
  var timerChildLabels = getUserChildLabels(SCHEDULER_LABEL+'/'+SCHEDULER_TIMER_LABEL);
 
  for(var i=0; i<timerChildLabels.length; i++){
     var timerChildLabelObject, queueLabelObject, page;
      var date = parseDate(timerChildLabels[i]);
     if (date == null) { 
        continue;
     }
   
    
    var queueChildLabel = SCHEDULER_LABEL+'/'+SCHEDULER_QUEUE_LABEL+'/'+date.full();
    
     timerChildLabelObject = serviceGetUserLabelByName(SCHEDULER_LABEL+'/'+SCHEDULER_TIMER_LABEL+'/'+timerChildLabels[i]);
     page = null;
   
    // Get threads in "pages" of 100 at a time
    while(!page || page.length == 100) {
      Utilities.sleep(1000);
      page = timerChildLabelObject.getThreads(0, 100);
      if (page.length > 0) {
        createLabel(queueChildLabel);
        queueChildLabelObject =  serviceGetUserLabelByName(queueChildLabel);
   
        
        if (queueChildLabelObject) {
          queueLabelObject.addToThreads(page);
          // Move the threads into queueChildLabel
          queueChildLabelObject.addToThreads(page);
                    
        }  
        // Move the threads out of timerLabel
        timerChildLabelObject.removeFromThreads(page);
      }  
    }
    
  }
}



function processQueue(){
   debug('processQueue Activated '+new Date().toString());
  var userPrefs = getUserPrefs(false);
  
   var queueLabel = SCHEDULER_LABEL+'/'+SCHEDULER_QUEUE_LABEL;
      var queueLabelObject =  serviceGetUserLabelByName(queueLabel);
   var queueChildLabels = getUserChildLabels(SCHEDULER_LABEL+'/'+SCHEDULER_QUEUE_LABEL);
  for(var i=0; i<queueChildLabels.length; i++){
    var currentDate = convertToUserDate(new Date());
    var queueChildDate = parseDate(queueChildLabels[i]);
    
    //skip if queuedatetime is not ready to process
    if (currentDate.getTime() < queueChildDate.getTime()) {
      debug('process later');
      continue;
    }
    
      
      var queueChildLabel = SCHEDULER_LABEL+'/'+SCHEDULER_QUEUE_LABEL+'/'+queueChildLabels[i];
      var queueChildLabelObject =  serviceGetUserLabelByName(queueChildLabel);
      var threads = queueChildLabelObject.getThreads();
    var message;
    var draftId;
    //Remove queue child label if nothing to process
    if(threads.length==0){
      deleteLabel(queueChildLabel);
    }
   
     for (var x in threads) { 
       var thread = threads[x];
       var y=0;
       for (y=0; y<thread.getMessageCount(); y++)
       {
         if( GmailApp.getMessageById(threads[x].getMessages()[y].getId()).isDraft() ){
            message = GmailApp.getMessageById(threads[x].getMessages()[y].getId());
            //Logger.log(y+"-------------------\n");
            //Logger.log("MessageIsDraft:"+message.getId());
            //Logger.log(y+"\n-------------------.");         
         }
       }

      try{
        message.isDraft();
      
      }catch (e){
        message = GmailApp.getMessageById(threads[x].getMessages()[0].getId());
      
      }
       
        var draftsList = GmailApp.getDrafts();
        for (var i = 0; i < draftsList.length; i++) {
             if(message.getId() == draftsList[i].getMessageId())
             {
               draftId=draftsList[i].getId();
             }
        }

       //Logger.log("MessageIsDraft:"+message.isDraft()+"\nMessageBody:"+message.getPlainBody());
       //Logger.log("\n^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
       //  return;
       
       if(message.isDraft()){
           forwardDraft(draftId);
           //Logger.log("\nUSED forwardDraftFunction");
           //Logger.log("\n^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
           thread.removeLabel(queueLabelObject);
           thread.removeLabel(queueChildLabelObject);

       }else{
           thread.removeLabel(queueLabelObject);
           thread.removeLabel(queueChildLabelObject);
          if(userPrefs['mark_sent_messages_inbox_unread']){
            GmailApp.markMessageUnread(message);
            //Logger.log("IF mark sent messages inbox unread");
          }
            
       }
     }
    
  }
}