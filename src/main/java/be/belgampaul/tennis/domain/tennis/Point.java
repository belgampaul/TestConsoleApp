package be.belgampaul.tennis.domain.tennis;

import be.belgampaul.tennis.domain.Player;
import org.apache.log4j.Logger;

public class Point extends AbstractTennisMatchObject<Game, Point> {
  //logger
  private static final Logger log = Logger.getLogger(Point.class);
  private Integer scoreBeforePointPlayer1 = 0;
  private Integer scoreBeforePointPlayer2 = 0;
  private Integer scoreAfterPointPlayer1 = 0;
  private Integer scoreAfterPointPlayer2 = 0;

  public Point(Long id, Game game) {
    super(id, game);
  }

  public Point(Long id, Game game, Player server, Player receiver, int scoreBeforePointPlayer1, int scoreBeforePointPlayer2, int scoreAfterPointPlayer1, int scoreAfterPointPlayer2) {
    super(id, game);
    this.scoreBeforePointPlayer1 = scoreBeforePointPlayer1;
    this.scoreBeforePointPlayer2 = scoreBeforePointPlayer2;
    this.scoreAfterPointPlayer1 = scoreAfterPointPlayer1;
    this.scoreAfterPointPlayer2 = scoreAfterPointPlayer2;
  }

  @Override
  protected void calculateResultLocal() {
    Player winner = getWinner();
    Player player1 = getParent().getParent().getParent().getPlayer1();
    Player player2 = getParent().getParent().getParent().getPlayer2();
    if (winner != null) {
      if (winner.equals(player1)) {
        this.scoreAfterPointPlayer1 = this.scoreBeforePointPlayer1 + 1;
        this.scoreAfterPointPlayer2 = this.scoreBeforePointPlayer2;
      } else if (winner.equals(player2)) {
        this.scoreAfterPointPlayer2 = this.scoreBeforePointPlayer2 + 1;
        this.scoreAfterPointPlayer1 = this.scoreBeforePointPlayer1;
      }
    }
  }

  public Player getPlayer1() {
    return getParent().getPlayer1();
  }

  public Player getPlayer2() {
    return getParent().getPlayer2();
  }

  public Player getCurrentServer() {
    return currentServer;
  }

  public Point getCurrentPoint() {
    throw new UnsupportedOperationException("No point can decide if it is the current point");
  }

  public void init(Player serveFirst, Player receiveFirst) {
    super.init(serveFirst, receiveFirst);
  }

  public Integer getScoreBeforePointPlayer1() {
    return this.scoreBeforePointPlayer1;
  }

  public void setScoreBeforePointPlayer1(Integer scoreBeforePointPlayer1) {
    this.scoreBeforePointPlayer1 = scoreBeforePointPlayer1;
  }

  public Integer getScoreBeforePointPlayer2() {
    return this.scoreBeforePointPlayer2;
  }

  public void setScoreBeforePointPlayer2(Integer scoreBeforePointPlayer2) {
    this.scoreBeforePointPlayer2 = scoreBeforePointPlayer2;
  }

  public Integer getScoreAfterPointPlayer1() {
    return this.scoreAfterPointPlayer1;
  }

  public void setScoreAfterPointPlayer1(Integer scoreAfterPointPlayer1) {
    this.scoreAfterPointPlayer1 = scoreAfterPointPlayer1;
  }

  public Integer getScoreAfterPointPlayer2() {
    return this.scoreAfterPointPlayer2;
  }

  public void setScoreAfterPointPlayer2(Integer scoreAfterPointPlayer2) {
    this.scoreAfterPointPlayer2 = scoreAfterPointPlayer2;
  }

  public String getPlayerScore(Player player) {
    if (isCompleted()) {
      return "0";
    }
    if (player.equals(getPlayer1())) {
      return String.valueOf(getScoreBeforePointPlayer1());
    }
    if (player.equals(getPlayer2())) {
      return String.valueOf(getScoreBeforePointPlayer2());
    }
    throw new UnsupportedOperationException();
  }

  public String getPlayer1ScoreAdvFormat() {
    String player1Score = getPlayer1Score();
    switch (parent.getId().intValue()) {
      case 13:
        return player1Score;
      default:
        return getScoreAdvFormat(player1Score, getPlayer2Score());
    }
  }

  public String getPlayer2ScoreAdvFormat() {
    String player2Score = getPlayer2Score();
    switch (parent.getId().intValue()) {
      case 13:
        return player2Score;
      default:
        return getScoreAdvFormat(player2Score, getPlayer1Score());
    }
  }

  private String getScoreAdvFormat(String player1Score, String player2Score) {
    int p1Score = Integer.parseInt(player1Score);
    int p2Score = Integer.parseInt(player2Score);
    if ((p1Score > 3) && (p2Score > 3)) {
      if (p1Score > p2Score) {
        return "ADV";
      }
      return "40";
    }
    switch (p1Score) {
      case 0:
        return "0";
      case 1:
        return "15";
      case 2:
        return "30";
      case 3:
        return "40";
    }
    return "ADV";
  }

  @Override
  protected void validateWinner(Player winner) {
    if (currentServer == null) {
      currentServer = getParent().getParent().getParent().getPreviousServerFromScore();
    }
    if (currentServer == null) {
      throw new UnsupportedOperationException("current server is unkown. unable to change winner.");
    }
    super.validateWinner(winner);
  }

  @Override
  protected void calculateResult() {
    log.debug("protected void calculateResult() called. This method should not be implemented and is an indication of faulty design.");
  }
}