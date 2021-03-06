package managers;

import dtos.wrappers.OrderByWrapper;
import org.apache.http.HttpHost;
import org.apache.openejb.InternalErrorException;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.document.DocumentField;
import org.elasticsearch.index.query.*;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.sort.SortOrder;
import utils.CommonUtils;

import javax.ejb.Stateless;
import javax.persistence.criteria.Order;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

@Stateless
public class ElasticSearchManager {

	private static final String ELASTIC_SEARCH_HOST = "35.247.176.46";
	private static final int ELASTIC_SEARCH_PORT = 9200;
	private static final Logger LOGGER = Logger.getLogger(ElasticSearchManager.class.toString());

	/*==================index names ==================*/
	private static final String INDEX_MATERIAL = "ccp-material";
	private static final String INDEX_DEBRIS_POST = "ccp-debris_post";
	private static final String INDEX_EQUIPMENT = "ccp-equipment";
	private static final int DEFAULT_ELASTICSEARCH_RESULT_LIMIT = 10000;


	public long searchElastic() {
		RestHighLevelClient client = new RestHighLevelClient(
				RestClient.builder(
						new HttpHost(ELASTIC_SEARCH_HOST, ELASTIC_SEARCH_PORT, "http")
				)
		);

		SearchRequest searchRequest = new SearchRequest("ccp_equipment");
		SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
		searchSourceBuilder.query(QueryBuilders.matchAllQuery());
//		searchSourceBuilder.query(BoolQueryBuilder)
//				.from(0)
//				.size(0)
//				.sort(new ScoreSortBuilder()).sort(new FieldSortBuilder("created_time").order(SortOrder.ASC));
		searchRequest.source(searchSourceBuilder);


		try {
			SearchResponse response = client.search(searchRequest, RequestOptions.DEFAULT);
			SearchHits hits = response.getHits();
			long totalHitsNumber = hits.getTotalHits();
			client.close();
			return totalHitsNumber;
		} catch (IOException e) {
			e.printStackTrace();
			throw new InternalErrorException(e);
		}


	}

	public List<Long> searchEquipment() {
		return this.searchEquipment("xe", 12l, 4l,
				"_score.desc");
	}


	private RestHighLevelClient getNewClient() {
		RestHighLevelClient client = new RestHighLevelClient(
				RestClient.builder(
						new HttpHost(ELASTIC_SEARCH_HOST, ELASTIC_SEARCH_PORT, "http")
				)
		);
		return client;
	}

	public List<Long> searchMaterial(Long contractorId, String query, Long materialTypeId, String orderBy) {
		RestHighLevelClient client = getNewClient();


		SearchRequest searchRequest = new SearchRequest(INDEX_MATERIAL);
		SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
		BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();

		boolQuery.should(query == null || query.isEmpty() ? QueryBuilders.matchAllQuery() : QueryBuilders.matchQuery("name", query).boost(2.0f))
				.should(query == null || query.isEmpty() ? QueryBuilders.matchAllQuery() : QueryBuilders.matchQuery("description", query))
				.should(query == null || query.isEmpty() ? QueryBuilders.matchAllQuery() : QueryBuilders.matchQuery("manufacturer", query))
				.filter(QueryBuilders.termQuery("is_hidden", false))
				.filter(QueryBuilders.termQuery("is_deleted", false))
				.minimumShouldMatch(1);
		;
		if (materialTypeId != null && materialTypeId > 0) {
			boolQuery.filter(QueryBuilders.termQuery("material_type_id", materialTypeId));
		}
		if (contractorId != null && contractorId > 0) {
			boolQuery.mustNot(QueryBuilders.termQuery("contractor_id", contractorId));
		}


		searchSourceBuilder.query(boolQuery);


		// TODO: 4/28/19 must related to orderBy
		searchSourceBuilder.from(0).size(DEFAULT_ELASTICSEARCH_RESULT_LIMIT);

		// TODO: 4/28/19 fix this shit, cant do it now because already done in search DAO

		if (!orderBy.isEmpty()) {
			for (OrderByWrapper orderByWrapper : CommonUtils.getOrderList(orderBy)) {
				if (orderByWrapper.isAscending()) {
					searchSourceBuilder.sort(orderByWrapper.getColumnName(), SortOrder.ASC);
				} else {
					searchSourceBuilder.sort(orderByWrapper.getColumnName(), SortOrder.DESC);
				}
			}
		}
		searchRequest.source(searchSourceBuilder);

		try {
			LOGGER.info(String.format("searchMaterial, sourceBuilder=%s", searchSourceBuilder.toString()));

			SearchResponse response = client.search(searchRequest, RequestOptions.DEFAULT);

			SearchHits hits = response.getHits();
			List<Long> resultList = new ArrayList<>();
			for (SearchHit hit : hits) {
				long id = Long.parseLong(hit.getId());
				resultList.add(id);

			}

			long totalHitsNumber = hits.getTotalHits();
			LOGGER.info(String.format("searchMaterial: totalHistNumber=%s,response=%s", totalHitsNumber, response.toString()));

			client.close();
			return resultList;
		} catch (IOException e) {
			e.printStackTrace();
			throw new InternalErrorException(e);
		}
	}

