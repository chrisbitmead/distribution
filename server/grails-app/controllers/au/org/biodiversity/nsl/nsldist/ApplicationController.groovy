package au.org.biodiversity.nsl.nsldist
import grails.core.GrailsApplication
import grails.plugins.*

class ApplicationController implements PluginManagerAware {
    GrailsApplication grailsApplication
    GrailsPluginManager pluginManager

    def index() {
        [grailsApplication: grailsApplication, pluginManager: pluginManager]
    }
}
