// Script-as-app template.
function doGet() {
 Logger.log("doGet");
 return HtmlService.createTemplateFromFile('User_UI.html').evaluate();
}

function savePrefs(form_object) {
  return savePrefsFromForm(form_object);
}

function getPrefs() {
  Logger.log("getPrefs called");
  return loadPrefsForForm();
}

function restoreDefaultPrefs(form_object) {
  return clearPreferences();
}

