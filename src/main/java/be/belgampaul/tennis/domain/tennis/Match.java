package be.belgampaul.tennis.domain.tennis;

import be.belgampaul.tennis.domain.ETennisGameType;
import be.belgampaul.tennis.domain.Player;
import com.xbet.Value;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

public class Match extends AbstractTennisMatchObject<Tournament, Set> {
  //logger
  private static final Logger log = Logger.getLogger(Match.class);

  private Player player1;
  private Player player2;
  private Scoreboard scoreboard;


  public Match(Long id, Tournament tournament, Player player1, Player player2) {
    super(id, tournament);
    this.player1 = player1;
    this.player2 = player2;
    this.gameType = ETennisGameType.STANDARD;
  }

  public Match(Value v) {
    super(v.getId().longValue(), null);
    this.player1 = new Player(v.getOpp1(), "");
    this.player2 = new Player(v.getOpp2(), "");

    scoreboard = new Scoreboard(this);
    scoreboard.setCurrentScoreAdvFormat(v.getStrictScore());

    String strictScore = v.getStrictScore();
    System.err.println(scoreboard.getCurrentScoreBoardWithPlayers());
    List<String> scores = Arrays.asList(strictScore.split(";"));
    int ms1 = Integer.parseInt(scores.get(0).split(":")[0]);
    int ms2 = Integer.parseInt(scores.get(0).split(":")[1]);

    int sumMs = ms1 + ms2;


    String[] gameScore = scores.get(6).split(":");
    if (gameScore[0].contains("*")) {
      currentServer = player1;
    }
    if (gameScore[1].contains("*")) {
      currentServer = player2;
    }

    for (int setNumber = 0; setNumber < 5; setNumber++) {
      String[] setScore = scores.get(setNumber + 1).split(":");

      int ss1 = Integer.parseInt(setScore[0]);
      int ss2 = Integer.parseInt(setScore[1]);

      int ssTotal = ss1 + ss2;
      if (ssTotal > 0) {
        Set set = new Set((long) setNumber + 1, this);
        LinkedList<Game> children1 = set.getChildren();

        int cnt = 0;
        cnt = addNewGames(ss1, set, children1, cnt, player1);
        cnt = addNewGames(ss2, set, children1, cnt, player2);
        Player setWinner = ss1 == 7 || (ss1 == 6 && ss2 < 5) ? player1 : ss2 == 7 || (ss2 == 6 && ss1 < 5) ? player2 : null;
        if (setWinner != null) {
          set.setWinner(setWinner);
        }
        children.add(set);
      }
    }


    if (scores.get(1).equals("0:0")) {
      Set set = new Set((long) 1, this);
      LinkedList<Game> games = set.getChildren();
      Game nextGame = set.createNextGame(getCurrentServer(), getCurrentReceiver());
      games.add(1, nextGame);
      children.add(set);

      nextGame.createNextPoint(
          ScoreUtils.convertAdvFormatToNumber(gameScore[0]).replaceAll("\\*", ""),
          ScoreUtils.convertAdvFormatToNumber(gameScore[1]).replaceAll("\\*", ""),
          currentServer,
          getCurrentReceiver()
      );
    }

    if (sumMs < 3 && Math.abs(ms1 - ms2) < 2) {

      Game game = new Game(children.getLast().getChildren().size() + 1L, children.getLast());
      game.createNextPoint(
          ScoreUtils.convertAdvFormatToNumber(gameScore[0]).replaceAll("\\*", ""),
          ScoreUtils.convertAdvFormatToNumber(gameScore[1]).replaceAll("\\*", ""),
          currentServer,
          getCurrentReceiver()
      );

      children.getLast().getChildren().add(game);
    }
    int cnt = 0;
    cnt = 1;
    System.out.println(getNotStrictScore());
    System.out.println("");
  }

  private Player getCurrentReceiver() {
    if (currentServer == null) {
      return null;
    }
    return currentServer.equals(player1) ? player2 : player1;
  }

  private int addNewGames(int ss1, Set set, LinkedList<Game> children1, int cnt, Player winner) {
    for (int j = 0; j < ss1; j++) {
      Game e = new Game((long) cnt++, set);
      e.setWinner(winner);
      children1.add(e);
    }
    return cnt;
  }

  public boolean refresh(Value matchFromJsonData) {
    String strictScoreJsonData = matchFromJsonData.getStrictScore();
    if (scoreboard.setCurrentScoreAdvFormat(strictScoreJsonData)) {
      return false;
    } else {
      System.err.println("score should be updated");
      Player winner = scoreboard.findPreviousPointWinner();
      if (winner != null) {
        setCurrentPointWinner(winner);
        log.debug("NotSctritScore" + getNotStrictScore());
        return true;
      }
    }
    return false;
  }

