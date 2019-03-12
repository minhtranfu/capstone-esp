package daos;

import entities.FeedbackEntity;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceContextType;


@Stateless
public class FeedbackDAO extends BaseDAO<FeedbackEntity, Long> {

	@PersistenceContext(type = PersistenceContextType.TRANSACTION)
	EntityManager entityManager;

	@Override
	public FeedbackEntity findByID(Long id) {
		return entityManager.find(FeedbackEntity.class, id);
	}

	@Override
	public void persist(FeedbackEntity feedbackEntity) {

		entityManager.persist(feedbackEntity);
//		super.persist(feedbackEntity);
	}

	@Override
	public FeedbackEntity merge(FeedbackEntity feedbackEntity) {

		return entityManager.merge(feedbackEntity);
//		return super.merge(feedbackEntity);
	}

	@Override
	public void delete(FeedbackEntity feedbackEntity) {
		entityManager.remove(entityManager.contains(feedbackEntity)
				? feedbackEntity : entityManager.merge(feedbackEntity));
	}
}