	public List<Long> searchDebrisPost(Long contractorId
			, String query
			, String orderBy
			) {
		RestHighLevelClient client = getNewClient();


		SearchRequest searchRequest = new SearchRequest(INDEX_DEBRIS_POST);
		SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
		BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();

		boolQuery.should(query == null || query.isEmpty() ? QueryBuilders.matchAllQuery() : QueryBuilders.matchQuery("title", query).boost(2.0f))
				.should(query == null || query.isEmpty() ? QueryBuilders.matchAllQuery() : QueryBuilders.matchQuery("description", query))
				.filter(QueryBuilders.termQuery("is_hidden", false))
				.filter(QueryBuilders.termQuery("is_deleted", false))
				.filter(QueryBuilders.matchQuery("status", "PENDING"))
				.minimumShouldMatch(1);

		if (contractorId != null) {
			boolQuery.mustNot(QueryBuilders.termQuery("requester_id", contractorId));
		}


		searchSourceBuilder.query(boolQuery);

		searchSourceBuilder.from(0).size(DEFAULT_ELASTICSEARCH_RESULT_LIMIT);

		// TODO: 4/28/19 fix this shit, cant do it now because already done in search DAO

		if (!orderBy.isEmpty()) {
			for (OrderByWrapper orderByWrapper : CommonUtils.getOrderList(orderBy)) {
				if (orderByWrapper.isAscending()) {
					searchSourceBuilder.sort(orderByWrapper.getColumnName(), SortOrder.ASC);
				} else {
					searchSourceBuilder.sort(orderByWrapper.getColumnName(), SortOrder.DESC);
				}
			}
		}
		searchRequest.source(searchSourceBuilder);

		try {
			LOGGER.info(String.format("searchdebrisPost, sourceBuilder=%s", searchSourceBuilder.toString()));

			SearchResponse response = client.search(searchRequest, RequestOptions.DEFAULT);

			SearchHits hits = response.getHits();
			List<Long> resultList = new ArrayList<>();
			for (SearchHit hit : hits) {
				long id = Long.parseLong(hit.getId());
				resultList.add(id);

			}

			long totalHitsNumber = hits.getTotalHits();
			LOGGER.info(String.format("searchdebrisPost: totalHistNumber=%s,response=%s", totalHitsNumber, response.toString()));

			client.close();
			return resultList;
		} catch (IOException e) {
			e.printStackTrace();
			throw new InternalErrorException(e);
		}

	}

	public List<Long> searchEquipment(String query, Long contractorId, Long equipmentTypeId,
									  String orderBy) {
		RestHighLevelClient client = getNewClient();


		SearchRequest searchRequest = new SearchRequest(INDEX_EQUIPMENT);
		SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
		BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();

		boolQuery.should(query == null || query.isEmpty() ? QueryBuilders.matchAllQuery() : QueryBuilders.matchQuery("name", query).boost(2.0f))
				.should(query == null || query.isEmpty() ? QueryBuilders.matchAllQuery() : QueryBuilders.matchQuery("description", query))
				.filter(QueryBuilders.termQuery("is_deleted", false))
				.filter(QueryBuilders.matchQuery("status", "AVAILABLE"))
				.minimumShouldMatch(1);
		if (equipmentTypeId != null && equipmentTypeId > 0) {
			boolQuery.filter(QueryBuilders.termQuery("equipment_type_id", equipmentTypeId));
		}
		if (contractorId != null) {
			boolQuery.mustNot(QueryBuilders.termQuery("contractor_id", contractorId));
		}


		searchSourceBuilder.query(boolQuery);

//		 TODO: 4/28/19 only paging after filter all in DAO
		//default size of elastic search is 10 so this is necessary
		searchSourceBuilder.from(0).size(DEFAULT_ELASTICSEARCH_RESULT_LIMIT);


		// TODO: 4/28/19 fix this shit, cant do it now because already done in search DAO
		if (!orderBy.isEmpty()) {
			for (OrderByWrapper orderByWrapper : CommonUtils.getOrderList(orderBy)) {
				if (orderByWrapper.isAscending()) {
					searchSourceBuilder.sort(orderByWrapper.getColumnName(), SortOrder.ASC);
				} else {
					searchSourceBuilder.sort(orderByWrapper.getColumnName(), SortOrder.DESC);
				}
			}
		}
		searchRequest.source(searchSourceBuilder);

		try {
			LOGGER.info(String.format("searchEquipment, sourceBuilder=%s", searchSourceBuilder.toString()));

			SearchResponse response = client.search(searchRequest, RequestOptions.DEFAULT);

			SearchHits hits = response.getHits();
			List<Long> resultList = new ArrayList<>();
			for (SearchHit hit : hits) {
				long id = Long.parseLong(hit.getId());
				resultList.add(id);
			}

			long totalHitsNumber = hits.getTotalHits();
			LOGGER.info(String.format("searchEquipment: totalHistNumber=%s,response=%s", totalHitsNumber, response.toString()));

			client.close();
			return resultList;
		} catch (IOException e) {
			e.printStackTrace();
			throw new InternalErrorException(e);
		}

	}
}

