class Auth {
    static isLogIn() {
        return !!localStorage.currentUser;
    }

    static logOut() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentProfile');
        window.location.replace('/login');
    }

    static ifNotLogInRedirect() {
        if (!Auth.isLogIn()) {
            let path = window.location.pathname;
            if (path !== '/login') {
                localStorage.setItem('redirected_from',path);
            }
            window.location.replace('/login');
        }
    }

    static getSession()
    {
        if (Auth.isLogIn()) {
            return JSON.parse(localStorage.currentUser)
        }
    }
}

export default Auth;