  public Player getPreviousServerFromScore() {
    Player previousServerFromScore = null;
    if (scoreboard.getPreviousScoreAdvFormat() != null && scoreboard.getCurrentScoreAdvFormat() != null) {
      String gameScore = scoreboard.getPreviousScoreAdvFormat().split(";")[6];
      previousServerFromScore = gameScore.startsWith("*") ? player1 : gameScore.endsWith("*") ? player2 : null;
    }
    if (scoreboard.getPreviousScoreAdvFormat() == null && scoreboard.getCurrentScoreAdvFormat() != null) {
      String gameScore = scoreboard.getCurrentScoreAdvFormat().split(";")[6];
      previousServerFromScore = gameScore.startsWith("*") ? player1 : gameScore.endsWith("*") ? player2 : null;
    }
    return previousServerFromScore;
  }

  public Player getCurrentServerFromScore() {
    currentServer = scoreboard.getCurrentServer();
    return currentServer;
  }

  public enum EScoreParts {
    MATCH_SCORE,
    SET_1_SCORE,
    SET_2_SCORE,
    SET_3_SCORE,
    SET_4_SCORE,
    SET_5_SCORE,
    GAME_SCORE
  }


  public void setCurrentPointWinner(Player player) {
    Point currentPoint = getCurrentPoint();
    if (currentPoint != null) {
      currentPoint.setWinner(player);
    }
  }

  protected void calculateResult() {
    if (getWinner() != null) {
      return;
    }
    switch (gameType) {
      case STANDARD:
        Set last = (Set) this.children.getLast();
        int scorePlayer1 = 0;
        int scorePlayer2 = 0;
        for (Set child : this.children) {
          scorePlayer1 = child.getWinner().equals(getPlayer1()) ? scorePlayer1 + 1 : scorePlayer1;
          scorePlayer2 = child.getWinner().equals(getPlayer2()) ? scorePlayer2 + 1 : scorePlayer2;
        }
        if (isMatchFinished(scorePlayer1, scorePlayer2)) {
          setWinner(scorePlayer1 - scorePlayer2 > 0 ? getPlayer1() : getPlayer2());
        } else {
          createNextSet(scorePlayer1, scorePlayer1);
        }
        break;
    }
  }

  private void createNextSet(int scorePlayer1, int scorePlayer11) {
    int id = this.children.size() + 1;
    Set set = new Set((long) id, this);
    if (id % 2 == 1) {
      set.init(this.toServeFirst, this.toReceiveFirst);
    } else {
      set.init(this.toReceiveFirst, this.toServeFirst);
    }
    set.addPropertyChangeListener(this.propertyChangeListener);
    this.children.add(set);
  }

  private boolean isMatchFinished(int scorePlayer1, int scorePlayer2) {
    return (scorePlayer1 + scorePlayer2 > 2) || (Math.abs(scorePlayer1 - scorePlayer2) > 1);
  }

  public Player getPlayer1() {
    return this.player1;
  }

  public void setPlayer1(Player player1) {
    this.player1 = player1;
  }

  public Player getPlayer2() {
    return this.player2;
  }

  public Player getCurrentServer() {
    return this.currentServer;
  }

  public void init(Player serveFirst, Player receiveFirst) {
    if (this.children.size() == 0) {
      Set set = new Set(1L, this);
      this.children.add(set);
      set.init(serveFirst, receiveFirst);
      set.addPropertyChangeListener(this.propertyChangeListener);
    }
  }

  public void setPlayer2(Player player2) {
    this.player2 = player2;
  }

  public String getNotStrictScore() {
    List<String> strictScore = Arrays.asList("0:0", "0:0", "0:0", "0:0", "0:0", "0:0", "0:0");


    strictScore.set(0, getPlayer1Score() + ":" + getPlayer2Score());


    int cnt = 1;
    for (Set score : this.children) {
      strictScore.set(cnt, score.getPlayer1Score() + ":" + score.getPlayer2Score());
      cnt++;
    }
    Point currentPoint = getCurrentPoint();
    if (currentPoint != null) {
      String player1Score = currentPoint.getPlayer1ScoreAdvFormat();
      String player2Score = currentPoint.getPlayer2ScoreAdvFormat();
      if (currentPoint.getCurrentServer() == null) {
        strictScore.set(6, "0:0");
      } else {
        strictScore.set(6,
            (currentPoint.getCurrentServer().equals(player1) ? "*" : "")
                + player1Score + ":" + player2Score
                + (currentPoint.getCurrentServer().equals(player2) ? "*" : ""));
      }
    } else {
      strictScore.set(6, "0:0");
    }
    return StringUtils.join(strictScore, ";");
  }

  public String getStrictScore() {
    List<String> strictScore = Arrays.asList("0:0", "0:0", "0:0", "0:0", "0:0", "0:0", "0:0");
    strictScore.set(0, getPlayer1Score() + ":" + getPlayer2Score());

    int cnt = 1;
    for (Set score : this.children) {
      strictScore.set(cnt, score.getPlayer1Score() + ":" + score.getPlayer2Score());
      cnt++;
    }
    Point currentPoint = getCurrentPoint();
    if (currentPoint != null) {
      strictScore.set(6, currentPoint.getPlayer1Score() + ":" + currentPoint.getPlayer2Score());
    } else {
      strictScore.set(6, "0:0");
    }
    return StringUtils.join(strictScore, ";");
  }
}