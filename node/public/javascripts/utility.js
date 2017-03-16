module.exports = {

    //----------------------------------------.
    // Check Smartphone or Tablet or PC.
    //----------------------------------------.
    isSmartPhone: () => {
        var iphone = navigator.userAgent.indexOf('iPhone');
        var ipad = navigator.userAgent.indexOf('iPad');
        var ipod = navigator.userAgent.indexOf('iPod');
        var android = navigator.userAgent.indexOf('Android');
        if((iphone != -1 && ipad == -1) || android != -1 || ipod != -1) return true;
        return false;
    },
    isTable: () => {
        var ipad = navigator.userAgent.indexOf('iPad');
        if(ipad != -1) return true;
        return false;
    },
    isPc: () => {
        return !isSmartPhone() && !isTablet();
    },

    //----------------------------------------.
    // Convert Date and Time.
    //----------------------------------------.
    toDateString: (d) => {
        return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + (d.getDate())).slice(-2);
    },
    toTimeString: (d) => {
        return ("0" + (d.getHours())).slice(-2) + ":" + ("0" + (d.getMinutes())).slice(-2);
    },
    fromDateTimeString: (d) => {
        var year = d.substr(0, 4);
        var month = d.substr(5, 2);
        var day = d.substr(8, 2);
        var hour = d.substr(11, 2);
        var minute = d.substr(14, 2);
        return new Date(year, month - 1, day, hour, minute);
    },
    substrDate: (d) => {
        return d.substr(0, 10);
    },
    substrTime: (d) => {
        return d.substr(11, 5);
    },

    //----------------------------------------.
    // Validation Function.
    //----------------------------------------.
    isEmpty: (v) => {
        if("" === v) return true;
        return false;
    },
    checkEmailValidation: (email) => {
        if("" === email) return true;
        if(email.match(/^[\w.\-]+@[\w\.-]+\.\w{2,}$/)) return true;
        return false;
    },
    checkPasswordValidation: (password) => {
        if("" === password) return true;
        if(password.match(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{8,12}$/)) return true;
        return false;
    }
};
