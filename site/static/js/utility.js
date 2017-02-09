//----------------------------------------.
// Check Smartphone or Tablet or PC.
//----------------------------------------.
function isSmartPhone() {
  var iphone = navigator.userAgent.indexOf('iPhone');
  var ipad = navigator.userAgent.indexOf('iPad');
  var ipod = navigator.userAgent.indexOf('iPod');
  var android = navigator.userAgent.indexOf('Android');
  if((iphone != -1 && ipad == -1) || android != -1 || ipod != -1) return true;
  return false;
}
function isTablet() {
  var ipad = navigator.userAgent.indexOf('iPad');
  if(ipad != -1) return true;
  return false;
}
function isPc() {
  return !isSmartPhone() && !isTablet();
}

//----------------------------------------.
// Convert Date and Time.
//----------------------------------------.
function toDateString(d) {
  return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + (d.getDate())).slice(-2);
}
function toTimeString(d) {
  return ("0" + (d.getHours())).slice(-2) + ":" + ("0" + (d.getMinutes())).slice(-2);
}

//----------------------------------------.
// Validation Function.
//----------------------------------------.
export function isEmpty(v) {
  if("" === v) return true;
  return false;
}
export function checkEmailValidation(email) {
  if(isEmpty(email)) return true;
  if(email.match(/^[\w.\-]+@[\w\.-]+\.\w{2,}$/)) return true;
  return false;
}
export function checkPasswordValidation(password) {
  if(isEmpty(password)) return true;
  if(password.match(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{8,12}$/)) return true;
  return false;
}

// export.
export { toDateString, toTimeString, isSmartPhone, isTablet, isPc };
