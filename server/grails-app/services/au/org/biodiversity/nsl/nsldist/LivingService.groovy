package au.org.biodiversity.nsl.nsldist


import grails.gorm.transactions.Transactional
import groovy.sql.Sql
import org.springframework.context.MessageSource
import org.springframework.context.i18n.LocaleContextHolder
import javax.sql.DataSource
import java.time.LocalDate

@Transactional
class LivingService {
    DataSource dataSource
    MessageSource messageSource

    static String FAP_ROLE = 'ROLE_LC_GARDEN_PROCESS_ITEM'

    Sql getSql() {
        Sql.newInstance(dataSource)
    }

//    static final String STOCK_TAKE = "Stock take"

    String stocktake(Long itemSitId, Float quantity, String notes) {
        String rtn = null;
        if (quantity == null) {
            rtn = "Invalid quantity"
        } else if (quantity < 0.0) {
            rtn = "Invalid negative quantity"
        } else {
//            ItemSituation isit = ItemSituation.get(itemSitId as Long)
//            def ia = getTodaysAction(isit, 'Stock take')
//            if (ia) {
//                ia.actionQuantity = ia.actionQuantity + (quantity - isit.currentQuantity)
//                ia.currentQuantity = quantity
//                ia.notes = (ia.notes ? ia.notes + ' ' : '') + (notes ?: '')
//            } else {
//                ia = new ItemAction(itemSituation: isit,
//                        action: 'Stock take',
//                        actionQuantity: quantity - isit.currentQuantity,
//                        currentQuantity: quantity,
//                        notes: notes,
//                        date: LocalDate.now())
//            }
//            def mia = getTodaysAction(isit, 'Map')
//            if (mia) {
//                mia.currentQuantity = quantity
//            }
//            isit.currentQuantity = quantity
//            if (!ia.validate()) {
//                rtn = ""
//                ia.errors.allErrors.each {
//                    rtn += messageSource.getMessage(it, LocaleContextHolder.getLocale()) + "  "
//                }
//            } else {
//                ItemAction.withTransaction {
//                    ia.save()
//                }
//            }
        }
        return rtn
    }

//    def getLastAction(ItemSituation isit, String action) {
//        def lst = ItemAction.findAllByItemSituationAndAction(isit, action, [max: 1, sort: 'date', order: 'desc'])
//        def ia
//        if (lst.size() > 0) {
//            ia = lst[0]
//        }
//        return ia
//    }
//
//    def getTodaysAction(ItemSituation isit, String action) {
//        def lia = getLastAction(isit, action)
//        def ia
//        // Multiple moves in a day only create one item action.
//        if (lia) {
////            Calendar ctoday = Calendar.getInstance()
////            ctoday.setTime(new Date())
////            Calendar cal = Calendar.getInstance()
////            cal.setTime(lia.date)
//            LocalDate ctoday = LocalDate.now()
//            if (lia.date && ctoday.year == lia.date.year &&
//                    ctoday.dayOfYear == lia.date.dayOfYear) {
//                ia = lia
//            }
//        }
//        return ia
//    }

    def newNtnl(String name, String notes, Double lat, Double lng) {
        String msg = ''
        Map<String,Object> ntnlJson
//        if (!user) {
//            msg = "not logged in"
//        } else if (!user.hasRole(LivingService.FAP_ROLE)) {
//            msg = "User does not have role " + LivingService.FAP_ROLE
//        } else {
            def ntnl = new Feature(
                    featureType: FeatureType.list().first(),
                    name: name,
                    notes: notes,
                    latitude: lat,
                    longitude: lng
            )
            if (!ntnl.validate()) {
                ntnl.errors.allErrors.each {
                    msg += messageSource.getMessage(it, LocaleContextHolder.getLocale()) + "  "
                }
            } else {
                Feature.withTransaction {
                    ntnl.save()
                }
                ntnlJson = SearchService.rowToObject(ntnl)
            }
//        }
        return [message: msg, ntnl: ntnlJson]
    }

    def updateNtnlStatus(String id, String status) {
//        NoTagNoLabel ntnl = NoTagNoLabel.get(id);
//        String msg = ''
//        if (!ntnl) {
//            msg = "NTNL not found"
////        } else if (!user) {
////            msg = "not logged in"
////        } else if (!user.hasRole(LivingService.FAP_ROLE)) {
////            msg = "User does not have role " + LivingService.FAP_ROLE
//        } else if (!NoTagNoLabel.statuses.values().find { it == status }) {
//            msg = "Invalid NTNL status"
//        } else {
//            ntnl.status = status;
//            if (!ntnl.validate()) {
//                ntnl.errors.allErrors.each {
//                    msg += messageSource.getMessage(it, LocaleContextHolder.getLocale()) + "  "
//                }
//            } else {
//                NoTagNoLabel.withTransaction {
//                    ntnl.save()
//                }
//            }
//        }
        return [message: msg]
    }

    /**
     *
     * @param itemSitId
     * @param lat
     * @param lng

     * @param oldActionId - Indicates that we are doing an undo move, and to delete action
     * @param user
     * @return
     */

