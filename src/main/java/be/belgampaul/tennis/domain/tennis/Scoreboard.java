package be.belgampaul.tennis.domain.tennis;

import be.belgampaul.tennis.domain.IChild;
import be.belgampaul.tennis.domain.Player;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;

import java.util.ArrayList;
import java.util.LinkedList;

/**
 * User: ikka
 * Date: 4/8/14
 * Time: 12:01 AM
 */
public class Scoreboard implements IChild<Match> {
  //logger
  private static final Logger log = Logger.getLogger(Scoreboard.class);

  private Player previousServerFromScore;
  private Player currentServer;
  public final Player player1;
  public final Player player2;

  private String previousScoreAdvFormat;
  private String currentScoreAdvFormat;
  private Match parent;

  private String matchScorePlayer1;
  private String matchScorePlayer2;

  private String set1ScorePlayer1;
  private String set2ScorePlayer1;
  private String set3ScorePlayer1;
  private String set4ScorePlayer1;
  private String set5ScorePlayer1;

  private String set1ScorePlayer2;
  private String set2ScorePlayer2;
  private String set3ScorePlayer2;
  private String set4ScorePlayer2;
  private String set5ScorePlayer2;

  private String gameScorePlayer1;
  private String gameScorePlayer2;

  private LinkedList<String> scoreLog = new LinkedList<>();


  public Scoreboard(Match parent) {
    this.parent = parent;
    player1 = parent.getPlayer1();
    player2 = parent.getPlayer2();

  }

  /**
   * @param currentScoreAdvFormat
   * @return true signals that the score is changed, false indicates that the score is not changed
   */
  public boolean setCurrentScoreAdvFormat(String currentScoreAdvFormat) {
    if (isValidScoreFormat(currentScoreAdvFormat)
        && !currentScoreAdvFormat.equals(this.currentScoreAdvFormat)) {
      previousScoreAdvFormat = this.currentScoreAdvFormat;
      scoreLog.add(currentScoreAdvFormat);
      this.currentScoreAdvFormat = currentScoreAdvFormat;
      String[] scores = getScoreAdvFormatAsArray(currentScoreAdvFormat);
      setScore(scores);
      if (previousScoreAdvFormat == null){
        log.debug("NEW MATCH detected:  " + getCurrentScoreBoardWithPlayers());
      } else {
        log.debug("NEW SCORE detected:  " + getCurrentScoreBoardWithPlayers());

      }
      return true;
    }
    return false;

  }

  /**
   * converts the scores to friendly format score used in this class
   *
   * @param scores
   */
  private void setScore(String[] scores) {
    //let's init score manually, without any lists, to make things clear with the expected format
    matchScorePlayer1 = scores[0];
    matchScorePlayer2 = scores[1];

    set1ScorePlayer1 = scores[2];
    set2ScorePlayer1 = scores[4];
    set3ScorePlayer1 = scores[6];
    set4ScorePlayer1 = scores[8];
    set5ScorePlayer1 = scores[10];

    set1ScorePlayer2 = scores[3];
    set2ScorePlayer2 = scores[5];
    set3ScorePlayer2 = scores[7];
    set4ScorePlayer2 = scores[9];
    set5ScorePlayer2 = scores[11];

    gameScorePlayer1 = scores[12].replaceAll("\\*", "");
    gameScorePlayer2 = scores[13].replaceAll("\\*", "");

    currentServer = getServer(scores);
  }

  private Player getServer(String[] scores) {
    return scores[12].contains("*") ? player1 : scores[13].contains("*") ? player2 : null;
  }

  public static String[] getScoreAdvFormatAsArray(String currentScoreAdvFormat) {
    return currentScoreAdvFormat.replaceAll(";", ":").split(":");
  }

