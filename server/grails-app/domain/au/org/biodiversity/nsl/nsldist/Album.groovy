package au.org.biodiversity.nsl.nsldist

import grails.databinding.BindUsing
import java.time.LocalDateTime

class Album {
    String name = '' // CJB DO WE WANT THIS DEFAULT?
    @BindUsing({ obj, source ->
        return source['photos'] // huh, does this do anything?
    })
    Set<Photo> photos = []
    LocalDateTime dateCreated
    User userCreated
    LocalDateTime lastUpdated
    User userUpdated

    static hasMany = [photos: Photo]

    static constraints = {
        dateCreated display: true
        userCreated display: false, editable: false // Think editable does nothing, and display: controls edit
        lastUpdated display: true
        userUpdated display: false, editable: false // Don't really want it nullable, but has to be
    }

    static mapping = {
        id defaultValue: "nextval('hibernate_sequence')"
        photos cascade: 'all-delete-orphan'
        dateCreated defaultValue: "current_timestamp"
        userCreated defaultValue: '1'
        lastUpdated defaultValue: "current_timestamp"
        userUpdated defaultValue: '1'
        version defaultValue: '0'
    }

    boolean isEmpty() {
        new ArrayList<Photo>(photos).each {
            if (it.data == null || it.data.length == 0) {
                photos.remove(it)
            }
        }
        photos.size() == 0
    }

    def beforeValidate() {
        new ArrayList<Photo>(photos).forEach {
            if (!it.data || it.data.length == 0) {
                removeFromPhotos(it)
                it.delete()
            }
        }
    }

    static Album paramsToAlbum(Map attachments) {
        def photo
        List<Photo> photos = []
        for(int i = 0; (photo = attachments.get("photos[${i}]".toString())) != null; i++) {
            if (photo.data.part.fileItem.size != 0L) {
                Photo p = new Photo(
                        name: photo.data.filename,
                        data: photo.data,
                        mimeType: photo.data.part.fileItem.contentType
                )
                photos.add(p)
            }
        }
        return new Album(photos: photos)
    }
}
