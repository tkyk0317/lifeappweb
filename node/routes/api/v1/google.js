module.exports = {

    //-----------------------------------------.
    // check google login.
    //-----------------------------------------.
    isGoogle: (user) => {
        if(!user.provider) return false;
        return user.provider === 'google';
    },
}
