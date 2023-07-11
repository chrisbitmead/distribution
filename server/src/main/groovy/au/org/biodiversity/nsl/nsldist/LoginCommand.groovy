package au.org.biodiversity.nsl.nsldist


import grails.util.Holders
import grails.validation.Validateable
import org.springframework.context.i18n.LocaleContextHolder

class LoginCommand implements Validateable {
    String username
    String password
    User user
    boolean get = false
    String message
    def messageSource = Holders.applicationContext.getBean("messageSource")

    LoginCommand() {

    }

    static constraints = {
        username validator: { val, obj ->
            if (obj.findUser(val) == null) {
                ['au.gov.environment.ibis.auth.LoginCommand.username.noMatch']
            }
        }
        password validator: { val, obj ->
//            if (obj.findUser(obj.username)) {
//                String error = obj.findUser(obj.username).checkCredentials(val)
//                if (error) {
//                    [ error ]
//                }
//            }
        }
        user nullable: true
        message nullable: true
    }

    String getMessage() {
        if (this.message) {
            return message;
        } else {
            String rtn = errors.allErrors.collect {
                messageSource.getMessage(it, LocaleContextHolder.getLocale())
            }.join(", ")
            return rtn;
        }
    }

    /**
     * Cache the user object
     * @param username
     * @return
     */
    User findUser(String username) {
        if (this.user == null || this.user.username != username) {
            this.user = User.findByUsername(username)
        }
        this.user
    }

    String vClass(def bean, String field) {
        bean.hasErrors() && !bean.get ? (bean.errors.getFieldError(field) ? 'is-invalid' : 'is-valid') : ''
    }
}
