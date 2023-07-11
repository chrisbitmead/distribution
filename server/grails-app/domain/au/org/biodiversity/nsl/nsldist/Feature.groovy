package au.org.biodiversity.nsl.nsldist

import java.time.LocalDate
import java.time.LocalDateTime

class Feature {
    Long id
    FeatureType featureType
    Feature belongsTo
    String firstName
    String lastName
    String phone
    String facebook
    Double longitude
    Double latitude
    String notes
    Album photos
    LocalDate birthDate

    LocalDateTime dateCreated
    User userCreated
    LocalDateTime lastUpdated
    User userUpdated

    static mapping = {
        id defaultValue: "nextval('hibernate_sequence')"
        dateCreated defaultValue: "current_timestamp"
        userCreated defaultValue: '1'
        lastUpdated defaultValue: "current_timestamp"
        userUpdated defaultValue: '1'
        version defaultValue: '0'
    }
    static constraints = {
        belongsTo nullable: true
        firstName nullable: true
        lastName nullable: true
        facebook nullable: true
        phone nullable: true
        notes nullable: true
        birthDate nullable: true
        longitude nullable: true
        latitude nullable: true
        photos nullable: true
//        unitId nullable: true
//        itemId nullable: true
//        sitCode nullable: true
//        herbCode nullable: true
//        accessionNumber nullable: true
//        suffix nullable: true
//        taxonName nullable: true
//        labelText nullable: true
//        qty nullable: true
//        itemType nullable: true
//        stockDate nullable: true
//        treeDate nullable: true
//        mapDate nullable: true
//        itemSize nullable: true
//        publicAccess nullable: true
//        assessment nullable: true
        dateCreated display: true
        userCreated display: false, editable: false // Think editable does nothing, and display: controls edit
        lastUpdated display: true
        userUpdated display: false, editable: false // Don't really want it nullable, but has to be
    }

    boolean getMapped() {
        return latitude != null
    }
}
