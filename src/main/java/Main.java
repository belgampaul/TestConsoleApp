import be.belgampaul.tennis.be.belgampaul.json.feeds.HttpAddresses;
import be.belgampaul.tennis.domain.tennis.Match;
import be.belgampaul.tennis.domain.tennis.Matches;
import be.belgampaul.tennis.network.NetworkUtils;
import com.nhl.json.live.Game;
import com.nhl.json.live.Scoreboard;
import com.xbet.LiveFeed;
import com.xbet.Value;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.List;

/**
 * User: ikka
 * Date: 4/2/14
 * Time: 5:07 AM
 */
public class Main {
  //logger
  private static final Logger log = Logger.getLogger(Main.class);
  private static Matches matches = new Matches();



  public static void main(String[] args) {
    //System.out.println(DailyInfoWSSerivce.getExchangeRateToRUB(ECurrency.USD.ISO4217_alpha3));

//    testXBetTennisLiveFeedFromSite();
    long startTime = System.currentTimeMillis();
    for (int i = 0; i < 1; i++) {
      try {
        try (BufferedReader br = new BufferedReader(new FileReader("D:/log/xbetJsonLog_test.log"))) {
          for (String line; (line = br.readLine()) != null; ) {
            // process the line.
            //log.debug(line);
            testXbetSoccerLiveFeed(line);
            Thread.sleep(5000);
          }
          // line is not visible here.
        }
      } catch (Exception e) {
        e.printStackTrace();
      }

    }
    System.err.println(System.currentTimeMillis() - startTime + " ms");
  }

  private static void testXBetTennisLiveFeedFromSite() {
    try {
      while (true) {
        //testNHLJsonScoreboard();

        testXbetSoccerLiveFeed(NetworkUtils.getWebPageAsString(HttpAddresses.HTTPS_WWW_1XBET_COM_LIVE_FEED_GET1X2_SPORT_ID_4_COUNT_50_LNG_EN));

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


  private static void testXbetSoccerLiveFeed(String next) throws IOException {
    ObjectMapper mapper = new ObjectMapper();

    Logger.getLogger("be.belgampaul.tennis.log.xbet.json").info(next);
    LiveFeed li = mapper.readValue(next, LiveFeed.class);

    List<Value> value = li.getValue();
    int cnt = 0;
    for (Value v : value) {
//      log.debug(++cnt + ". " + v.toString());
      Number id = v.getId();
//      log.debug(v.getStrictScore());
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


  public static void testNHLJsonScoreboard() throws IOException {
    String requestURL = HttpAddresses.HTTP_LIVE_NHLE_COM_GAME_DATA_REGULAR_SEASON_SCOREBOARDV3_JSONP_LOAD_SCOREBOARD;


    String jsonResponse = NetworkUtils.getWebPageAsString(requestURL);
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
