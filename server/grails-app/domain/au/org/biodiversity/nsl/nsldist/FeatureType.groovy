package au.org.biodiversity.nsl.nsldist

import java.time.LocalDateTime

class FeatureType {
    String code
    boolean mappable = false
    LocalDateTime dateCreated
    User userCreated
    LocalDateTime lastUpdated
    User userUpdated

    static constraints = {
        dateCreated display: true
        userCreated display: false, editable: false // Think editable does nothing, and display: controls edit
        lastUpdated display: true
        userUpdated display: false, editable: false // Don't really want it nullable, but has to be
    }
    static mapping = {
        id defaultValue: "nextval('hibernate_sequence')"
        mappable defaultValue: 'false'
        dateCreated defaultValue: "current_timestamp"
        userCreated defaultValue: '1'
        lastUpdated defaultValue: "current_timestamp"
        userUpdated defaultValue: '1'
        version defaultValue: '0'
    }
}
