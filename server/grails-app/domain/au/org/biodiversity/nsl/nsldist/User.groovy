package au.org.biodiversity.nsl.nsldist

import grails.compiler.GrailsCompileStatic
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

import java.time.LocalDateTime

@GrailsCompileStatic
@EqualsAndHashCode(includes='username')
@ToString(includes='username', includeNames=true, includePackage=false)
class User implements Serializable {

    private static final long serialVersionUID = 1
    static final long ADMIN_USER_ID = 1
    String username
    String email
    String firstName
    String lastName
    String passwd
    boolean enabled = true
    boolean accountExpired = false
    boolean accountLocked = false
    boolean passwordExpired = false
    LocalDateTime dateCreated
    User userCreated
    LocalDateTime lastUpdated
    User userUpdated

    static transients = [ 'name', 'emailDisplay' ]

    Set<Role> getAuthorities() {
        (UserRole.findAllByUser(this) as List<UserRole>)*.role as Set<Role>
    }

    static constraints = {
        username nullable: false, blank: false, unique: true
        passwd nullable: false, blank: false, password: true
        email nullable: false, blank: false, unique: true, size: 6..320, email: true
        firstName nullable: false, blank: false
        lastName nullable: false, blank: false
        dateCreated display: true
        userCreated display: false, editable: false, nullable: true // Think editable does nothing, and display: controls edit
        lastUpdated display: true
        userUpdated display: false, editable: false, nullable: true // Don't really want it nullable, but has to be
    }

    static mapping = {
        id defaultValue: "nextval('hibernate_sequence')"
        table 'usr'

        enabled defaultValue: 'false'
        accountExpired defaultValue: 'false'
        accountLocked defaultValue: 'false'
        passwordExpired defaultValue: 'false'
        dateCreated defaultValue: "current_timestamp"
        userCreated defaultValue: '1'
        lastUpdated defaultValue: "current_timestamp"
        userUpdated defaultValue: '1'
        version defaultValue: '0'
//        passwd column: '`PASSWORD`'
    }

    static List<User> usersWithRole(String role) {
        return UserRole.findAllByRole(Role.findByAuthority(role)).collect{ (it as UserRole).user }
    }

    String getName() {
        return firstName + ' ' + lastName
    }
    static getPrincipal() {
        Set<User> users = Role.findByAuthority('ROLE_PRINCIPAL').users
        users.size() > 0 ? users.first() : null
    }

    String getEmailDisplay() {
        return email ? "$name <$email>" : null
    }
    void setEmail(String v) {
        this.email = v
        if (!username) {
            username = v
        }
    }
}
