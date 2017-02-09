//----------------------------------------.
// Check Smartphone or Tablet or PC.
//----------------------------------------.
export function isSmartPhone() {
  var iphone = navigator.userAgent.indexOf('iPhone');
  var ipad = navigator.userAgent.indexOf('iPad');
  var ipod = navigator.userAgent.indexOf('iPod');
  var android = navigator.userAgent.indexOf('Android');
  if((iphone != -1 && ipad == -1) || android != -1 || ipod != -1) return true;
  return false;
}
export function isTablet() {
  var ipad = navigator.userAgent.indexOf('iPad');
  if(ipad != -1) return true;
  return false;
}
export function isPc() {
  return !isSmartPhone() && !isTablet();
}

//----------------------------------------.
// Convert Date and Time.
//----------------------------------------.
export function toDateString(d) {
  return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + (d.getDate())).slice(-2);
}
export function toTimeString(d) {
  return ("0" + (d.getHours())).slice(-2) + ":" + ("0" + (d.getMinutes())).slice(-2);
}
export function fromDateTimeString(d) {
  var year = d.substr(0, 4);
  var month = d.substr(5, 2);
  var day = d.substr(8, 2);
  var hour = d.substr(11, 2);
  var minute = d.substr(14, 2);
  return new Date(year, month, day, hour, minute);
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
