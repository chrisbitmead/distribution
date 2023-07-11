
package au.org.biodiversity.nsl.nsldist

import grails.compiler.GrailsCompileStatic
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

import java.time.LocalDateTime

@GrailsCompileStatic
@EqualsAndHashCode(includes='authority')
@ToString(includes='authority', includeNames=true, includePackage=false)
class Role implements Serializable {
	Set<User> getUsers() {
		(UserRole.findAllByRole(this) as List<UserRole>)*.user as Set<User>
	}

	private static final long serialVersionUID = 1

	String authority
	LocalDateTime dateCreated
	User userCreated
	LocalDateTime lastUpdated
	User userUpdated

	static constraints = {
		authority nullable: false, blank: false, unique: true
		dateCreated display: true
		userCreated display: false, editable: false // Think editable does nothing, and display: controls edit
		lastUpdated display: true
		userUpdated display: false, editable: false // Don't really want it nullable, but has to be
	}

	static mapping = {
		id defaultValue: "nextval('hibernate_sequence')"
		cache true
		dateCreated defaultValue: "current_timestamp"
		userCreated defaultValue: '1'
		lastUpdated defaultValue: "current_timestamp"
		userUpdated defaultValue: '1'
		version defaultValue: '0'
	}
}
