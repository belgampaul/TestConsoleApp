package be.belgampaul.tennis.domain;

import be.belgampaul.tennis.constants.TennisConstants;

/**
 * User: ikka
 * Date: 4/5/2014
 * Time: 3:18 AM
 */
public class Point extends AbstractTennisMatchObject {
  private Player server;
  private Player receiver;

  private int nbBreakPoints;
  private int nbGamePoints;
  private int nbMatchPoints;
  private int nbSetPoints;


  protected Point(Long id, Player player1, Player player2, Player server, Player receiver, String player1ScoreBeforePointIsPlayed, String player2ScoreBeforePointIsPlayed, ETennisGameType gameType) {
    super(id, gameType, player1, player2, player1ScoreBeforePointIsPlayed, player2ScoreBeforePointIsPlayed);

    this.server = server;
    this.receiver = receiver;
  }



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

  public String getLoserScore(String loserScoreBeforePointIsPlayed, String winnerScoreBeforePointIsPlayed, ETennisGameType gameType) {
    switch (gameType) {
      case STANDARD:
        switch (loserScoreBeforePointIsPlayed) {
          case TennisConstants.ADV:
            return TennisConstants.FORTY;
          default:
            return loserScoreBeforePointIsPlayed;
        }
    }
    return loserScoreBeforePointIsPlayed;
  }

  @Override
  public String getWinnerScore(String winnerScoreBeforePointIsPlayed, String loserScoreBeforePointIsPlayed, ETennisGameType gameType) {
    switch (gameType) {
      case STANDARD:
        switch (winnerScoreBeforePointIsPlayed) {
          case TennisConstants.LOVE:
            return TennisConstants.FIFTEEN;

          case TennisConstants.FIFTEEN:
            return TennisConstants.THIRTY;

          case TennisConstants.THIRTY:
            return TennisConstants.FORTY;

          case TennisConstants.FORTY:
            if (TennisConstants.ADV.equals(loserScoreBeforePointIsPlayed)) {
              return TennisConstants.FORTY;
            }
            return TennisConstants.ADV;

          case TennisConstants.ADV:
            return TennisConstants.WIN;
        }

      case TIEBREAK:
        return String.valueOf(Integer.parseInt(winnerScoreBeforePointIsPlayed) + 1);
    }
    throw new UnsupportedOperationException("Cannot get winner score");
  }

  @Override
  public Boolean isCompleted() {
    return isCompleted = this.getWinner()!= null;
  }

  public String getPlayer1ScoreBeforePointIsPlayed() {
    return player1ScoreBeforePointIsPlayed;
  }

  public String getPlayer2ScoreBeforePointIsPlayed() {
    return player2ScoreBeforePointIsPlayed;
  }

  public String getPlayer1AfterPointPlayedScore() {
    return player1AfterPointPlayedScore;
  }

  public String getPlayer2AfterPointPlayedScore() {
    return player2AfterPointPlayedScore;
  }

  public ETennisGameType getGameType() {
    return gameType;
  }

  public int getNbSetPoints() {
    return nbSetPoints;
  }

  public int getNbMatchPoints() {
    return nbMatchPoints;
  }

  public int getNbGamePoints() {
    return nbGamePoints;
  }

  public int getNbBreakPoints() {
    return nbBreakPoints;
  }

  public Player getReceiver() {
    return receiver;
  }

  public Player getServer() {
    return server;
  }

  public Player getPlayer2() {
    return player2;
  }

  public Player getPlayer1() {
    return player1;
  }

  @Override
  public String toString() {
    return "Point{" +
        "id=" + id +
        ", server=" + server +
        ", receiver=" + receiver +
        ", winner=" + getWinner() +
        ", nbBreakPoints=" + nbBreakPoints +
        ", nbGamePoints=" + nbGamePoints +
        ", nbMatchPoints=" + nbMatchPoints +
        ", nbSetPoints=" + nbSetPoints +
        ", player1ScoreBeforePointIsPlayed='" + player1ScoreBeforePointIsPlayed + '\'' +
        ", player2ScoreBeforePointIsPlayed='" + player2ScoreBeforePointIsPlayed + '\'' +
        ", gameType=" + gameType +
        ", player1AfterPointPlayedScore='" + player1AfterPointPlayedScore + '\'' +
        ", player2AfterPointPlayedScore='" + player2AfterPointPlayedScore + '\'' +
        '}';
  }
}
