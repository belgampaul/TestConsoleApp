import be.belgampaul.tennis.domain.tennis.Match;
import be.belgampaul.tennis.domain.tennis.Matches;
import com.xbet.LiveFeed;
import com.xbet.Value;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;

import java.io.IOException;
import java.net.URL;
import java.util.List;
import java.util.Scanner;

/**
 * User: ikka
 * Date: 4/2/14
 * Time: 5:07 AM
 */
public class Main {
  //logger
  private static final Logger log = Logger.getLogger(Main.class);
  private static Matches matches = new Matches();

  private static final String HTTPS_WWW_1XBET_COM_LIVE_FEED_GET1X2_SPORT_ID_4_COUNT_50_LNG_EN =
      "https://www.1xbet.com/LiveFeed/Get1x2?sportId=4&count=50&lng=en";
  private static final String HTTP_LIVE_NHLE_COM_GAME_DATA_REGULAR_SEASON_SCOREBOARDV3_JSONP_LOAD_SCOREBOARD =
      "http://live.nhle.com/GameData/RegularSeasonScoreboardv3.jsonp?loadScoreboard";

  public static void main(String[] args) {
    //System.out.println(DailyInfoWSSerivce.getExchangeRateToRUB(ECurrency.USD.ISO4217_alpha3));

    try {
      while (true) {
        //testNHLJsonScoreboard();

        testXbetSoccerLiveFeed();

        for (Match match : matches.values()) {
          //System.out.println(match);

          //log.info("Match StrictScore: " + match.getStrictScore());
          //log.info("Match NotStrictScore: " + match.getNotStrictScore());

        }
        Thread.sleep(1000 * 10L);
      }
    } catch (IOException | InterruptedException e) {
      log.debug("", e);
    }
  }

  private static void testXbetSoccerLiveFeed() throws IOException {
    ObjectMapper mapper = new ObjectMapper();
    String url = HTTPS_WWW_1XBET_COM_LIVE_FEED_GET1X2_SPORT_ID_4_COUNT_50_LNG_EN;
    String next;
    next = getWebPageAsString(url);
    LiveFeed li = mapper.readValue(next, LiveFeed.class);

    List<Value> value = li.getValue();
    int cnt = 0;
    for (Value v : value) {
      System.out.println(++cnt + ". " + v.toString());
      Number id = v.getId();
      System.out.println(v.getStrictScore());
      if (matches.containsKey(id.toString())) {
        Match match = matches.get(id.toString());
        match.refresh(v);
      } else {
        Match match = new Match(v);
        matches.put(id.toString(), match);
      }
    }
    li = null;
  }

  public static String getWebPageAsString(String url) throws IOException {
    long start = System.currentTimeMillis();
    String next = new Scanner(new URL(url).openStream()).useDelimiter("\\Z").next();
    long end = System.currentTimeMillis();
    System.err.println("download time: " + (end - start) + "ms");
    return next;
  }

  private static void testNHLJsonScoreboard() throws IOException {
    String requestURL = HTTP_LIVE_NHLE_COM_GAME_DATA_REGULAR_SEASON_SCOREBOARDV3_JSONP_LOAD_SCOREBOARD;


    String jsonResponse = getWebPageAsString(requestURL);
    String endJson = StringUtils.removeStart(jsonResponse, "loadScoreboard(");
    String jsonResponse2 = StringUtils.removeEnd(endJson, ")");

    ObjectMapper mapper = new ObjectMapper();
    Scoreboard scoreboard = mapper.readValue(jsonResponse2, Scoreboard.class);

    List<Game> games = scoreboard.getGames();
    for (Game game : games) {
      if ("progress".equals(game.getBsc())) {
        System.out.println(game.getAtn() + " " + game.getAts() + ":" + game.getHts() + " " + game.getHtn());
      }
    }
  }
}
