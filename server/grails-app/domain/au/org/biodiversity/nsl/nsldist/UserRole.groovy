package au.org.biodiversity.nsl.nsldist

import grails.compiler.GrailsCompileStatic
import grails.gorm.DetachedCriteria
import groovy.transform.ToString
import org.codehaus.groovy.util.HashCodeHelper

import java.time.LocalDateTime

@GrailsCompileStatic
@ToString(cache=true, includeNames=true, includePackage=false)
class UserRole implements Serializable {

	private static final long serialVersionUID = 1

	User user
	Role role
	LocalDateTime dateCreated
	User userCreated
	LocalDateTime lastUpdated
	User userUpdated

	static constraints = {
		user nullable: false
		role nullable: false, validator: { Role r, UserRole ur ->
			if (ur.user?.id) {
				if (exists(ur.user.id, r.id)) {
					return ['userRole.exists']
				}
			}
		}
		dateCreated display: true
		userCreated display: false, editable: false // Think editable does nothing, and display: controls edit
		lastUpdated display: true
		userUpdated display: false, editable: false // Don't really want it nullable, but has to be
	}
	static mapping = {
		table 'usr_role'
		version false
		id composite: ['user', 'role']
		dateCreated defaultValue: "current_timestamp"
		userCreated defaultValue: '1'
		lastUpdated defaultValue: "current_timestamp"
		userUpdated defaultValue: '1'
		version defaultValue: '0'
	}

	@Override
	boolean equals(other) {
		if (other instanceof UserRole) {
			other.userId == user?.id && other.roleId == role?.id
		}
		return false
	}

    @Override
	int hashCode() {
	    int hashCode = HashCodeHelper.initHash()
        if (user) {
            hashCode = HashCodeHelper.updateHash(hashCode, user.id)
		}
		if (role) {
		    hashCode = HashCodeHelper.updateHash(hashCode, role.id)
		}
		hashCode
	}

	static UserRole get(long userId, long roleId) {
		criteriaFor(userId, roleId).get()
	}

	static boolean exists(long userId, long roleId) {
		criteriaFor(userId, roleId).count()
	}

	private static DetachedCriteria criteriaFor(long userId, long roleId) {
		where {
			user == User.load(userId) &&
			role == Role.load(roleId)
		}
	}

	static UserRole create(User user, Role role, boolean flush = false) {
		def instance = new UserRole(user: user, role: role)
		instance.save(flush: flush)
		instance
	}

	static boolean remove(User u, Role r) {
		if (u != null && r != null) {
			where { user == u && role == r }.deleteAll()
		}
		return false
	}

	static int removeAll(User u) {
		u == null ? 0 : where { user == u }.deleteAll() as int
	}

	static int removeAll(Role r) {
		r == null ? 0 : where { role == r }.deleteAll() as int
	}




}
