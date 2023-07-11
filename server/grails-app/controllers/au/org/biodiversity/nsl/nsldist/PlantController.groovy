package au.org.biodiversity.nsl.nsldist

import grails.converters.JSON

class PlantController {
    static responseFormats = ['json']

    def searchService

    def index() {
        return [data: 'plants']
    }

    def search(String id) {
        List<String> data = searchService.plantSuggestion(id ? id : '')
        return [data: data]
    }

    def searchAll() {
        List<String> data = searchService.plantSuggestionAll()
        return [data: data]
    }

    def find(String section, String determination, String herbCode, Long accessionNumber, Integer suffix, Integer max) {
        log.info "find"
        /**
         * The version of the code as I inherited it, used an "optimisation" whereby
         * the Oracle database constructed the JSON string (with SQL string concatenations)
         * After doing my own testing, I found that the speed was actually a smidge
         * faster when groovy constructs the json through its gson templates.
         * I suspect the reason the groovy is equally as fast is that even getting
         * the fully formed json from Oracle, it had to join all those strings together into
         * one blob before pushing it out, which is expensive, whereas gson can just stream
         * the data out. Or maybe the processing cycles are just cheap.
         */
        Map found = searchService.find(section, determination, herbCode, accessionNumber, suffix, max)
//        Map ntnl = searchService.findNTNL(section, determination, herbCode, accessionNumber, NoTagNoLabel.statuses.FOLLOW_UP, max)
        Map ntnl = [:]
//        Map landscape = searchService.findNTNL(section, determination, herbCode, accessionNumber, NoTagNoLabel.statuses.LANDSCAPE, max)
        Map landscape = [:]

        List<Map> sectionContext = []
        if (section && (determination || herbCode || accessionNumber || suffix)) {
            def secFound = searchService.find(section, null, null, null, null, Integer.MAX_VALUE)
            // sectionContext only contains plants not returned in the main results
            Set itemSitIds = new HashSet()
            found.plants.forEach { itemSitIds.add(it.properties.item_sit_id)}
            secFound.plants.forEach {
                if (!itemSitIds.contains(it.properties.item_sit_id)) {
                    sectionContext.add(it)
                }
            }
        }

        return [total: found.total,
                results: [plants: [features: found.plants]],
                clones: [plants: [features: []]],
                section_context: [plants: [features: sectionContext]],
                landscape: [plants: [features: landscape.plants]],
                ntnl: [plants: [features: ntnl.plants]]
        ]
    }

    def sectionData() {
        log.debug "getting section data"
        Map sectionData = searchService.getAllSectionData()
        String jsonData = (sectionData as JSON).toString()
        render(contentType: "text/json", text: jsonData)
    }
}
