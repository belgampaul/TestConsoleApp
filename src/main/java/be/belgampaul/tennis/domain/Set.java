package be.belgampaul.tennis.domain;

import java.util.LinkedList;

/**
 * User: ikka
 * Date: 4/5/2014
 * Time: 3:18 AM
 */
public class Set extends AbstractTennisMatchObject {
  private LinkedList<Game> games;
  private Game currentGame;
  private int totalPointsPlayed;

  protected Set(Long id, ETennisGameType gameType, Player toServeFirst, Player toReceiveFirst, Player player1, Player player2) {
    super(id, gameType, player1, player2,"0", "0");
    this.player1 = player1;
    this.player2 = player2;
    games = new LinkedList<>();
    currentGame = new Game(1L, gameType, toServeFirst, toReceiveFirst, player1, player2);
    games.add(currentGame);

    currentGame.addPropertyChangeListener(evt -> {
      switch (evt.getPropertyName()) {
        case "winner":
          Player winner = currentGame.getWinner();
          break;
      }
    });
  }


  public Point getCurrentPoint() {
    return currentGame.getCurrentPoint();
  }

  @Override
  public Boolean isCompleted() {
    return getWinner() != null;
  }

  public int getTotalPointsPlayed() {
    int _totalPointsPlayed = 0;
    for (Game game : games) {
      _totalPointsPlayed += game.getTotalPointsPlayed();
    }
    return totalPointsPlayed = _totalPointsPlayed;
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
}
