function setupStaticLabels() {   
      serviceCreateLabel(SCHEDULER_LABEL);
      serviceCreateLabel(SCHEDULER_LABEL+'/'+SCHEDULER_TIMER_LABEL);
      serviceCreateLabel(SCHEDULER_LABEL+'/'+SCHEDULER_QUEUE_LABEL);
  
}

function sendWelcomeEmail(){
  var userPrefs = getUserPrefs(false);
 
  var body = 'Hi there,';
     body += '<p>Thanks for trying out the DelaySend. This is a free, secure, private (data is held only within your gmail account & your google app script) and convenient method to schedule outgoing messages and return messages to your inbox.</p>';
     body += '<p>GmailDelaySend, is an open source project forked from: https://github.com/webdigi/GmailScheduler </p>';
     body += '<p>This project ultimately provides minor bug fixes and reduces functionaly that I simply did not want to support. I could not have done this without using the webdigi project GmailScheduler as a base. </p>';
     body += '<p>known bugs and limitations:<br/>' +
     'Only one draft per thread, only the last draft will be sent (assumption).<br/>'+'</p>';
     body += '<p>SETTINGS: Please note that you can use this link to access your settings at anytime <a href="'+SETTINGS_URL+'" target="_blank">'+SETTINGS_URL+'</a></p>';
 var options = {      
        htmlBody    : body
      }
      
 if(!userPrefs['email_welcome_sent']){
      GmailApp.sendEmail(getActiveUserEmail(), EMAIL_WELCOME_SUBJECT, body, options);
      userPrefs['email_welcome_sent'] = true;
      serviceSaveProperty(userPrefs,true);
   
 }

}

//Google scripts lets you just treat a draft like a draft and send it. So we greatly simplify things.
function forwardDraft(id) {
  try {
    
    //Logger.log("\n"+"Pre Get draft"+"\n");
    var message = GmailApp.getDraft(id);
    //Logger.log("\n"+"Got draft"+"\n");
    message.send();
    //Logger.log("\n"+"Sent draft"+"\n");

  } catch (e) {
    return e.toString();
  }
}

