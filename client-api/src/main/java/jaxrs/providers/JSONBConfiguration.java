package jaxrs.providers;

import javax.ejb.Local;
import javax.json.bind.Jsonb;
import javax.json.bind.JsonbBuilder;
import javax.json.bind.JsonbConfig;
import javax.json.bind.annotation.JsonbDateFormat;
import javax.json.bind.annotation.JsonbTypeDeserializer;
import javax.json.bind.annotation.JsonbTypeSerializer;
import javax.ws.rs.ext.ContextResolver;
import javax.ws.rs.ext.Provider;
import java.util.Locale;

@Provider
public class JSONBConfiguration implements ContextResolver<Jsonb> {
	private Jsonb jsonb;

	public JSONBConfiguration() {
		// jsonbConfig offers a lot of configurations.
		JsonbConfig config = new JsonbConfig()
				.withNullValues(true)

				.withDateFormat(JsonbDateFormat.TIME_IN_MILLIS, Locale.ENGLISH)
				.withLocale(Locale.ENGLISH)
				.withEncoding("UTF-8");

//				.withDateFormat("yyyy-MM-dd", Locale.ENGLISH);





		jsonb = JsonbBuilder.create(config);
	}

	@Override
	public Jsonb getContext(Class<?> aClass) {
		return jsonb;
	}
}
