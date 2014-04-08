package be.belgampaul.tennis.domain;

import com.xbet.FullScore;

import java.util.LinkedList;

/**
 * User: ikka
 * Date: 4/5/2014
 * Time: 3:02 AM
 */
public class Match extends AbstractTennisMatchObject {
  private Player playerToServeFirst;
  private Player playerToReceiveNext;

  private Player winner;
  private FullScore fullScore;
  private LinkedList<Set> sets;
  private Set currentSet;
  private Game currentGame;
  private Point currentPoint;
  private int totalPointsPlayed;

  protected Match(Long id, ETennisGameType tennisGameType, Player player1, Player player2) {
    super(id, ETennisGameType.STANDARD, player1, player2, "0", "0");
    sets = new LinkedList<>();
    currentSet = new Set(id, ETennisGameType.STANDARD, player1, player2, player1, player2);
    sets.add(currentSet);
    isCompleted = false;
  }

  @Override
  protected void changeScore(Player winner) {

  }

  @Override
  public String getWinnerScore(String winnerScoreBeforePointIsPlayed, String loserScoreBeforePointIsPlayed, ETennisGameType gameType) {
    return null;
  }

  @Override
  public String getLoserScore(String player2ScoreBeforePointIsPlayed, String player1ScoreBeforePointIsPlayed, ETennisGameType gameType) {
    return null;
  }

  public Match(Long id, Player player1, Player player2) {
    this(id, ETennisGameType.STANDARD, player1, player2);
  }

  public void setPlayerToServeFirst(Player player) {
    if (isPlaying(player)) {
      playerToServeFirst = player;
    }
  }

  public boolean isPlaying(Player player) {
    boolean res = false;
    if (player != null) {
      res = player.equals(player1) || player.equals(player2);
    }
    return res;
  }


  public Point createNewPoint() {
    if (!isCompleted()) {
      currentPoint = currentSet.getCurrentPoint();
    }
    return currentPoint;
  }

  public void setPlayer1AsPointWinner() throws IllegalAccessException {
    if (currentPoint != null) {
      currentPoint.setWinner(player1);
    }

  }

  public void setPlayer2AsPointWinner() throws IllegalAccessException {
    currentPoint.setWinner(player2);
  }

  @Override
  public Boolean isCompleted() {
    return isCompleted;
  }

  public String getFullScore(){
    for (Set set : sets) {
      if (set.isCompleted()){

      }
    }
    return null;
  }

  public int getTotalPointsPlayed() {
    int _totalPointsPlayed = 0;
    for (Set set : sets) {
      _totalPointsPlayed += set.getTotalPointsPlayed();
    }
    totalPointsPlayed = _totalPointsPlayed;
    return totalPointsPlayed;
  }
}
