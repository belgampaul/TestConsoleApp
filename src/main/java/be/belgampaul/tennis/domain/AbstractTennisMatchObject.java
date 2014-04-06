package be.belgampaul.tennis.domain;

import java.beans.PropertyChangeListener;
import java.beans.PropertyChangeSupport;

/**
 * User: ikka
 * Date: 4/5/2014
 * Time: 4:45 AM
 */
abstract public class AbstractTennisMatchObject extends DomainObject implements ICompletable {
  protected Player player1;
  protected Player player2;
  private Player winner;

  protected Point currentPoint;

  protected boolean isCompleted;
  protected ETennisGameType gameType;
  protected String player1ScoreBeforePointIsPlayed;
  protected String player2ScoreBeforePointIsPlayed;

  protected String player1AfterPointPlayedScore;
  protected String player2AfterPointPlayedScore;

  protected PropertyChangeSupport changes = new PropertyChangeSupport(this);

  protected AbstractTennisMatchObject(Long id, ETennisGameType gameType, Player player1, Player player2, String player1ScoreBeforePointIsPlayed, String player2ScoreBeforePointIsPlayed) {
    super(id);
    this.gameType = gameType;
    this.player1 = player1;
    this.player2 = player2;
    this.player1ScoreBeforePointIsPlayed = player1ScoreBeforePointIsPlayed;
    this.player2ScoreBeforePointIsPlayed = player2ScoreBeforePointIsPlayed;
  }

  public void addPropertyChangeListener(PropertyChangeListener l) {
    changes.addPropertyChangeListener(l);
  }

  public void removePropertyChangeListener(PropertyChangeListener l) {
    changes.removePropertyChangeListener(l);
  }

  public Player getWinner() {
    return winner;
  }

  public void setWinner(Player winner) {
    if (this.winner != null) {
      throw new UnsupportedOperationException("The " + this.getClass().getSimpleName() + " has already a winner " + winner);
    }

    if (winner == null) {
      throw new UnsupportedOperationException(this.getClass().getSimpleName() + " winner cannot be null");
    }

    this.winner = winner;
    changeScore(winner);


    changes.firePropertyChange("winner", null /*no winner before*/, winner);
  }

  protected abstract void changeScore(Player winner);

  abstract public String getWinnerScore(String winnerScoreBeforePointIsPlayed, String loserScoreBeforePointIsPlayed, ETennisGameType gameType);

  abstract public String getLoserScore(String player2ScoreBeforePointIsPlayed, String player1ScoreBeforePointIsPlayed, ETennisGameType gameType);
}
