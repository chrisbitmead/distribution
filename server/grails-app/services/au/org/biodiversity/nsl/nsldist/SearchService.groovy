package au.org.biodiversity.nsl.nsldist

import groovy.sql.Sql

import javax.sql.DataSource

class SearchService {

    DataSource dataSource

    Sql getSql() {
        Sql.newInstance(dataSource)
    }

    static Map<String,Object> rowToObject(Feature row) {
        return [
                type      : 'Feature',
                geometry  : [
                        type       : 'Point',
                        coordinates: [row.longitude, row.latitude]
                ],
                properties:  row.properties
//                        [
//                        id : row.id as String,
//                        name           : row.name,
//                        notes:   row.notes
//                ]
        ]
    }

    Map find(String section, String determination, String herbCode, Long accessionNumber, Integer suffix, Integer max) {
        List<String> plants = []
        int totalMapped = 0

        def query = Feature.where {
//            if (section) {
//                sitCode == section
//            }
//            if (determination) {
//                or {
//                    ilike 'name', determination + '%'
//                    ilike 'labelText', determination + '%'
//                }
//            }
//            if (herbCode) {
//                herbCode == herbCode
//            }
//            if (accessionNumber) {
//                accessionNumber == accessionNumber
//            }
//            if (suffix) {
//                suffix == suffix
//            }
//            String username = springSecurityService?.principal?.username
//            if (!username && !User.findByUsername(username)) {
//                publicAccess == 1
//            }
        }
        int total = query.count()

//        long itemId = 0
        def qr = query.list(max: max, {
//            order 'labelText'
//            order 'herbCode', 'asc'
//            order 'accessionNumber', 'asc'
//            order 'suffix', 'asc'
        })
        qr.each { row ->
            if (row.mapped) {
                totalMapped++
            }
//            itemId = row.itemId
            plants.add(rowToObject(row))
        }

        return [ plants: plants, total: total]
    }

    Map findNTNL(String section, String determination, String herbCode, Long accessionNumber, String status, Integer max) {
        List<String> plants = []
        int totalMapped = 0

//        def query = NoTagNoLabel.where {
//            if (herbCode && herbCode != 'NTNL') {
//                id == 0
//            }
//            if (section) {
//                sectionCode == section
//            }
//            if (determination) {
//                ilike 'taxonName', determination + '%'
//            }
//            if (accessionNumber) {
//                id == accessionNumber
//            }
//            if (status) {
//                status == status
//            }
//        }
//        int total = query.count()
//
////        long itemId = 0
//        def qr = query.list(max: max, {
//            order 'taxonName'
//        })
//        qr.each { row ->
//            if (row.decLat) {
//                totalMapped++
//            }
////            itemId = row.itemId
//            plants.add(ntnlRowToObject(row))
//        }

        return [ plants: plants, total: 0]
    }



    /**
     * get theme and other information about all sections
     * @return
     */
    Map getAllSectionData() {
        Sql sql = getSql()
        Map data = [:]

        return data
    }

    List<String> plantSuggestion(String query) {
        Sql sql = getSql()
        List names = ['aaa', 'bbb', 'ccc']
        return names
    }

    List<String> plantSuggestionAll() {
        Sql sql = getSql()
        List names = ['ddd', 'eee', 'fff']
        return names
    }

