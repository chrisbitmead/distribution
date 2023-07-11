package test.ng

import au.org.biodiversity.nsl.nsldist.Feature
import au.org.biodiversity.nsl.nsldist.FeatureType
import au.org.biodiversity.nsl.nsldist.ReviewType
import au.org.biodiversity.nsl.nsldist.Role
import au.org.biodiversity.nsl.nsldist.User
import au.org.biodiversity.nsl.nsldist.UserRole

import java.time.LocalDateTime


class BootStrap {

    def init = { servletContext ->
//        User.withTransaction {
//            createDefaultLogin()
//        }
    }
    def destroy = {
    }
//    static createDefaultLogin() {
//        if (Role.list().size() < 1) {
//
//            User principal = new User(
//                    username: 'chris',
//                    email: 'xpusostomos@gmail.com',
//                    firstName: 'Chris',
//                    lastName: 'Bitmead',
//                    lastUpdated: LocalDateTime.now(),
//                    dateCreated: LocalDateTime.now()
//            )
//            principal.userCreated = principal
//            principal.userUpdated = principal
//            principal.save()
//
//            Role admin = new Role(
//                    authority: 'ROLE_ADMIN'
//            )
//            admin.save()
//            Role userRole = new Role(
//                    authority: 'ROLE_USER'
//            )
//            userRole.save()
//            Role switchUserRole = new Role(
//                    authority: 'ROLE_SWITCH_USER'
//            )
//            switchUserRole.save()
//            Role guestRole = new Role(
//                    authority: 'ROLE_GUEST'
//
//            )
//            guestRole.save()
//            Role principalRole = new Role(
//                    authority: 'ROLE_PRINCIPAL'
//
//            )
//            principalRole.save()
//
//            UserRole.create(principal, admin)
//            UserRole.create(principal, userRole)
//            UserRole.create(principal, switchUserRole)
//            UserRole.create(principal, principalRole)
//
//
//            User principal2 = new User(
//                    username: 'cbitmead',
//                    email: 'room.turner@gmail.com',
//                    firstName: 'Chris',
//                    lastName: 'Bitmead',
//                    passwd: 'gandalf/'
//            )
//            principal2.save()
//            UserRole.create(principal2, admin)
//            UserRole.create(principal2, userRole)
//            UserRole.create(principal2, switchUserRole)
//            UserRole.create(principal2, principalRole)
//
//
//            principal2.userCreated = principal
//            principal2.userUpdated = principal
//
//            FeatureType bar = new FeatureType(
//                    code: 'BAR'
//            )
//            bar.save()
//            FeatureType girl = new FeatureType(
//                    code: 'GIRL'
//            )
//            girl.save()
//
//            ReviewType girlFace = new ReviewType(
//                    featureType: girl,
//                    code: 'FACE',
//                    description: 'face',
//                    longDescription: 'facial appearance',
//                    rating: true
//            )
//            girlFace.save()
//            ReviewType girlBody = new ReviewType(
//                    featureType: girl,
//                    code: 'BODY',
//                    description: 'body',
//                    longDescription: 'does she have a good figure?',
//                    rating: true
//            )
//            girlBody.save()
//            ReviewType girlGfe = new ReviewType(
//                    featureType: girl,
//                    code: 'GFE',
//                    description: 'Girlfriend experience',
//                    longDescription: 'Does she give a good girlfriend experience?',
//                    rating: true
//            )
//            girlGfe.save()
//            ReviewType girlBed = new ReviewType(
//                    featureType: girl,
//                    code: 'BED',
//                    description: 'Bedroom performance',
//                    longDescription: 'Performance in the bedroom',
//                    rating: true
//            )
//            girlBed.save()
//            ReviewType girlBlowjob = new ReviewType(
//                    featureType: girl,
//                    code: 'BLOWJOB',
//                    description: 'Blowjob performance',
//                    longDescription: 'Blowjob performance, 0 = refused, N/A = did not ask for it',
//                    rating: true
//            )
//            girlBlowjob.save()
//            ReviewType girlAnal = new ReviewType(
//                    featureType: girl,
//                    code: 'ANAL',
//                    description: 'Allows anal',
//                    longDescription: 'Allows use of all her holes',
//                    bool: true
//            )
//            girlAnal.save()
//            ReviewType girlLickPussy = new ReviewType(
//                    featureType: girl,
//                    code: 'LICK_PUSSY',
//                    description: 'Will lick pussy',
//                    longDescription: 'Will lick pussy',
//                    bool: true
//            )
//            girlLickPussy.save()
//            ReviewType girlMff = new ReviewType(
//                    featureType: girl,
//                    code: 'MMF',
//                    description: 'Will do MFF threesome',
//                    longDescription: 'Will do a threesome with another girl',
//                    bool: true
//            )
//            girlMff.save()
//            ReviewType girlMmf = new ReviewType(
//                    featureType: girl,
//                    code: 'MMF',
//                    description: 'Will do MMF threesome',
//                    longDescription: 'Will do a threesome with two guys',
//                    bool: true
//            )
//            girlMmf.save()
//            ReviewType barfinePrice = new ReviewType(
//                    featureType: bar,
//                    code: 'BARFINE',
//                    description: 'Cost of barfine',
//                    longDescription: 'Cost of standard barfine',
//                    cost: true
//            )
//            barfinePrice.save()
//            ReviewType barfineModelPrice = new ReviewType(
//                    featureType: bar,
//                    code: 'BARFINE_MODEL',
//                    description: 'Cost of barfine model',
//                    longDescription: 'Cost of barfine model (best looking girls)',
//                    cost: true
//            )
//            barfineModelPrice.save()
//            ReviewType localBeer = new ReviewType(
//                    featureType: bar,
//                    code: 'LOCAL_BEER',
//                    description: 'Cost of local beer',
//                    longDescription: 'Cost of a locally manufactured beer',
//                    cost: true
//            )
//            localBeer.save()
//            ReviewType localSpirits = new ReviewType(
//                    featureType: bar,
//                    code: 'LOCAL_SPIRITS',
//                    description: 'Cost of local spirits',
//                    longDescription: 'Cost of a locally manufactured spirits',
//                    cost: true
//            )
//            localSpirits.save()
//            ReviewType importedBeer = new ReviewType(
//                    featureType: bar,
//                    code: 'IMPORTED_BEER',
//                    description: 'Cost of local beer',
//                    longDescription: 'Cost of an imported beer',
//                    cost: true
//            )
//            importedBeer.save()
//            ReviewType importedSpirits = new ReviewType(
//                    featureType: bar,
//                    code: 'IMPORTED_SPIRITS',
//                    description: 'Cost of imported spirits',
//                    longDescription: 'Cost of a imported spirits',
//                    cost: true
//            )
//            importedSpirits.save()
//            Feature f = new Feature(
//                    featureType: bar,
//                    longitude: 120.5871917,
//                    latitude: 15.1673121,
//                    name: 'Monsoon bar'
//            )
//            f.save()
//        }
//    }
}
