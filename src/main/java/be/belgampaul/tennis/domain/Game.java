package be.belgampaul.tennis.domain;

import be.belgampaul.tennis.constants.TennisConstants;

import java.beans.PropertyChangeListener;
import java.util.LinkedList;

/**
 * User: ikka
 * Date: 4/5/2014
 * Time: 3:18 AM
 */
public class Game extends AbstractTennisMatchObject {

  private LinkedList<Point> points;




  public Game(Long id, ETennisGameType gameType, Player toServeFirst, Player toReceiveFirst, Player player1, Player player2) {
    super(id, gameType, player1, player2, "0", "0");
    this.player1 = player1;
    this.player2 = player2;
    LinkedList<Point> points = new LinkedList<>();
    this.points = points;

    player1ScoreBeforePointIsPlayed = "0";
    player2ScoreBeforePointIsPlayed = "0";

    currentPoint = new Point(id * 100 + 1L, player1, player2, toServeFirst, toReceiveFirst, "0", "0", gameType);
    points.add(currentPoint);

    currentPoint.addPropertyChangeListener(onPointWinnerListener());
  }

  private PropertyChangeListener onPointWinnerListener() {
    return evt -> {
      switch (evt.getPropertyName()) {
        case "winner":
          Player winner = currentPoint.getWinner();
          if (currentPoint.getPlayer1AfterPointPlayedScore().equals(TennisConstants.WIN)) {
            setWinner(player1);
          }

          break;
      }
    };
  }

  public void setPointWinner(Player player) {

  }

  @Override
  public Boolean isCompleted() {
    if (isCompleted) {
      return true;
    } else {
      return isGameCompleted();
    }
  }

  private Boolean isGameCompleted() {
    switch (gameType) {
      case STANDARD:

        break;
      case TIEBREAK:
        break;
      case SUPERTIEBREAK:
        break;
      case SHORT:
        break;
    }
    return null;
  }

  public Point getCurrentPoint() {
    Point last = points.getLast();
    return !last.isCompleted() ? last : null;
  }

  public int getTotalPointsPlayed() {
    int totalPointsPlayed = 0;
    for (Point point : points) {
      if (point.isCompleted()) {
        totalPointsPlayed++;
      }
    }
    return totalPointsPlayed;
  }


  @Override
  protected void changeScore(Player winner) {
    if (winner.equals(player1)) {
      player1AfterPointPlayedScore = getWinnerScore(player1ScoreBeforePointIsPlayed, player2ScoreBeforePointIsPlayed, gameType);

      if (player1AfterPointPlayedScore.equals(TennisConstants.WIN)) {
        player2AfterPointPlayedScore = TennisConstants.LOSS;
      } else {
        player2AfterPointPlayedScore = getLoserScore(player2ScoreBeforePointIsPlayed, player1ScoreBeforePointIsPlayed, gameType);
      }
    }

    if (winner.equals((player2))) {
      player2AfterPointPlayedScore = getWinnerScore(player2ScoreBeforePointIsPlayed, player1ScoreBeforePointIsPlayed, gameType);
      if (player2AfterPointPlayedScore.equals(TennisConstants.WIN)) {
        player1AfterPointPlayedScore = TennisConstants.LOSS;
      } else {
        player1AfterPointPlayedScore = getLoserScore(player1ScoreBeforePointIsPlayed, player2ScoreBeforePointIsPlayed, gameType);
      }
    }
  }

  @Override
  public String getWinnerScore(String winnerScoreBeforePointIsPlayed, String loserScoreBeforePointIsPlayed, ETennisGameType gameType) {
    return null;
  }

  @Override
  public String getLoserScore(String player2ScoreBeforePointIsPlayed, String player1ScoreBeforePointIsPlayed, ETennisGameType gameType) {
    return null;
  }
}
