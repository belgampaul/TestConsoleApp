package be.belgampaul.tennis.events;

/**
 * User: ikka
 * Date: 4/9/14
 * Time: 5:06 AM
 */
public class NewXbetTennisJsonDataArrivedEvent {
  private final String jsonData;

  public NewXbetTennisJsonDataArrivedEvent(String jsonData) {
    this.jsonData = jsonData;
  }

  public String getJsonData() {
    return jsonData;
  }
}
