package au.org.biodiversity.nsl.nsldist


import grails.core.GrailsApplication

//@Secured(['ROLE_LC_GARDEN_PROCESS_ITEM'])
class LivingController {
    GrailsApplication grailsApplication
    LivingService livingService

    def index() {
        render(contentType: "text/text", text: 'Why are we here?')
    }

    def stocktake(Long id, Float quantity, String notes) {
        log.debug("stocktake $id qty: $quantity notes: $notes")
        String message = livingService.stocktake(id, quantity, notes)
        render(view: "stocktake", model: [message: message])
    }

    def moveMarker(String id, Double lat, Double lng, Long oldMapActionId, Long oldStocktakeActionId) {
        log.debug("moveMarker: $id  $lat $lng")
        Map result = livingService.moveMarker(id, lat, lng, oldMapActionId, oldStocktakeActionId)
        render(view: "moveMarker", model: result)
    }

    def newNtnl(String name, String notes, Double lat,  Double lng) {
        log.debug("newNtnl: ")
        Map result = livingService.newNtnl(name, notes, lat, lng)
        log.error result.msg
        render(view: "newNtnl", model: result)
    }

    def updateNtnlStatus(String id, String status) {
        log.debug("updateNtnlStatus: ")
        Map result = livingService.updateNtnlStatus(id, status)
        render(view: "updateNtnlStatus", model: result)
    }

    def unmap(String id) {
        log.debug("unmap: $id")
        String message = livingService.unmap(id)
        render(view: "unmap", model: [message: message])
    }

    def requestTag(String id) {
        log.debug("requestTag: $id")
        String message = livingService.requestTag(id)
        render(view: "requestTag", model: [message: message])
    }
}
