package be.belgampaul.tennis.domain.tennis;


import be.belgampaul.tennis.domain.ETennisGameType;
import be.belgampaul.tennis.domain.Player;
import org.apache.log4j.Logger;

/**
 * User: ikka
 * Date: 4/6/2014
 * Time: 3:54 AM
 */
public class Game extends AbstractTennisMatchObject<Set, Point> {
  //logger
  private static final Logger log = Logger.getLogger(Game.class);

  protected Game(Long id, Set set) {
    super(id, set);

    if (id == 13L) {
      gameType = ETennisGameType.TIEBREAK;
    } else {
      gameType = ETennisGameType.STANDARD;
    }
  }

  @Override
  protected void calculateResult() {
    if (children.size() > 0) {
      log.debug("");
      log.debug("a point has been won by " + children.getLast().getWinner().getLastName());
      log.debug("calcScore: " + getParent().getParent().getNotStrictScore() + " 1xbetScore: " + getParent().getParent().getScoreboard().getCurrentScoreAdvFormat());
      log.debug("");
    }
    if (getWinner() != null) {
      return;
    }

    Point last = children.getLast();
    Integer scoreAfterPointPlayer1 = last.getScoreAfterPointPlayer1();
    Integer scoreAfterPointPlayer2 = last.getScoreAfterPointPlayer2();
    int totalPointsPlayed = scoreAfterPointPlayer1 + scoreAfterPointPlayer2;

    int pointsDifference = Math.abs(scoreAfterPointPlayer1 - scoreAfterPointPlayer2);
    if (isGameFinished(scoreAfterPointPlayer1, scoreAfterPointPlayer2, pointsDifference)) {
      setWinner(scoreAfterPointPlayer1 > scoreAfterPointPlayer2 ? getPlayer1() : getPlayer2());
    } else {
      log.debug("creating next point");
      createNextPoint(scoreAfterPointPlayer1, scoreAfterPointPlayer2, totalPointsPlayed);
    }
    log.debug("calculated score: " + getParent().getParent().getNotStrictScore() + " \nactual 1xbet score: " + getParent().getParent().getScoreboard().getCurrentScoreAdvFormat());
  }

  private void createNextPoint(Integer scoreAfterPointPlayer1, Integer scoreAfterPointPlayer2, int totalPointsPlayed) {
    Point point = new Point((long) (totalPointsPlayed + 1), this);
    Player currentServerFromScore = getParent().getParent().getCurrentServerFromScore();
    point.init(currentServerFromScore, currentServerFromScore.equals(getPlayer1()) ? getPlayer2() : getPlayer1());
    point.setCurrentServer(currentServerFromScore);
    point.setScoreBeforePointPlayer1(scoreAfterPointPlayer1);
    point.setScoreBeforePointPlayer2(scoreAfterPointPlayer2);
    point.addPropertyChangeListener(propertyChangeListener);

    children.add(point);
  }


  public void createNextPoint(String scoreAfterPointPlayer1, String scoreAfterPointPlayer2, Player toServe, Player toReceive) {
    int _scoreAfterPointPlayer1 = 0;
    int _scoreAfterPointPlayer2 = 0;
    if (id == 13L) {
      _scoreAfterPointPlayer1 = Integer.parseInt(scoreAfterPointPlayer1);
      _scoreAfterPointPlayer2 = Integer.parseInt(scoreAfterPointPlayer2);
    } else {
      _scoreAfterPointPlayer1 = Integer.parseInt(ScoreboardUtils.convertAdvFormatToNumber(scoreAfterPointPlayer1));
      _scoreAfterPointPlayer2 = Integer.parseInt(ScoreboardUtils.convertAdvFormatToNumber(scoreAfterPointPlayer2));
    }

    int totalPointsPlayed = _scoreAfterPointPlayer1 + _scoreAfterPointPlayer2;
    Point point = new Point((long) (totalPointsPlayed + 1), this);
    point.init(toServe, toReceive);
    point.setCurrentServer(toServe);
    point.setScoreBeforePointPlayer1(_scoreAfterPointPlayer1);
    point.setScoreBeforePointPlayer2(_scoreAfterPointPlayer2);
    point.addPropertyChangeListener(propertyChangeListener);

    children.add(point);
  }

  private boolean isGameFinished(Integer scoreAfterPointPlayer1, Integer scoreAfterPointPlayer2, int pointsDiffernce) {
    switch (gameType) {
      case STANDARD:
        return !(pointsDiffernce < 2 || (pointsDiffernce >= 2 && scoreAfterPointPlayer1 < 4 && scoreAfterPointPlayer2 < 4));
      case TIEBREAK:
        return (pointsDiffernce >= 2 && (scoreAfterPointPlayer1 > 6 || scoreAfterPointPlayer2 > 6));
    }
    return false;
  }

  @Override
  public Point getCurrentPoint() {
    Point last = children.getLast();
    return last;
  }

  @Override
  public void init(Player serveFirst, Player receiveFirst) {
    super.init(serveFirst, receiveFirst);
    if (children.size() == 0) {
      Point point = new Point(1L, this);
      children.add(point);
      point.init(serveFirst, receiveFirst);

      point.addPropertyChangeListener(propertyChangeListener);
    }
  }

}
