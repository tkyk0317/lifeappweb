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

// export.
export { isSmartPhone, isTablet, isPc };
