package au.org.biodiversity.nsl.nsldist

import java.time.LocalDateTime

class Photo {
    String name = '' // CJB DO WE WANT THIS DEFAULT?
    String mimeType
    byte[] data
    LocalDateTime dateCreated
    User userCreated
    LocalDateTime lastUpdated
    User userUpdated

    private static final SIZE_30_MB = 30*1024*1024

    static belongsTo = [album: Album]

    static constraints = {
        mimeType maxSize: 127
        data maxSize: Photo.SIZE_30_MB
        album nullable: true
        mimeType nullable: true
        dateCreated display: true
        userCreated display: false, editable: false // Think editable does nothing, and display: controls edit
        lastUpdated display: true
        userUpdated display: false, editable: false // Don't really want it nullable, but has to be
    }
    static mapping = {
        id defaultValue: "nextval('hibernate_sequence')"
//        data sqlType: 'blob'
        dateCreated defaultValue: "current_timestamp"
        userCreated defaultValue: '1'
        lastUpdated defaultValue: "current_timestamp"
        userUpdated defaultValue: '1'
        version defaultValue: '0'
    }
}
