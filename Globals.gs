
/**********************
 GLOBALS
**********************/
// Top level label name
var SCHEDULER_LABEL = 'GScheduler';
var SCHEDULER_TIMER_LABEL = 'Timer';
var SCHEDULER_QUEUE_LABEL = 'Queue';



// Use default google calendar to determine user timezone
var DEFAULT_TIMEZONE = 'default';


// Global preferences object
var USER_PREFS = null;
var userProps = PropertiesService.getUserProperties();

var EXECUTE_COMMAND_LOGGING = false;

// Retry logic
var NUM_RETRIES = 10;

//Welcome Email Subject
var EMAIL_WELCOME_SUBJECT = 'Welcome to Delay Send';

var SETTINGS_URL = ScriptApp.getService().getUrl();

/* NOTE these names must match the 'name' attribute in HTML */
var DEFAULT_PREFS = {
  move_sent_messages_inbox:true,
  mark_sent_messages_inbox_unread:false,
  nolabel_drafs_to_inbox:false,
  send_message_sms:false,
   localzone: 'default',
  timer: ['1 hour later','2 hours later','3 hours later','One day later','tomorrow 9am','next monday 9am']    
};