  public static boolean isValidScoreFormat(String currentScoreAdvFormat) {
    //example of valid score format 
    // 0:0;0:0;0:0;0:0;0:0;0:0;*0:0
    // msp1:msp2;ss1p1:ss1p2;ss2p1:ss2p2;ss3p1:ss3p2;ss4p1:ss4p2;ss5p1:ss5p2;gsp1:gsp2
    //* indicates server
    if (currentScoreAdvFormat != null
        && StringUtils.countMatches(currentScoreAdvFormat, ";") == 6
        && StringUtils.countMatches(currentScoreAdvFormat, ":") == 7) {
      return true;
    }
    return true;
  }

  public String getPreviousScoreAdvFormat() {
    return previousScoreAdvFormat;
  }

  public void setPreviousScoreAdvFormat(String previousScoreAdvFormat) {
    this.previousScoreAdvFormat = previousScoreAdvFormat;
  }

  public Player getPreviousServerFromScore() {
    return previousServerFromScore;
  }

  public void setPreviousServerFromScore(Player previousServerFromScore) {
    this.previousServerFromScore = previousServerFromScore;
  }

  public String getCurrentScoreAdvFormat() {
    return currentScoreAdvFormat;
  }

  @Override
  public Match getParent() {
    return parent;
  }

  public Player getPlayer1() {
    return player1;
  }


  public Player getCurrentServer() {
    return currentServer;
  }

  public void setCurrentServer(Player currentServer) {
    this.currentServer = currentServer;
  }

  public Player getPlayer2() {
    return player2;
  }

  public String getCurrentScoreBoardWithPlayers() {
    return player1.getLastName() + " vs " + player2.getLastName() + " " + getCurrentScoreBoard();
  }

  public String getCurrentScoreBoard() {

    return
        matchScorePlayer1 + ":" + matchScorePlayer2 + ";" +
            set1ScorePlayer1 + ":" + set1ScorePlayer2 + ";" +
            set2ScorePlayer1 + ":" + set2ScorePlayer2 + ";" +
            set3ScorePlayer1 + ":" + set3ScorePlayer2 + ";" +
            set4ScorePlayer1 + ":" + set4ScorePlayer2 + ";" +
            set5ScorePlayer1 + ":" + set5ScorePlayer2 + ";" +
            (currentServer == player1 ? "*" : "") + gameScorePlayer1 + ":" + gameScorePlayer2 + (currentServer == player2 ? "*" : "");
  }

  public Player findPreviousPointWinner() {
    if (previousScoreAdvFormat == null) {
      return null;
    }
    TotalScoreHolder currentScoreHolder = new TotalScoreHolder(currentScoreAdvFormat);
    TotalScoreHolder previousScoreHolder = new TotalScoreHolder(previousScoreAdvFormat);
    return currentScoreHolder.previousPointWonBy(previousScoreHolder);
  }

  private class TotalScoreHolder {
    private final Long sc1;
    private final Long sc2;

    private TotalScoreHolder(final String scoreAdvFormat) {
      String[] parts = scoreAdvFormat.replaceAll("\\*", "").split(";");
      ArrayList<String> p1Parts = new ArrayList<>();
      ArrayList<String> p2Parts = new ArrayList<>();
      for (String part : parts) {
        String[] split = part.split(":");
        p1Parts.add(split[0]);
        p2Parts.add(split[1]);
      }

      sc1 = ScoreUtils.calculateScore(p1Parts);
      sc2 = ScoreUtils.calculateScore(p2Parts);
    }

    public Player previousPointWonBy(TotalScoreHolder previousScoreHolder) {
      if (sc1 - previousScoreHolder.getSc1() == 0 && sc2 - previousScoreHolder.getSc2() == 0){
        return null;
      }
      if (sc1 - previousScoreHolder.getSc1() <= 0 && sc2 - previousScoreHolder.getSc2() >= 0) {
        return player2;
      }

      if (sc1 - previousScoreHolder.getSc1() >= 0 && sc2 - previousScoreHolder.getSc2() <= 0) {
        return player1;
      }
      return null;
    }

    public Long getSc1() {
      return sc1;
    }

    public Long getSc2() {
      return sc2;
    }

  }

}