    List<Map> clones(long item_id) {
        Sql sql = getSql()
        List itemSitIds = []
//        sql.eachRow("""
//with
//item_opar as
//  ( -- get the selected items OPAR
//    select distinct ci.unit_id,
//      case when ir.rel_parent is null then ci.item_id else ci_opar.item_id end as item_id,
//      case when ir.rel_parent is null then ci.herb_code else ci_opar.herb_code end as herb_code,
//      case when ir.rel_parent is null then ci.acc_no else ci_opar.acc_no end as acc_no,
//      case when ir.rel_parent is null then ci.suffix else ci_opar.suffix end as suffix
//    from ibis.collection_item ci
//    join ibis.cg_ref_codes cg on (ci.item_type = cg.rv_low_value) and (cg.rv_domain = 'COLLECTION_ITEM_LIVING.ITEM_TYPE_VEG') -- vegetative items only
//    left join ibis.item_relation ir on (ci.item_id = ir.rel_child) and ir.rel_type_id = 'Lineage' and ir.relationship_desc = 'OPAR' -- only if the relationship is as an OPAR
//    left join ibis.collection_item ci_opar on (ir.rel_parent = ci_opar.item_id)
//    where (ci.item_id = :item_id) -- get OPARs herb_code and acc_no
//  ),
//items_with_same_opar_item as
//  (-- get all children of the selected OPAR that are current garden items
//    select distinct ci.unit_id, ci.item_id, ci.herb_code, ci.acc_no, ci.suffix--, case when ir.rel_parent is null then ci.item_id else ir.rel_parent end as opar_item_id, null as opar_herb_code, null as opar_acc_no
//    from item_opar io
//    join ibis.item_relation ir on (io.item_id = ir.rel_parent) and ir.rel_type_id = 'Lineage' and ir.relationship_desc = 'OPAR' -- get all related items with the same OPAR id
//    join ibis.collection_item ci on (ir.rel_child = ci.item_id) -- get related item details
//    join ibis.cg_ref_codes cg on (ci.item_type = cg.rv_low_value) and (cg.rv_domain = 'COLLECTION_ITEM_LIVING.ITEM_TYPE_VEG') -- vegetative items only
//  ),
//related_OPARs as
//  (-- for the OPAR retrieved above, get all other vegetative items that have the same HERB_CODE, ACC_NO as the OPAR (G0)
//    select distinct ci.unit_id, ci.item_id, ci.herb_code, ci.acc_no, ci.suffix--, ci.item_id as opar_item_id, null as opar_herb_code, null as opar_acc_no
//    from item_opar io
//    join ibis.collection_item ci on ci.herb_code = io.herb_code and ci.acc_no = io.acc_no and io.item_id <> ci.item_id
//    --join ibis.cg_ref_codes cg on (ci.item_type = cg.rv_low_value) and (cg.rv_domain = 'COLLECTION_ITEM_LIVING.ITEM_TYPE_VEG') -- vegetative items only
//    --left join ibis.item_relation ir on (ci.item_id = ir.rel_child) and ir.rel_type_id = 'Lineage' and ir.relationship_desc = 'OPAR' -- only if the relationship is as an OPAR
//  ),
//items_with_related_OPARs as
// (-- get all current garden items with the exact same OPAR id in related_OPARs
//    select distinct ci.unit_id, ci.item_id, ci.herb_code, ci.acc_no, ci.suffix--, case when ir.rel_parent is null then ci.item_id else ir.rel_parent end as opar_item_id, null as opar_herb_code, null as opar_acc_no
//    from related_opars io
//    join ibis.item_relation ir on (io.item_id = ir.rel_parent) and ir.rel_type_id = 'Lineage' and ir.relationship_desc = 'OPAR' -- get all related items with the same OPAR id
//    join ibis.collection_item ci on (ir.rel_child = ci.item_id) -- get related item details
//    join ibis.cg_ref_codes cg on (ci.item_type = cg.rv_low_value) and (cg.rv_domain = 'COLLECTION_ITEM_LIVING.ITEM_TYPE_VEG') -- vegetative items only
//  ),
//self as (select ci.unit_id, ci.item_id, ci.herb_code, ci.acc_no, ci.suffix
//    from ibis.collection_item ci
//    where ci.item_id = :item_id),
//clone_items as
//  (
//  select * from item_opar
//  union
//  select * from items_with_same_opar_item
//  union
//  select * from related_opars
//  union
//  select * from items_with_related_opars
//  minus
//  select * from self
//  )
//-- just return current stock
//select id from $ItemSitNameView.TABLE_NAME isnv where item_id in (select distinct  ci.item_id
//from clone_items cli
//join ibis.collection_item ci on (cli.item_id = ci.item_id)
//join ibis.item_situation isit on (ci.item_id = isit.item_id) and isit.current_sit = '*' and isit.current_qty > 0 -- with current stcok
//join ibis.situation sit on (isit.sit_id = sit.sit_id) and (sit.institution_code = 'ANBG') and (sit.sit_group = 'Garden') -- in the gardens
//where (ci.notes not like '%naturally occurring%' or ci.notes is null)) order by isnv.herb_code, isnv.acc_no, isnv.suffix
//""", [item_id: item_id]) { row ->
//            itemSitIds.add(row.id)
//        }
        List<Map> plants = new ArrayList<>()
//        ItemSitNameView.getAll(itemSitIds).each {
//            plants.add(rowToObject(it))
//        }
        return plants
    }
}
