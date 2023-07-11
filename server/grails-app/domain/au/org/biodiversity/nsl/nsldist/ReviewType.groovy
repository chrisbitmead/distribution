package au.org.biodiversity.nsl.nsldist

import java.time.LocalDateTime

class ReviewType {
    FeatureType featureType
    String code
    String description
    String longDescription
    boolean bool = false
    boolean rating = false
    boolean cost = false
    boolean comments = false
    int orderBy = 0

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
        bool defaultValue: 'false'
        rating defaultValue: 'false'
        cost defaultValue: 'false'
        comments defaultValue: 'false'
        orderBy defaultValue: '0'
        dateCreated defaultValue: "current_timestamp"
        userCreated defaultValue: '1'
        lastUpdated defaultValue: "current_timestamp"
        userUpdated defaultValue: '1'
        version defaultValue: '0'
    }
}