    @Transactional
    def moveMarker(String itemSitId, Double lat, Double lng, Long oldMapActionId, Long oldStocktakeActionId) {
        String rtn = null
        Long id = null
        Long sid = null
        LocalDate mapDate = null
//        if (!user) {
//            rtn = "not logged in"
//        } else if (!user.hasRole(LivingService.FAP_ROLE)) {
//            rtn = "User does not have role " + LivingService.FAP_ROLE
        if (lat == null || lng == null) {
            rtn = "Invalid lat/lng"
        } else {
            Feature f = Feature.get(itemSitId as Long)
//            ItemSituation isit = ItemSituation.get(itemSitId as Long)
//            def ia
//            def sia
//            def oia
//            if (oldMapActionId || oldStocktakeActionId) { // undo and delete map move
//                if (oldMapActionId) {
//                    ia = ItemAction.get(oldMapActionId)
//                    ia.delete()
//                }
//                if (oldStocktakeActionId) {
//                    sia = ItemAction.get(oldStocktakeActionId)
//                    sia.delete()
//                }
//            } else {
                // Multiple moves in a day only create one item action.
//                ia = getTodaysAction(isit, 'Map')
//                oia = ia;
//                if (!oia) {
//                    ia = new ItemAction(itemSituation: isit,
//                            action: 'Map',
//                            actionQuantity: 0.0,
//                            currentQuantity: isit.currentQuantity,
//                            status: (isit.decLat ? 'Changed' : 'Placed'),
//                            notes: 'Map position set',
//                            date: LocalDate.now())
//                }
//                mapDate = ia.date
//                sia = getTodaysAction(isit, 'Stock take')
//                if (!sia) {
//                    sia = new ItemAction(itemSituation: isit,
//                            action: 'Stock take',
//                            actionQuantity: 0.0,
//                            currentQuantity: isit.currentQuantity,
//                            date: LocalDate.now())
//                }
//            }
            f.latitude = lat
            f.longitude = lng
//            if (!isit.validate()) {
//                rtn = ""
//                isit.errors.allErrors.each {
//                    rtn += messageSource.getMessage(it, LocaleContextHolder.getLocale()) + "  "
//                }
//            } else if (sia && !sia.validate()) {
//                rtn = ""
//                sia.errors.allErrors.each {
//                    rtn += messageSource.getMessage(it, LocaleContextHolder.getLocale()) + "  "
//                }
//            } else if (ia && !ia.validate()) {
//                rtn = ""
//                ia.errors.allErrors.each {
//                    rtn += messageSource.getMessage(it, LocaleContextHolder.getLocale()) + "  "
//                }
//            } else {
//                ItemSituation.withTransaction {
//                    isit.save()
//                    if (!oldMapActionId && ia) {
//                        ia.save()
//                    }
//                    if (!oldStocktakeActionId && sia) {
//                        sia.save()
//                    }
//                }
//                if (!oldMapActionId && !oldStocktakeActionId && !oia) {
//                    id = ia.id
//                    sid = sia.id
//                }
//            }
//            if (oldMapActionId) {
//                def prev = getLastAction(isit, 'Map')
//                if (prev) {
//                    mapDate = prev.date
//                }
//            }
        }

        return [message: rtn, mapDate: mapDate, mapActionId: id, stocktakeActionId: sid]
    }

    def unmap(String itemSitId) {
        String rtn = null;
//        if (!user) {
//            rtn = "not logged in"
//        } else if (!user.hasRole(LivingService.FAP_ROLE)) {
//            rtn = "User does not have role " + LivingService.FAP_ROLE
//        } else {
        Feature f = Feature.get(itemSitId)
//                ItemSituation isit = ItemSituation.get(itemSitId as Long)
//                ItemAction ia = new ItemAction(itemSituation: isit,
//                        action: 'Map',
//                        actionQuantity: 0.0,
//                        currentQuantity: isit.currentQuantity,
//                        notes: "Map position deleted",
//                        status: 'Removed',
//                        date: LocalDate.now())
                f.latitude = null
                f.longitude = null
        if (!f.validate()) {
            rtn = ""
            f.errors.allErrors.each {
                rtn += messageSource.getMessage(it, LocaleContextHolder.getLocale()) + "  "
            }
        } else {
            ItemSituation.withTransaction {
                ia.save()
            }
        }
//        }
        return rtn
    }

    def requestTag(String itemSitId) {
        String rtn = null;
//        if (!user) {
//            rtn = "not logged in"
//        } else if (!user.hasRole(LivingService.FAP_ROLE)) {
//            rtn = "User does not have role " + LivingService.FAP_ROLE
//        } else {
//                ItemSituation isit = ItemSituation.get(itemSitId as Long)
//                LocalDate now = LocalDate.now()
//                ItemAction ia = new ItemAction(itemSituation: isit,
//                        action: 'Change tag',
//                        actionQuantity: 0.0,
//                        currentQuantity: isit.currentQuantity,
//                        date: now,
//                        status: 'Needs tag',
//                        notes: "Requested new tag"
////                        createdBy: user.username,
////                        createDate: now,
////                        updatedBy: user.username,
////                        updateDate: now
//                )
//                if (!ia.validate()) {
//                    rtn = ""
//                    isit.errors.allErrors.each {
//                        rtn += messageSource.getMessage(it, LocaleContextHolder.getLocale()) + "  "
//                    }
//                } else {
//                    ItemAction.withTransaction {
//                        ia.save()
//                    }
//                }
//        }
        return rtn
    }
}

