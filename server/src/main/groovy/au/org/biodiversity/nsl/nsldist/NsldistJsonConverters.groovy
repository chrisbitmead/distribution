package au.org.biodiversity.nsl.nsldist

import grails.plugin.json.builder.JsonGenerator

class NsldistJsonConverters implements JsonGenerator.Converter  {
    @Override
    boolean handles(Class<?> type) {
        User.isAssignableFrom(type)
    }

    @Override
    Object convert(Object value, String key) {
        ((User)value).username
    }
}
